# Feature Specification: Hermes Agent Integration

**Feature Branch**: `001-hermes-agent-integration`

**Created**: 2026-07-21

**Status**: Draft

**Input**: User description: "Refactor this project integration with Hermes Agent"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Chatbot Assistant with Hermes (Priority: P1)

A visitor or student opens the AI Assistant widget on PHAGLP and asks a question. The backend uses Hermes Agent as the primary AI provider to generate an answer. If Hermes is unavailable or misconfigured, the system falls back to Cohere without exposing the error to the user.

**Why this priority**: This is the highest-traffic AI touchpoint and already partially wired to Hermes. Making Hermes primary here delivers immediate visible value and reduces Cohere dependency.

**Independent Test**: Open the site, send a message from the chat widget, and verify the response comes from Hermes when `HERMES_API_BASE` and `HERMES_API_KEY` are set. If one of them is missing, verify Cohere fallback still works.

**Acceptance Scenarios**:

1. **Given** Hermes env vars are set, **When** a user sends a chat message, **Then** the answer is generated via Hermes.
2. **Given** Hermes env vars are set, **When** Hermes returns a 500, **Then** the system falls back to Cohere and logs the failure.
3. **Given** Hermes env vars are missing, **When** a user sends a chat message, **Then** the system uses Cohere directly.

---

### User Story 2 - Admin AI Assistant Panel (Priority: P2)

An admin or instructor uses the AI Assistant panel to generate outlines, summaries, logical-fallacy checks, or lectures. These actions should prefer Hermes and fall back to Cohere, using the same provider abstraction as the chatbot.

**Why this priority**: It reuses the same provider layer and extends Hermes from public chat into admin/academic workflows.

**Independent Test**: Call the AI generate API for outline/summary/fallacy-check/write-lecture with Hermes configured and verify the response source is Hermes. Then misconfigure Hermes and verify Cohere fallback.

**Acceptance Scenarios**:

1. **Given** Hermes is configured, **When** an admin requests a lecture outline, **Then** the response comes from Hermes and returns markdown text.
2. **Given** Hermes is configured, **When** an admin requests a summary, **Then** the response is condensed and source-tagged as Hermes.
3. **Given** Hermes is down, **When** any AI action is requested, **Then** Cohere is used automatically.

---

### User Story 3 - Course AI Planner (Priority: P2)

A user generates a course curriculum plan or lesson content. The planner should call Hermes first for outline/quiz/lesson generation, then Cohere, then the local mock generator.

**Why this priority**: Course generation is a high-effort feature; routing it through Hermes improves output consistency while keeping offline safety.

**Independent Test**: POST to the course AI planner with valid parameters and verify Hermes is attempted first, with fallback behavior matching existing mock outputs.

**Acceptance Scenarios**:

1. **Given** Hermes is configured, **When** a curriculum outline is requested, **Then** the API attempts Hermes and returns structured course data.
2. **Given** Hermes returns invalid JSON, **When** parsing fails, **Then** the system falls back to the built-in high-fidelity mock generator.
3. **Given** The request is for a quiz, **When** Hermes fails, **Then** the response still returns a valid quiz payload.

---

### User Story 4 - Tech Concepts Interactive Content (Priority: P3)

A student uses the tech-concepts dashboard to request an explanation and quiz. The route should use the shared provider abstraction and prefer Hermes for generation, while keeping JSON output enforcement.

**Why this priority**: It is currently Cohere-only and JSON-constrained; it fits the Hermes refactor but is narrower than chat.

**Independent Test**: POST to the interactive concepts generate endpoint and verify provider behavior and JSON parsing/sanitization.

**Acceptance Scenarios**:

1. **Given** Hermes is configured, **When** a topic generation request is sent, **Then** the system returns parsed JSON or falls back to mock content.
2. **Given** The AI output contains markdown wrapping, **When** JSON parsing is attempted, **Then** the wrapper is stripped before parsing.

---

### Edge Cases

- What happens when `HERMES_API_BASE` is set but `HERMES_API_KEY` is missing?
- How does the system behave when both Hermes and Cohere are unavailable?
- What happens if Hermes returns empty content?
- How are provider failures surfaced to admins?
- What happens when embeddings are needed but only Hermes is configured?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST provide a Hermes-first AI provider layer under `src/features/ai/src/providers/`.
- **FR-002**: The chatbot, AI assistant, course planner, and interactive concepts endpoints MUST use the shared provider abstraction.
- **FR-003**: When Hermes is configured, the system MUST attempt Hermes before Cohere for chat and text generation.
- **FR-004**: The system MUST fall back to Cohere when Hermes is not configured or returns an error.
- **FR-005**: The system MUST fall back to local mock generators when both providers fail for structured endpoints.
- **FR-006**: Provider selection and fallback MUST happen server-side only.
- **FR-007**: The system MUST log provider, latency, and failure reason without exposing API keys to the client.
- **FR-008**: Existing Cohere-backed embeddings MAY remain unchanged unless Hermes embeddings are enabled.

### Key Entities _(include if feature involves data)_

- **Message**: chat history entries with `sessionId`, `role`, `content`, `userId`, timestamps.
- **KnowledgeBase**: content entries with embeddings for RAG retrieval.
- **ProviderResponse**: normalized text result, source tag, optional error metadata.
- **AIProviderConfig**: env-backed config for Hermes and Cohere endpoints and models.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Chat API routes use Hermes when configured; fallback occurs automatically otherwise.
- **SC-002**: Admin AI actions use the same provider abstraction and do not duplicate provider logic.
- **SC-003**: TypeScript typecheck passes after provider refactor.
- **SC-004**: No client-side code references Hermes/Cohere API keys directly.
- **SC-005**: Provider failures do not crash AI endpoints; they degrade gracefully to fallback or mock content.

## Assumptions

- We assume Hermes exposes an OpenAI-compatible chat endpoint reachable at `HERMES_API_BASE`.
- We assume Hermes text generation can fit the current prompt/response shapes used by PHAGLP.
- We assume advanced Hermes features such as tools or MCP are optional and can be introduced after provider abstraction is stable.
- We assume embeddings can remain Cohere-backed until Hermes embeddings are confirmed and enabled.
