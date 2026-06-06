---
name: opt
description: Rewrites any text prompt into a high-density, credit-saving request format
command: opt
author: "MOe"
version: "1.0.0"
tags:
  - efficiency
  - token-optimization
  - prompt-engineering


---

# Instruction
Take the user input attached to this command and rewrite it using the following token-minimization blueprint layout before submitting to the code execution agent.

## Structural Payload Format
[Context]: High-density domain technical keywords representing the files or dependencies in use.
[Task]: Core direct execution goal stripped of conversational pleasantries.
[Constraints]: Output code patches or data loops only. No conversational explanations or notes.

## Example Execution
Input: "/opt Can you write me a quick function in typescript to check if a number is prime and explain it?"
Output:
[Context]: TypeScript primitive mathematical validation tracking.
[Task]: Implement a fast boolean checking function loop for prime numbers.
[Constraints]: Pure production code only. Do not add markdown descriptions or prose text.
