@AGENTS.md

## task-observer activation

Before the first tool call of any session — and before writing or
proposing a plan, not merely before executing one — invoke the
task-observer skill AND execute its Session Start Protocol (storage
check, frontmatter scan, review trigger). Loading the skill and running
the protocol are separate steps; a session that loads the file and stops
has activated nothing. Any turn that will involve a tool call counts; do
not classify the session as "too simple" from its opening message.

Select skills on the DECISION the request is about, not on the artefact it
arrived as. Name what the user is deciding, then match the installed skill
descriptions against that — a request handed over as a file to review
still needs the skill whose description names its subject.

After completing each task, check the observation records written this
session and report a one-line summary (ids and titles, or "none logged
and why").

Loading a skill is not complete until you have queried the observation
log for OPEN observations naming it and read their bodies:
```
grep -l "skill:.*<skill-name>" [WORKSPACE]/skill-observations/observation-log/*.md
```
Apply their insights to the current work, even if the skill file hasn't
been updated yet. Run this at every skill load, however many skills load
in one session.

The task-observer workspace for this project is:
```
[WORKSPACE] = the root of the CURRENT checkout of this repository
```
Resolve `[WORKSPACE]` via `git -C . rev-parse --show-toplevel` (or
equivalent) in THIS session — never hardcode a path from a previous
session, and never resolve it from an ephemeral worktree/temp-clone cwd
(`.claude/worktrees/...`). This repo's checkout path is not guaranteed
identical across every environment/session, which is why this is
resolved fresh rather than pinned as a literal string — but the
workspace itself (`skill-observations/`, `skill-updates/`, committed to
git at the repo root) is the single shared location regardless of where
the checkout lives; do not derive a second one per session or tool.
Every path the skill uses derives from that root and nothing else:
```
[WORKSPACE]/skill-observations/observation-log/   (the log)
[WORKSPACE]/skill-observations/cross-cutting-principles.md
[WORKSPACE]/skill-updates/                         (staging root)
[WORKSPACE]/skill-updates/PENDING.md               (staging manifest)
```

A `SessionStart` hook (`.claude/hooks/task-observer-check.sh`, registered
in `.claude/settings.json`) also injects the open-observation count and
last-review date every session as a second, stronger activation tier —
this instruction block is the redundant, config-level tier alongside it.

Source/license: this skill is "Task Observer" / "One Skill to Rule Them
All" by Eoghan Henn ([rebelytics.com](https://rebelytics.com)), CC BY 4.0.
Canonical source: [github.com/rebelytics/one-skill-to-rule-them-all](https://github.com/rebelytics/one-skill-to-rule-them-all).
