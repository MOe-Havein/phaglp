# PHAGLP Agents — Overview, Description, and Hermes-Agent Improvement Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Explain what the phaglp project is, catalogue every AI "agent" inside it, and lay out a concrete, bite-sized plan for how Hermes Agent (this assistant) improves them — centered on routing all LLM calls through an OpenAI-compatible Hermes endpoint with Cohere fallback.

**Architecture:** phaglp is a Next.js 15 full-stack app (marriage-matching + educational platform) whose LLM features are centralized in two server modules (`src/lib/chatbot.ts` for RAG chat, `src/lib/ai-assistant.ts` for authoring tools) plus a standalone MCP Prisma server. The improvement plan adds a thin local Hermes-compatible proxy (dev) and flips the live app to Hermes by setting three env vars — no app-logic rewrite beyond the already-staged `chatbot.ts` change.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Prisma/PostgreSQL, `ai` SDK v6 + `@ai-sdk/openai`, Cohere SDK (`cohere-ai` v8), nanoid, MCP SDK (`@modelcontextprotocol/sdk`), Node 22.

---

## 1. What the project is (so the plan has context)

`/root/testa-phaglp2` (repo `mhamidawad/testa-phaglp2`, name `full-stack-phagpl`) is a production Next.js 15 application for **marriage matching and online education** (lectures, courses, certificates, admin/control panels). It is live at `phaglp.com` (Hostinger IPs, behind Cloudflare, returns 429 to bots).

It already contains AI features. The app currently calls **Cohere** for every LLM operation. A Hermes integration was drafted locally (`src/lib/chatbot.ts` already routes chat answers through `HERMES_API_BASE`/`HERMES_API_KEY`/`HERMES_MODEL` when set, falling back to Cohere) but is **uncommitted and not deployed**.

---

## 2. The agents inside phaglp (current state)

### A. Visitor RAG Chatbot (`src/lib/chatbot.ts` + `src/app/api/chat/route.ts` + `src/components/chatbot/chatbot-widget.tsx`)

- **What it is:** A Retrieval-Augmented-Generation assistant mounted site-wide (`layout-client.tsx` → `ChatbotWidget`). Users ask questions; the app embeds the question (Cohere embeddings), retrieves top-3 matching knowledge rows from Postgres (`findRelevantKnowledge`), builds a system prompt with that context, and generates an answer.
- **LLM today:** `cohere.v2.chat` model `command-a-reasoning-08-2025` for the answer. Embeddings also Cohere.
- **Hermes state:** `answerQuestion()` now prefers Hermes (OpenAI-compatible `generateText`) when `HERMES_*` env set; otherwise Cohere. **This change is local/uncommitted.**

### B. Authoring AI Assistant (`src/lib/ai-assistant.ts`)

- **What it is:** Server actions for content creators/admins: `generateOutline`, `summarizeContent`, `checkLogicalFallacies`, `writeLecture`. Each builds a prompt and calls `cohere.v2.chat`.
- **LLM today:** Cohere only, no Hermes path. Used by `AIAssistantPanel` and lecture edit forms.

### C. MCP Prisma Server (`mcp-prisma-server/index.js` + `AI_PROMPTS_GUIDE.md`)

- **What it is:** A standalone Model Context Protocol server exposing Prisma DB operations as tools so an external MCP client (e.g. an AI IDE/agent) can read/write the database via natural language. This is the project's "agentic surface" for tool-use.

### D. Hermes Agent (this assistant) — external

- Not part of phaglp's code, but it is the improvement lever: Hermes Agent runs locally at `~/.hermes` and can serve an OpenAI-compatible chat endpoint the app calls.

---

## 3. How Hermes Agent improves these agents

1. **Unify the LLM backend.** Route chatbot answers AND authoring tools through Hermes's OpenAI-compatible endpoint so model routing, keys, and fallbacks live in one place. Cohere stays for embeddings + as fallback.
2. **Local dev parity.** A thin local proxy (`hermes-proxy`) lets the dev app talk to Hermes without touching the live host — verifies the integration before deploy.
3. **Live flip is config-only.** Set `HERMES_API_BASE`/`HERMES_API_KEY`/`HERMES_MODEL` on the host; the already-written `chatbot.ts` logic activates. Authoring tools (B) get the same one-line swap.
4. **Observability + safety.** Central Hermes endpoint means one place to rate-limit, log, and constrain prompts; the app's `safeDbQuery`/Zod `env.ts` already guard the data layer.
5. **Extend agentic reach.** Optionally expose phaglp's MCP Prisma server to Hermes Agent so it can perform DB tasks on the platform via tool-use (future, out of scope here).

