# Hermes Agent Integration Plan

Integrate Hermes Agent as the primary AI provider for PHAGLP, using its OpenAI-compatible endpoint. Retain Cohere only for embeddings/knowledge-base features if Hermes embeddings are unavailable.

## Current State

- `src/lib/chatbot.ts` already has a Hermes branch behind `HERMES_API_BASE` and `HERMES_API_KEY`
- Existing Cohere-only routes: `src/app/api/ai-interactive-concepts/route.ts`, `src/app/api/courses/ai-planner/route.ts`
- Frontend chat widget exists: `src/components/chatbot/chatbot-widget.tsx`

## Proposed Integration

1. Backend gateway
   - Add `src/app/api/ai/chat/route.ts` as the unified Hermes chat endpoint
   - Standardize requests as `{ messages, model?, tools?, temperature? }`
   - Add server-side timeout, retry, fallback, and auth checks

2. Provider layer
   - Add `src/lib/ai/providers/hermes.ts` wrapping the Hermes OpenAI-compatible client
   - Add `src/lib/ai/providers/cohere.ts` for existing Cohere features
   - Add `src/lib/ai/router.ts` to choose provider by feature and env

3. Frontend wiring
   - Route `ChatbotWidget` and AI assistant panel through the unified backend API
   - Keep streaming responses if Hermes supports it

4. Observability
   - Log provider, latency, token usage, and fallback reasons
   - Add feature-flag gate for gradual rollout

## Environment

- `HERMES_API_BASE`
- `HERMES_API_KEY`
- `HERMES_MODEL`
- Reuse existing `COHERE_API_KEY` for embeddings fallback

## Acceptance Criteria

- Chat routes use Hermes when configured
- Auth/session context forwarded safely
- No exposed API keys client-side
- Admin can view provider status and logs
