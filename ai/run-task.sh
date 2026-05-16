#!/usr/bin/env bash

set -e

if [ -z "$1" ]; then
  echo "Usage:"
  echo "./ai/run-task.sh 01"
  exit 1
fi

TASK_FILE="ai/tasks/$1"*.md

echo "======================================="
echo "🚀 Running Gemini Task: $TASK_FILE"
echo "======================================="

gemini -p "$(cat $TASK_FILE)"
