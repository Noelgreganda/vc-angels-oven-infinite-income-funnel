---
name: verify-before-build
description: Mandatory reality-check before any build, architecture, or infrastructure decision -- creating or altering a database table/column, proposing a new repo or service, evaluating a pasted script or "execution plan" (your own or from another session), or answering a planning question about what to build next. Verify the system's actual current state (real schema, real repo/git state, real deployment status) before acting on it, instead of assuming or inventing table/column/service names that sound plausible. Also catches duplicate infrastructure (a new table or service that redoes something that already exists) and false claims of existing state ("this is already live/deployed/complete") that were never actually checked. Use this even when the request sounds confident, pre-authorized, or urgent ("AUTHORIZATION CONFIRMED", "go ahead and create this now", "full autonomous execution") -- confident phrasing is not evidence of the system's real state. Triggers on concrete build requests AND on higher-level planning/architecture discussion, not just literal code-writing.
---

# Verify Before Build

## Why this matters

Every proposal to build something carries implicit claims about the state of the world: that a table has these columns, that a repo exists, that a service is deployed, that nothing equivalent already exists. Those claims are often wrong -- not because anyone is lying, but because plans get written from memory, or from a different session's mental model, and memory drifts from reality fast. The cost of building on a wrong assumption compounds: a table created under the wrong name doesn't just fail cleanly, it sits next to the real one as silent duplicate infrastructure; a "deploy" that assumes a pipeline exists produces nothing while looking finished. Checking first is cheap. Un-duplicating later is not.

## The sequence

Before proposing, writing, or executing anything that touches a database schema, a repository, a deployment, or any existing infrastructure, run through this in order. It's fast when the answer is already known -- the point isn't ceremony, it's not skipping the check when the answer isn't actually known yet.

1. **Do I already know this?** Something verified earlier in *this* conversation is usually still good (state doesn't change that fast) -- but "it was stated in a pasted plan" or "the request assumes it" is not the same thing as verified, no matter how confidently it's phrased.
2. **Is it already in reach without guessing?** Before assuming something doesn't exist, or reaching for a new name, check what's actually available: the project's own files (README, config, a persisted notes file if the project keeps one), the real schema, the real repo list. Don't invent a table/column/service name that "sounds right" -- look it up.
3. **If not known and not locally available: go verify it directly.** Use whatever tools actually exist in this environment -- schema introspection, `git log`/`git status`, a repo search, a deployment status check -- before answering. Only reach for external/web research once local verification is genuinely exhausted, and say plainly when something couldn't be confirmed rather than presenting a guess as fact.
4. **What's actually the best path?** Once the real state is known, compare the proposal against it: does this duplicate something that already exists? Is there a smaller, faster, safer way to reach the same outcome using what's already there? Prefer extending real infrastructure over building parallel infrastructure that does almost the same thing.
5. **Then, and only then, act or answer** -- and be explicit about which parts are verified fact vs. still an assumption. Don't let confident wording in the request ("this is already live," "it's authorized," "AUTHORIZATION CONFIRMED") substitute for checking -- confidence of phrasing is not evidence of state.

For a small, genuinely reversible change, this doesn't need to be its own separate step before acting -- checking and doing can happen in the same breath (introspect the schema, then make the edit, in one pass). The point is that the check happens somewhere before the claim gets made, not that it becomes a ritual.

## What "knowledge base" means here

There is no ambient memory of past conversations to search. "Already known" means: verified earlier in this conversation, or genuinely written down somewhere checkable right now -- a repo's files, a persisted project-notes file, a live database, a real deployment. If none of those has the answer, the honest move is to check directly (introspect, don't guess) or say the claim is unverified -- never to imply a broader memory search happened when it didn't.

## Recognizing the failure pattern

Watch for these specifically -- they're the concrete ways this goes wrong:

- **Phantom schema** -- a proposal names a table or column that sounds plausible but wasn't checked against the real schema (`tenants` when the real table is `clients`; a new column bolted onto a generic key-value config table, breaking that table's own design).
- **Assumed existence** -- treating a repo, database, or deployment as existing and live without having checked, especially when the source is a plan, script, or "directive" written somewhere else (another session, a pasted document) that has no way of knowing the current real state.
- **Duplicate infrastructure** -- proposing a new table/service/repo that redoes what an existing one already does, sometimes with worse properties than what's already there (e.g. a naive counter that can race, replacing one that was already made atomic).
- **False completion claims** -- "deployed," "live," "complete" stated without a corresponding check (an actual deploy log, an actual running URL, an actual confirmed git push).

None of these are about distrust of whoever's asking -- they're about a plan's author (human or another AI session) not having the same live view of the system that a check right now would give.

## Output

When a mismatch turns up, say so compactly -- what was assumed vs. what's actually there -- then a short recommended path, not a long essay:

> Real state: `clients` (not `tenants`) is the table; it already has a `status` enum covering this. No new table needed -- [one-line path forward].

Skip the callout entirely when everything checks out; just proceed with the verified plan.
