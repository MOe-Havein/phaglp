#!/bin/bash
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: ./fix.sh [file_path] \"[raw error text]\""
    exit 1
fi
CONTEXT_LINES=$(head -n 40 "$1")
STRUCTURED_FIX="[Context]: Next.js Strict Type Check.
[Target]: $1
[Error Code]: $2
[Target Code]:
$CONTEXT_LINES
[Action]: Patch this specific error line immediately. Output code blocks only."
agy prompt "$STRUCTURED_FIX"

