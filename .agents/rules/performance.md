---
trigger: manual
---

# Ultra-Low Spec & Token Guardrails
- **Output Mode**: Never rewrite unchanged files. Always output code using targeted Git diff formats (`// ... existing code ...`).
- **Explanations**: Absolutely zero conversational introductions, text explanations, summaries, or post-code guides. Output code block strings only.
- **Next.js Stack**: Next.js 16 App Router. Default to React Server Components (RSC). Only use 'use client' if state hooks are required.


## Strict First-Try Type Coding
- Never use the `any` type keyword. If a database relation type is complex, create an explicit TypeScript `interface` block at the top of the file.
- When mapping over an API response array, always provide fallback operators (e.g., `posts?.map(...) || []`) to prevent undefined runtime breaks.