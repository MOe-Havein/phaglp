import { CohereClient } from "cohere-ai"

let cohereInstance: CohereClient | null = null

function getCohereClient() {
  if (cohereInstance) return cohereInstance

  const token = process.env.COHERE_API_KEY?.trim()
  if (!token) {
    throw new Error("COHERE_API_KEY environment variable is required")
  }

  cohereInstance = new CohereClient({
    token,
  })
  return cohereInstance
}

const EMBEDDING_MODEL = "embed-english-v3.0"
const EMBEDDING_VERSION = "embed-english-v3.0"

/**
 * Generate embedding for text using Cohere's embedding model
 */
export async function generateTextEmbedding(text: string): Promise<number[]> {
  const cohere = getCohereClient()
  try {
    const response = await cohere.embed({
      texts: [text],
      model: EMBEDDING_MODEL,
      inputType: "search_document",
    })

    if (Array.isArray(response.embeddings)) {
      return response.embeddings[0]
    }
    throw new Error("Failed to generate embedding: Invalid response format")
  } catch (error) {
    console.error("Error generating embedding:", error)
    throw new Error("Failed to generate embedding")
  }
}

/**
 * Generate embeddings for multiple texts in batch
 */
export async function generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
  const cohere = getCohereClient()
  try {
    const response = await cohere.embed({
      texts,
      model: EMBEDDING_MODEL,
      inputType: "search_document",
    })

    if (Array.isArray(response.embeddings)) {
      return response.embeddings
    }
    throw new Error("Failed to generate batch embeddings: Invalid response format")
  } catch (error) {
    console.error("Error generating batch embeddings:", error)
    throw new Error("Failed to generate batch embeddings")
  }
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error("Vectors must have the same length")
  }

  let dotProduct = 0
  let magnitudeA = 0
  let magnitudeB = 0

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    magnitudeA += vecA[i] * vecA[i]
    magnitudeB += vecB[i] * vecB[i]
  }

  magnitudeA = Math.sqrt(magnitudeA)
  magnitudeB = Math.sqrt(magnitudeB)

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0
  }

  return dotProduct / (magnitudeA * magnitudeB)
}

export { EMBEDDING_VERSION }
