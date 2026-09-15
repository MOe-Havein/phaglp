---
description: Automatically fix linting and formatting issues across the project
---

### TASK: EXECUTE PROJECT LINT AND FORMAT PIPELINE

1. Use the `terminal` MCP server to trigger the codebase lint cleaner: `pnpm exec next lint --fix`.
2. Review the console stdout logs. If any rigid ESLint violations remain un-fixed, use the `filesystem` tool to jump to those lines and resolve them manually.
3. Run the project formatting script: `pnpm exec prettier --write .`.
4. Run a sanity check via `git status` using the terminal tool to review the altered files before staging them for a commit.
