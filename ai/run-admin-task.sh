#!/usr/bin/env bash

set -e

if [ -z "$1" ]; then
  echo "Usage:"
  echo "./ai/run-admin-task.sh 01"
  exit 1
fi

TASK_FILE="ai/tasks/admin/$1"*.md

echo "======================================="
echo "🚀 Running Admin Task: $TASK_FILE"
echo "======================================="

gemini -p "$(cat $TASK_FILE)"
