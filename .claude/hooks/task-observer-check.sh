#!/bin/bash
set -euo pipefail

# SessionStart hook: injects the task-observer activation reminder plus
# review-trigger state as additionalContext, per
# .claude/skills/task-observer/references/environments.md's recommended
# hook. Adapted for this environment: the workspace root is this repo's
# own checkout ($CLAUDE_PROJECT_DIR), not a hardcoded absolute path --
# this repo can be checked out at different paths across sessions/
# environments, and the skill's own rule is "never an ephemeral worktree
# path," not "never a variable path." skill-observations/ is committed
# to git, which is what actually persists it here (this environment's
# container itself is reclaimed after inactivity).
d="$CLAUDE_PROJECT_DIR/skill-observations"

if [ ! -d "$d/observation-log" ]; then
  # Not installed yet, or a fresh clone that hasn't run the Session
  # Start Protocol's setup step -- say nothing rather than error.
  exit 0
fi

open=$(find "$d/observation-log" -maxdepth 1 -name '*.md' -exec grep -l '^status: open$' {} + 2>/dev/null | wc -l | tr -d ' ')
last=$(cat "$d/last-review-date.txt" 2>/dev/null || echo never)

msg="Invoke the task-observer skill before the first tool call."
if [ "$open" -gt 0 ]; then
  msg="$msg $open open observations; last review: $last."
  if [ "$last" = "never" ]; then
    msg="$msg Offer the review."
  fi
fi

printf '{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"%s"}}\n' "$msg"
