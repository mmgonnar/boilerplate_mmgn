#!/usr/bin/env bash

set -euo pipefail

NAME="${1:-}"

if [ -z "$NAME" ]; then
  echo "Usage: bun run clone <project-name>"
  echo ""
  echo "Clones the boilerplate with ALL files (.github/, .env, docs, etc.)"
  echo "into ./<project-name>/"
  exit 1
fi

TARGET="./$NAME"

if [ -d "$TARGET" ]; then
  echo "Error: '$TARGET' already exists"
  exit 1
fi

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "Cloning boilerplate to $TARGET..."

rsync -a \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='.next' \
  --exclude='.DS_Store' \
  --exclude='bun.lock' \
  --exclude='tsconfig.tsbuildinfo' \
  --exclude='next-env.d.ts' \
  "$PROJECT_DIR/" "$TARGET/"

cp "$TARGET/.env.example" "$TARGET/.env"

echo ""
echo "Done!"
echo "  cd $NAME"
echo "  bun install"
echo "  bun run dev"
