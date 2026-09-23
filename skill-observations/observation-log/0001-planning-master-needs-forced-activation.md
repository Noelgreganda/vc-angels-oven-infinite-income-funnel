---
id: 1
title: "planning-master's pre-build discovery step needs forced activation, not description-matching"
status: open
type: open-source
skill: [planning-master]
proposes_skill: []
siblings_checked: "no skill-families.md registry exists yet; checked the full available-skill list by hand -- no other pre-build/pre-deploy discovery skill exists in this installation, so this is instance-specific to planning-master's own activation mechanism, not a family-wide issue"
area: "activation / session-start enforcement"
date: 2026-09-23
session_context: "Real incident in the sipai-legal / Adam Command Center project: a full parallel Messenger-bot system (sip-ai-legal, this repo) was built from scratch before an existing, functionally-equivalent system (sip-ai-legacy -- 89 Cloud Functions, its own Firestore collections, its own hosting site) was discovered. Legacy wasn't version-controlled until 2026-09-17 and wasn't visible to the session that started the new build; it was found by accident, via a screenshot of a working dashboard that matched nothing in this repo, not by a structured discovery step. The user (Noel) raised this directly after declining to install a third-party 'give Claude persistent memory' tool (Graphify), asking instead for a guarantee this kind of duplicate build never happens again."
parked_until:
resolved:
resolution:
reference:
---

**Issue:** planning-master's own stated first question is "Do we already have this built? Check what's live/deployed" -- exactly the check that would have caught the sip-ai-legacy duplication before a parallel system was built. But nothing forced that check to run at the start of the original build: the skill is description-matched only, with no session-start or pre-build forcing function. task-observer (in this same installation) solves the identical problem for itself via a CLAUDE.md instruction plus a SessionStart hook that injects an open-observation count every session -- a structural, config-level activation layer that survives an agent simply not recognizing "this looks like a build task" from the opening message. planning-master has no equivalent: it relies entirely on the agent noticing, from a task's phrasing, that a discovery pass is warranted, which is exactly the class of failure its own description says it exists to prevent.

**Suggested improvement:** Give planning-master the same two-tier activation pattern task-observer documents in its own `references/environments.md`: (1) a CLAUDE.md (or project-instructions) line telling the agent to run planning-master's four questions before the FIRST build/deploy/infrastructure action in a new project or a new major feature area, not just when a request phrase happens to match; (2) where the harness supports it, a session-start or pre-tool-call hook that surfaces "has a discovery pass run for this project yet?" the same way task-observer's hook surfaces open-observation counts. Concretely for this project: the gap is now closed for sipai-legal specifically (CLAUDE.md documents sip-ai-legacy's existence explicitly, so no future session can rediscover it the hard way), but that's a project-specific patch, not a fix to the skill's own activation reliability for the *next* new project.

**Principle:** A skill whose entire value is catching a mistake *before* it's made cannot rely on the agent recognizing, from a task's surface phrasing, that the skill applies -- by the time a task reads as "build X," the discovery question has often already been skipped. Skills of this shape (pre-flight discovery, pre-flight safety checks, "before you commit to an approach" gates) need the same structural, config-level activation that a purely reactive skill (fix this bug, review this diff) can get away with using description-matching alone for. The fix is never a promise to remember better -- it's a durable, session-crossing artifact (a config instruction, a hook, a written file) that makes the check happen whether or not the agent's own judgment fires that turn.
