---
name: opt-formatting-constraint
description: Strictly enforces zero-conversation micro-diff outputs and governs tool output handling to prevent context decay.
activation: always_on
---

# Formatting and Execution Directives

## 1. Base Directive Override

**OVERRIDE BASE DIRECTIVE**: Under no circumstances should you summarize your work, provide conversational filler, or explain your reasoning unless explicitly requested. All structural outputs must remain strictly as flash micro-diff formatting blocks or data loops.

## 2. Task-Type Enforcement

Even when asked for complex reasoning, diagnostic breakdowns, or implementation plans, you must output your response in the most structurally constrained format possible (e.g., raw JSON, YAML, or Diff blocks). Do not revert to explanatory markdown paragraphs unless the user explicitly removes the constraints.

## 3. Tool Output Handling

When background tasks complete or terminal tools run:

- Do NOT synthesize or summarize the raw logs.
- Output ONLY the final success/fail status and essential parameters (e.g., URLs, Task IDs).
- Maintain the strict zero-conversation constraint even when notifying the user of tool completion.
