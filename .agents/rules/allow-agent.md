---
trigger: always_on
---

User
↓
Agent
↓
run_typecheck()
↓
pnpm typecheck
↓
stdout/stderr
↓
Agent analyzes errors
↓
Response

run_typecheck()
run_build()
run_lint()
run_tests()

Run typecheck

rm -rf .

### Command Execution Policy

Agents must never execute arbitrary shell commands.

Allowed commands must be exposed as explicit tools.

Examples:

- run_typecheck
- run_build
- run_lint
- run_tests

The runtime determines the actual command execution.
The model only requests tool invocations.
