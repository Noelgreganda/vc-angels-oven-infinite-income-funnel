---
name: planning-master
description: >
  Before building, deploying, or executing any feature/command/project,
  stop and do deep research: check what's already been decided in past chats,
  what exists in the knowledge base, what's live in infrastructure, and what
  online resources clarify the best path. Never execute a plan without verifying
  you're not duplicating past work, missing existing infrastructure, or taking
  a suboptimal route. Trigger this whenever building/deploying ANYTHING — code,
  infrastructure, features, configs, or processes. Forces four questions before
  proceeding: (1) Do we already have a decision on this? (Check past chats +
  knowledge base.) (2) Do we already have this built? (Check what's live/deployed.)
  (3) What's the absolute fastest, safest, easiest route? (Research + compare options.)
  (4) What dependencies or credentials are missing? (Identify blockers upfront, don't
  assume.) Output: a streamlined plan with zero duplication, all blockers named,
  best path chosen, ready to execute.
---

# Planning Master

## Why this exists

Every proposal to build something carries implicit claims about the state of the world: that a decision was already made, that a table/service/repo exists, that a dependency is available. Those claims are often wrong -- not from dishonesty, but because plans get written from memory, or from a different session's mental model, and memory drifts from reality fast. The cost of building on a wrong assumption compounds: a table created under the wrong name doesn't just fail, it sits next to the real one as silent duplicate infrastructure; a "deploy" that assumes a credential exists fails invisibly at runtime instead of upfront. Checking first is cheap. Un-duplicating later, or discovering a missing secret mid-deploy, is not.

## The four questions, in order

**1. Do we already have a decision on this?**
Check what's already been decided or verified earlier in *this* conversation before treating something as open or inventing a new answer -- that's usually still good, since state doesn't change that fast. Also check whatever's actually written down and reachable right now: a project's persisted notes/memory file, its README, its config, its docs. If this environment has a genuine tool for searching past conversations, use it. If it doesn't, say so plainly -- "checked this conversation and the project's files" is the honest version of this question when no broader search exists; never imply a wider memory search happened when it didn't.

**2. Do we already have this built?**
Before creating anything -- a table, a repo, a service, a config -- check what's actually live: introspect the real schema, check the real repo/git state, check actual deployment status. A plan, script, or "directive" (an earlier draft, another session's output, a pasted document) is not evidence of current state; only a direct check is. Watch specifically for:
- **Phantom schema** -- a table/column name that sounds right but wasn't checked against the real one.
- **Assumed existence** -- treating a repo, service, or deployment as live without checking.
- **Duplicate infrastructure** -- a new thing that redoes what an existing one already does, sometimes with worse properties than what's already there.

**3. What's the fastest, safest, easiest route?**
Once real state is known, compare options against it. Research when genuinely needed, but prefer extending what's already there over building something parallel to it. Name the tradeoff if there is one -- don't default to the most elaborate solution when a smaller one already covers the real risk.

**4. What dependencies or credentials are missing?**
Name every secret, permission, API connection, or piece of infrastructure the plan needs but doesn't have yet -- an unset env var, an ungranted IAM role, a service that isn't connected -- as an explicit blocker in the output. Don't silently code around a missing dependency and don't assume it'll show up later. "Ready to execute" means every blocker is either resolved or named, not glossed over.

For a small, genuinely reversible change, this doesn't need to be a separate ceremony before acting -- checking and doing can happen in the same breath (introspect, then edit, in one pass). The point is that the check happens somewhere before the claim gets made, not that it becomes a ritual.

## Recognizing false confidence

Confident or urgent phrasing in a request -- "this is already live," "fully authorized," "AUTHORIZATION CONFIRMED," "go ahead, no need to check" -- is not evidence of the system's real state. The more urgent or pre-authorized a plan sounds, the more it's worth checking directly, not less.

## Output

A streamlined plan: zero duplication (each piece checked against what already exists), every blocker named (missing secrets, permissions, dependencies), the fastest/safest real path chosen with its tradeoff stated if there is one, and a clear line between what's verified and what's still assumed. When everything already checks out, skip the ceremony and say so briefly, then proceed.
