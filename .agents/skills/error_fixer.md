# Name: Self-Healing Error Fixing Loop (agy agent)
# Description: Automatically intercepts workspace execution failures, installs missing packages, and rewrites broken file code blocks.

## Activation Trigger
- Activated whenever a command executed via `agy` returns a non-zero exit code or drops a stack trace (e.g., `ModuleNotFoundError`, `SyntaxError`, `TypeError`).

## Core Execution Loop Rule
If the command fails, do NOT halt. You must execute these 3 sequential steps autonomously:

1. **Dependency Analysis (Zero-Token Fast Fix)**
   - Look closely at the `stderr` string. 
   - If a `ModuleNotFoundError` or `ImportError` is present, instantly invoke the tool command: `pip install <package_name>`.
   - After installation, immediately re-run the file.

2. **Structural / Syntax Fix Protocol**
   - If the crash is code-related, trace the line number provided in the traceback.
   - Read the target local file entirely.
   - Redraft the specific code block to fix the bug, keeping the overall system architecture unchanged.
   - Overwrite the broken workspace file directly using file modifications.

3. **Validation Loop Assertion**
   - Re-run the script using your execution tool surface.
   - Continue iterating up to a maximum of 4 attempts before halting for safety.
