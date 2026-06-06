---
name: opt
description: Rewrites prompts into high-density format to minimize token usage and save API credits
command: opt
author: "MOe"
version: "2.0.0"
tags:
  - efficiency
  - token-optimization
  - credit-saving
---

# Instruction
Intercept user input. Compress into structural token-minimized blueprint format before agent submission to minimize token usage and save API credits. Eliminate conversational tokens, text explanations, and full-file code dumps.

## Structural Payload Format
[Context]: High-density domain technical keywords representing the files or dependencies in use.
[Task]: Core direct execution goal stripped of conversational pleasantries.
[Constraints]: Flash micro-diff formatting block only. Output code patches or data loops only. No conversational explanations or notes. Minimize token usage and save API credits.