---

## 4. Proposed approach (decided during brainstorming)

**Approach A (chosen):** Thin local Node/Express proxy (`hermes-proxy/`) exposing `POST /v1/chat/completions` in OpenAI shape, translating to Hermes Agent's chat and returning OpenAI-format output. App points `HERMES_API_BASE=http://localhost:8787/v1`. Live flip = set the same three vars on the host. Rejected: B (depend on gateway internals), C (OpenRouter ≠ Hermes).

---

## 5. Step-by-step plan

### Task 1: Commit the already-staged local Hermes chatbot change

**Objective:** Get the existing (uncommitted) Hermes routing into git on a clean branch.
**Files:** Modify `src/lib/chatbot.ts`, `package.json`, `.gitignore` (already edited locally).
**Step 1:** Confirm working tree: `cd /root/testa-phaglp2 && git status --short` → expect `M src/lib/chatbot.ts M package.json M .gitignore`.
**Step 2:** Create branch: `git checkout -b feat/hermes-chat-v3`.
**Step 3:** Commit: `git add src/lib/chatbot.ts package.json .gitignore && git commit -m "feat(chat): route chatbot answers through Hermes (Cohere fallback)"`.
**Step 4:** Typecheck: `npm run typecheck` → expect exit 0, 0 errors.
**Step 5:** Prettier: `npx prettier --check src/lib/chatbot.ts` → expect "All matched files use Prettier code style!".

### Task 2: Create the local Hermes proxy (`hermes-proxy/`)

**Objective:** Stand up an OpenAI-compatible `/v1/chat/completions` server that forwards to Hermes Agent chat.
**Files:** Create `/root/testa-phaglp2/hermes-proxy/package.json`, `index.mjs`.
**Step 1:** Write `hermes-proxy/package.json`:

```json
{
  "name": "hermes-proxy",
  "version": "1.0.0",
  "type": "module",
  "scripts": { "start": "node index.mjs" },
  "dependencies": { "express": "^4.19.2" }
}
```

**Step 2:** Write `hermes-proxy/index.mjs` (listens :8787, translates OpenAI → Hermes chat, returns OpenAI shape):

```js
import express from "express";
const app = express();
app.use(express.json());
const HERMES_CHAT =
  process.env.HERMES_CHAT_URL || "http://localhost:3000/api/chat"; // Hermes Agent chat upstream
app.post("/v1/chat/completions", async (req, res) => {
  try {
    const {
      messages,
      model = "auto",
      temperature = 0.7,
      max_tokens = 700,
    } = req.body;
    // Forward to Hermes Agent upstream; adapt to its real contract.
    const r = await fetch(HERMES_CHAT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages, model, temperature, max_tokens }),
    });
    const data = await r.json();
    const text = data?.reply ?? data?.choices?.[0]?.message?.content ?? "";
    res.json({
      id: "chatcmpl-hermes",
      object: "chat.completion",
      model,
      choices: [
        {
          index: 0,
          message: { role: "assistant", content: text },
          finish_reason: "stop",
        },
      ],
    });
  } catch (e) {
    res.status(502).json({ error: String(e) });
  }
});
app.listen(8787, () => console.log("hermes-proxy on :8787"));
```

**Step 3:** Install: `cd hermes-proxy && npm install`.
**Step 4:** Smoke test the endpoint shape with a mock upstream (no real Hermes needed):

```bash
node -e 'const http=require("http");const s=http.createServer((q,s2)=>{let b="";q.on("data",d=>b+=d);q.on("end",()=>{s2.setHeader("content-type","application/json");s2.end(JSON.stringify({reply:"hi from hermes"}))})});s.listen(3000,()=>console.log("mock up"))'
```

Then: `curl -s -X POST localhost:8787/v1/chat/completions -H 'content-type: application/json' -d '{"messages":[{"role":"user","content":"hi"}]}'` → expect JSON with `choices[0].message.content` = "hi from hermes".

