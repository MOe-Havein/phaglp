/**
 * Chat utility helpers for use in server components and API routes.
 */

interface ChatMessageLike {
  id: string;
  sessionId: string;
  role: string;
  content: string;
  createdAt: Date;
  [key: string]: unknown;
}

/**
 * Groups an array of chat messages by their `sessionId`.
 * Preserves the original ordering of messages within each session.
 *
 * @param messages - An array of chat messages to group.
 * @returns A Map where each key is a sessionId and the value is the list of messages for that session.
 */
export function groupBySession<T extends ChatMessageLike>(
  messages: T[],
): Map<string, T[]> {
  const sessionMap = new Map<string, T[]>();
  for (const msg of messages) {
    if (!sessionMap.has(msg.sessionId)) {
      sessionMap.set(msg.sessionId, []);
    }
    sessionMap.get(msg.sessionId)!.push(msg);
  }
  return sessionMap;
}
