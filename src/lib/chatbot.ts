"use server";

import { prisma, safeDbQuery } from "@/lib/prisma";
import { generateTextEmbedding, cosineSimilarity } from "@/lib/embeddings";
import { CohereClient } from "cohere-ai";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

let cohereInstance: CohereClient | null = null;

function getCohereClient() {
  if (cohereInstance) return cohereInstance;

  const token = process.env.COHERE_API_KEY?.trim();
  if (!token) {
    throw new Error("COHERE_API_KEY environment variable is required");
  }

  cohereInstance = new CohereClient({
    token,
  });
  return cohereInstance;
}

/**
 * Add knowledge to the knowledge base with embedding
 */
export async function addKnowledge(data: {
  title: string;
  content: string;
  type: string;
  metadata?: any;
}) {
  try {
    const embedding = await generateTextEmbedding(data.content);

    return await safeDbQuery(async () => {
      return prisma.knowledgeBase.create({
        data: {
          title: data.title,
          content: data.content,
          type: data.type,
          embedding,
          metadata: data.metadata,
        },
      });
    });
  } catch (error: any) {
    console.error("Add knowledge error:", error);
    return {
      success: false,
      error: error.message || "Failed to add knowledge",
    };
  }
}

/**
 * Find relevant knowledge entries based on query similarity
 */
export async function findRelevantKnowledge(
  query: string,
  options: {
    limit?: number | undefined;
    type?: string | undefined;
    minSimilarity?: number | undefined;
  } = {},
) {
  try {
    const { limit = 3, type, minSimilarity = 0.3 } = options;

    // Generate embedding for the query
    const queryEmbedding = await generateTextEmbedding(query);

    const result = await safeDbQuery(async () => {
      // Get all knowledge entries (filtered by type if specified)
      const queryArgs: any = {};
      if (type) {
        queryArgs.where = { type };
      }
      return prisma.knowledgeBase.findMany(queryArgs);
    }, []);

    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.error || "Failed to fetch knowledge base",
      };
    }

    // Calculate similarity scores
    const knowledgeWithScores = result.data
      .map((entry: any) => ({
        ...entry,
        similarity: cosineSimilarity(queryEmbedding, entry.embedding),
      }))
      .filter((entry: any) => entry.similarity >= minSimilarity)
      .sort((a: any, b: any) => b.similarity - a.similarity)
      .slice(0, limit);

    return { success: true, data: knowledgeWithScores };
  } catch (error: any) {
    console.error("Find relevant knowledge error:", error);
    return {
      success: false,
      error: error.message || "Failed to find relevant knowledge",
    };
  }
}

/**
 * Generate a chat answer via Cohere (fallback when Hermes isn't configured
 * or fails). Embeddings/RAG retrieval remain on Cohere regardless.
 */
async function cohereChat(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  _systemMessage: string,
  _question: string,
): Promise<string> {
  const cohere = getCohereClient();
  const response = await cohere.v2.chat({
    model: "command-a-reasoning-08-2025",
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });

  const textContent = response.message?.content?.find(
    (item) => item.type === "text",
  );
  return textContent?.type === "text"
    ? textContent.text
    : "I couldn't generate a response.";
}

/**
 * Answer a question using RAG (Retrieval Augmented Generation)
 */
export async function answerQuestion(
  question: string,
  options: {
    contextType?: string | undefined;
    sessionId?: string | undefined;
    userId?: string | undefined;
  } = {},
) {
  try {
    const { contextType, sessionId, userId } = options;

    // Retrieve relevant knowledge
    const knowledgeResult = await findRelevantKnowledge(question, {
      type: contextType,
      limit: 3,
    });

    const relevantKnowledge = knowledgeResult.success
      ? knowledgeResult.data || []
      : [];

    // Build context from retrieved knowledge
    const context = relevantKnowledge
      .map((k: any) => `### ${k.title}\n${k.content}`)
      .join("\n\n");

    // Create system message with context
    const systemMessage = `You are a helpful assistant for a marriage matching and educational platform. 
Use the following context to answer the user's question accurately and helpfully.
If the context doesn't contain enough information, say so and provide general guidance.

Context:
${context}
`;

    // Get chat history if session provided
    let chatHistory: any[] = [];
    if (sessionId) {
      const historyResult = await safeDbQuery(async () => {
        return prisma.chatMessage.findMany({
          where: { sessionId },
          orderBy: { createdAt: "asc" },
          take: 10, // Last 10 messages for context
        });
      }, []);

      if (historyResult.success && historyResult.data) {
        chatHistory = historyResult.data.map((m: any) => ({
          role: m.role,
          content: m.content,
        }));
      }
    }

    // Build the message list (system + history + user)
    const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
      { role: "system", content: systemMessage },
      ...chatHistory.map((m) => ({
        role: m.role.toLowerCase() as "user" | "assistant",
        content: m.content,
      })),
      { role: "user", content: question },
    ];

    // Prefer the Hermes Agent OpenAI-compatible endpoint when configured.
    // Falls back to Cohere (embeddings/RAG stay on Cohere either way).
    const HERMES_BASE = process.env.HERMES_API_BASE?.trim();
    const HERMES_KEY = process.env.HERMES_API_KEY?.trim();
    const HERMES_MODEL = process.env.HERMES_MODEL?.trim() || "auto";

    let answer: string;
    if (HERMES_BASE && HERMES_KEY) {
      try {
        const hermes = createOpenAI({ baseURL: HERMES_BASE, apiKey: HERMES_KEY });
        const { text } = await generateText({
          model: hermes(HERMES_MODEL === "auto" ? "gpt-4o-mini" : HERMES_MODEL),
          messages,
          temperature: 0.7,
          maxOutputTokens: 700,
        });
        answer = text.trim() || "I couldn't generate a response.";
      } catch (hermesErr) {
        console.error("Hermes chat failed, falling back to Cohere:", hermesErr);
        answer = await cohereChat(messages, systemMessage, question);
      }
    } else {
      answer = await cohereChat(messages, systemMessage, question);
    }

    // Save messages to database if session provided
    if (sessionId) {
      await safeDbQuery(async () => {
        return prisma.$transaction([
          prisma.chatMessage.create({
            data: {
              sessionId,
              role: "USER",
              content: question,
              userId,
            } as any,
          }),
          prisma.chatMessage.create({
            data: {
              sessionId,
              role: "ASSISTANT",
              content: answer,
            },
          }),
        ]);
      });
    }

    return {
      success: true,
      data: {
        answer,
        sources: relevantKnowledge.map((k: any) => ({
          title: k.title,
          type: k.type,
          similarity: Math.round(k.similarity * 100),
        })),
      },
    };
  } catch (error: any) {
    console.error("Answer question error:", error);
    return {
      success: false,
      error: error.message || "Failed to generate answer",
    };
  }
}

/**
 * Get chat history for a session
 */
export async function getChatHistory(sessionId: string) {
  return await safeDbQuery(async () => {
    return prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
  }, []);
}