### Task 3: Wire the dev app to the local proxy

**Objective:** Point the Next.js dev server at the proxy via env.
**Files:** Create `/root/testa-phaglp2/.env.local` (gitignored).
**Step 1:** Write `.env.local`:

```
HERMES_API_BASE=http://localhost:8787/v1
HERMES_API_KEY=dev
HERMES_MODEL=auto
```

**Step 2:** Start proxy (`cd hermes-proxy && npm start`) and dev app (`npm run dev`); open `/`, send a chat message → app calls `/api/chat` → `chatbot.ts` → proxy → mock/real Hermes → answer renders.
**Step 3:** Verify fallback: unset `HERMES_API_KEY` and confirm the widget still answers via Cohere (no crash).

### Task 4: Add Hermes path to authoring tools (`ai-assistant.ts`)

**Objective:** Same one-line swap for `generateOutline`/`summarizeContent`/`checkLogicalFallacies`/`writeLecture`.
**Files:** Modify `src/lib/ai-assistant.ts`.
**Step 1:** Add `import { generateText } from "ai"; import { createOpenAI } from "@ai-sdk/openai";` after line 3.
**Step 2:** In each of the 4 functions, replace the `cohere.v2.chat` block with a Hermes call guarded by `HERMES_API_BASE`/`HERMES_API_KEY`, falling back to the existing Cohere block (mirror the `chatbot.ts` pattern: extract a `cohereXxx` helper, call Hermes first).
**Step 3:** Typecheck + prettier (as Task 1).
**Step 4:** Commit: `git commit -am "feat(ai): route authoring tools through Hermes (Cohere fallback)"`.

### Task 5: Document the live flip + host-agnostic env setup

**Objective:** Give the operator the exact steps to make phaglp.com use Hermes.
**Files:** Modify `/root/testa-phaglp2/README.md` (or `ENV_VARS.md`).
**Step 1:** Add a "Hermes Agent integration" section listing the three vars and that `main` must contain the `feat/hermes-chat-v3` merge.
**Step 2:** Note host options: Vercel (Project → Settings → Environment Variables) OR container/Hostinger (same vars in the runtime env / `.env`).
**Step 3:** Commit docs.

### Task 6: Push branch and open PR

**Objective:** Make the work reviewable/deployable.
**Files:** git remote `origin`.
**Step 1:** `git push -u origin feat/hermes-chat-v3` (no force).
**Step 2:** Provide PR URL: `https://github.com/mhamidawad/testa-phaglp2/pull/new/feat/hermes-chat-v3`.

---

## 6. Tests / validation

- **Type safety:** `npm run typecheck` → 0 errors after every code task.
- **Format:** `npx prettier --check` on changed files.
- **Proxy contract:** curl returns OpenAI-shaped JSON (Task 2 Step 4).
- **Integration (dev):** widget answers via proxy; fallback to Cohere when key unset (Task 3).
- **Build gate:** `npm run build` requires the app's runtime secrets (DATABASE_URL, CLOUDINARY_URL, NEXTAUTH_SECRET) + the three HERMES_* vars; this is a deploy-time requirement, not a code defect.

## 7. Risks, tradeoffs, open questions

- **Upstream contract (open):** The proxy's `HERMES_CHAT_URL` target must match Hermes Agent's real chat API contract; confirm the exact upstream URL/shape before live use (Task 2 mock uses `reply`, real may differ).
- **Local proxy not for prod:** the `hermes-proxy` is for dev; the live flip should point `HERMES_API_BASE` at an always-on Hermes endpoint, not a laptop.
- **Cohere still required:** embeddings + fallback need `COHERE_API_KEY`; keep it set everywhere.
- **Host unknown:** phaglp.com resolved to Hostinger IPs; confirm actual deploy target (Vercel vs container) to set env vars correctly.
- **Uncommitted state:** current local edits are NOT in git — Task 1 must happen before anything else or work is lost.

## 8. Out of scope (YAGNI)

- Rewriting the RAG retrieval logic.
- Exposing the MCP Prisma server to Hermes Agent (future enhancement).
- Streaming responses (widget currently awaits full answer).
