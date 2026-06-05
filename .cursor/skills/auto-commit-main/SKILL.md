---
name: auto-commit-main
description: >-
  Auto-commit and push changes to main after completing edits in dailyQuest.
  Use when finishing implementation tasks, bug fixes, or any code changes in
  this repo. Always commit to main and push without asking unless blocked.
---

# Auto Commit to Main

## When to run

After completing any meaningful edit in this repository:

1. Run `git status`, `git diff`, `git log -3 --oneline`
2. Stage relevant files (never `.env`, credentials, secrets)
3. Commit to `main` with a clear message (why, not just what)
4. Push: `git push origin main`
5. Confirm with `git status`

## Commit message

Use HEREDOC:

```bash
git commit -m "$(cat <<'EOF'
Short summary of why.

EOF
)"
```

## Safety

- NEVER force push to `main`
- NEVER skip hooks unless user explicitly asks
- NEVER commit secrets (`.env`, keys, tokens)
- If push is rejected, pull/rebase merge first, then push again
- Do not ask user for permission to commit in this project — commit proactively

## Scope

Applies to all work in `dailyQuest/` including `web/`, `mockup/`, `.github/`, `.cursor/`.
