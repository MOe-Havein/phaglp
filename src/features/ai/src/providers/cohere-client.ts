import { CohereClient } from "cohere-ai";

let cohereInstance: CohereClient | null = null;

export function getCohereClient(): CohereClient | null {
  if (cohereInstance) return cohereInstance;

  const token = process.env.COHERE_API_KEY?.trim();
  if (!token) return null;

  cohereInstance = new CohereClient({ token });
  return cohereInstance;
}
