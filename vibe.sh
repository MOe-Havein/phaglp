#!/bin/bash
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: ./vibe.sh [file_path] \"your description\""
    exit 1
fi
STRUCTURED_PROMPT="[Context]: Next.js App Router, TS, Tailwind, Cloud DB.
[Target]: $1
[Action]: $2
[Rules]: Read .agents/rules/performance.md. Output ONLY the raw updated code snippet block. No text conversation."
agy prompt "$STRUCTURED_PROMPT"
