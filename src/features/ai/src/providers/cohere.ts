import { CohereClient } from "cohere-ai";

let cohereInstance: CohereClient | null = null;

function getCohereClient() {
  if (cohereInstance) return cohereInstance;

  const token = process.env.COHERE_API_KEY?.trim();
  if (!token) {
    throw new Error("COHERE_API_KEY environment variable is required");
  }

  cohereInstance = new CohereClient({ token });
  return cohereInstance;
}

export type CohereChatOptions = {
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  model?: string;
};

export async function cohereChat(options: CohereChatOptions) {
  const client = getCohereClient();
  const response = await client.v2.chat({
    model: options.model || "command-a-reasoning-08-2025",
    messages: options.messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const textContent = response.message?.content?.find(
    (item) => item.type === "text",
  );
  return textContent?.type === "text"
    ? textContent.text
    : "I couldn't generate a response.";
}
