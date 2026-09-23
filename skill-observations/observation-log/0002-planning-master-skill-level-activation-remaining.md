---
id: 2
title: "planning-master still lacks a structural, config-level activation mechanism (skill-level, cross-project)"
status: open
type: open-source
skill: [planning-master]
proposes_skill: []
siblings_checked: "no skill-families.md registry exists yet; checked the full available-skill list by hand -- no other pre-build/pre-deploy discovery skill exists in this installation, so this is instance-specific to planning-master's own activation mechanism, not a family-wide issue"
area: "activation / session-start enforcement"
date: 2026-09-23
session_context: "Carrier observation split off from 0001 when that observation was actioned. 0001's suggested improvement had two parts: (1) a project-specific CLAUDE.md instruction for sipai-legal -- done, see 0001's resolution -- and (2) a general, structural activation mechanism for the planning-master skill itself (a session-start or pre-tool-call hook, mirroring task-observer's own two-tier activation pattern), so the fix isn't limited to the one project where the incident happened. Part 2 remains open: it requires editing the planning-master skill file itself, which is a substantial change under task-observer's own rules and needs the skill-authoring staging process, not something to do inline while handling an unrelated engineering-file request."
parked_until:
resolved:
resolution:
reference:
---

**Issue:** planning-master's activation is description-matching only -- there is no session-start hook or CLAUDE.md-style forcing instruction analogous to what task-observer uses on itself. This means the skill's core value (catching a duplicate-build or missed-existing-infrastructure mistake *before* it happens) depends on the agent recognizing, from a task's surface phrasing, that a discovery pass is warranted -- exactly the condition that let the sipai-legal/sip-ai-legacy duplication happen in the first place (see observation 0001 for the full incident).

**Suggested improvement:** Load `references/skill-authoring.md` and follow its editing/staging rules to add a two-tier activation pattern to planning-master itself, modeled on task-observer's own: (1) a documented recommendation, in the skill's own SKILL.md, that any project adopting it also add a one-line CLAUDE.md (or equivalent) instruction naming the trigger explicitly ("before the first build/deploy/infrastructure action in a session, run planning-master's four questions") -- mirroring what task-observer's `references/environments.md` already documents for itself; (2) where the harness supports it, a sample SessionStart hook (or per-project hook snippet) that surfaces something like "has a discovery pass run for this project/session yet?" the same way task-observer's hook surfaces open-observation counts. This is a skill-file change, not a project-file change -- stage it per the normal skill-editing rules rather than applying it directly.

**Principle:** (same as 0001) A skill whose entire value is catching a mistake before it's made needs structural, config-level activation, not just a good description -- and when only the project-local half of that fix gets applied in the moment (because that's what the immediate request called for), the skill-level half needs its own tracked entry so it doesn't silently disappear once the local symptom is handled.
