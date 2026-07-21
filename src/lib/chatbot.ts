"use server";

import { prisma, safeDbQuery } from "@/lib/prisma";
import { generateTextEmbedding, cosineSimilarity } from "@/lib/embeddings";
import { hermesChat, cohereChat } from "@/features/ai/src/providers";

async function getChatHistoryFromDb(sessionId: string) {
  return await safeDbQuery(async () => {
    return prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
      take: 10,
    });
  }, []);
}

async function saveChatMessage({
  sessionId,
  role,
  content,
  userId,
}: {
  sessionId: string;
  role: "USER" | "ASSISTANT";
  content: string;
  userId?: string | null;
}) {
  await safeDbQuery(async () => {
    return prisma.chatMessage.create({
      data: {
        sessionId,
        role,
        content,
        userId: userId ?? null,
      } as any,
    });
  });
}

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

    const queryEmbedding = await generateTextEmbedding(query);

    const result = await safeDbQuery(async () => {
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

    const knowledgeWithScores = (result.data as any[])
      .map((entry) => ({
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

    const knowledgeResult = await findRelevantKnowledge(question, {
      type: contextType,
      limit: 3,
    });

    const relevantKnowledge = knowledgeResult.success
      ? knowledgeResult.data || []
      : [];

    const context = relevantKnowledge
      .map((k: any) => `### ${k.title}\n${k.content}`)
      .join("\n\n");

    const systemMessage = `You are a helpful assistant for a marriage matching and educational platform. 
Use the following context to answer the user's question accurately and helpfully.
If the context doesn't contain enough information, say so and provide general guidance.

Context:
${context}
`;

    let chatHistory: any[] = [];
    if (sessionId) {
      const historyResult = await getChatHistoryFromDb(sessionId);
      if (historyResult.success && historyResult.data) {
        chatHistory = historyResult.data.map((m: any) => ({
          role: m.role.toLowerCase() === "assistant" ? "assistant" : "user",
          content: m.content,
        }));
      }
    }

    const messages = [
      { role: "system" as const, content: systemMessage },
      ...chatHistory,
      { role: "user" as const, content: question },
    ];

    let answer: string;
    try {
      answer = await hermesChat({
        messages,
        temperature: 0.7,
        maxOutputTokens: 700,
      });
    } catch (hermesErr) {
      console.error("Hermes chat failed, falling back to Cohere:", hermesErr);
      answer = await cohereChat({
        messages,
        model: "command-a-reasoning-08-2025",
      });
    }

    if (sessionId) {
      await saveChatMessage({
        sessionId,
        role: "USER",
        content: question,
        userId: userId ?? null,
      });
      await saveChatMessage({
        sessionId,
        role: "ASSISTANT",
        content: answer,
        userId: userId ?? null,
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
