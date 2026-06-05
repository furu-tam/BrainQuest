#!/bin/bash
# Auto-commit and push to main when agent session ends (if there are changes).

set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [ -z "$ROOT" ]; then
  exit 0
fi

cd "$ROOT"

# Only commit on main
BRANCH="$(git branch --show-current 2>/dev/null || echo "")"
if [ "$BRANCH" != "main" ]; then
  exit 0
fi

# Skip if merge/rebase in progress
if [ -f .git/MERGE_HEAD ] || [ -d .git/rebase-merge ] || [ -d .git/rebase-apply ]; then
  exit 0
fi

# Nothing to commit
if [ -z "$(git status --porcelain)" ]; then
  exit 0
fi

# Stage all, unstage secrets
git add -A
git reset HEAD -- .env .env.* '**/.env' '**/.env.*' 2>/dev/null || true
git reset HEAD -- '*.pem' '*.key' credentials.json 2>/dev/null || true

if [ -z "$(git diff --cached --name-only)" ]; then
  exit 0
fi

MSG="auto: sync changes $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git commit -m "$MSG" || exit 0

git push origin main 2>/dev/null || true
exit 0
