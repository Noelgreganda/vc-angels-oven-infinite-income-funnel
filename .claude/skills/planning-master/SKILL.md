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

# Planning Master: Research → Plan → Execute

Trigger this skill whenever you're about to:
- Write code for a feature or build
- Deploy anything to infrastructure (Vercel, Firebase, Supabase, etc.)
- Create a new service/tool/automation
- Define a workflow or process
- Generate commands/scripts for ADAM execution

## Why this exists

Every proposal to build something carries implicit claims about the state of the world: that a decision was already made, that a table/service/repo exists, that a dependency is available. Those claims are often wrong -- not from dishonesty, but because plans get written from memory, or from a different session's mental model, and memory drifts from reality fast. Checking first is cheap. Discovering a duplicate table, a missing secret, or a "deployment" that never happened is not.

## Core Workflow

### Step 1: Research Existing Decisions (~5 min)
Before proposing anything, ask:
- **This conversation + project files:** What's already been decided or verified here, or written down in the project's own persisted notes, config, or docs? Check those directly rather than re-deciding from scratch.
- **Live infrastructure:** What already exists? (Check the real database schema, real repos, real deployed services -- not what a plan or script *claims* exists.)
- **Online, if genuinely needed:** Are there industry-standard approaches that clarify the best path, when the answer isn't already settled by the above?

Use whatever search/lookup tools actually exist in the current session -- a real web-search tool, real database/schema introspection, real git/repo access. Don't invoke a specific tool name or file path (a cross-chat memory search, a fixed path like `/areas/...` or `/memory/...`) unless it's confirmed to exist in *this* environment and *this* project first -- assuming a capability or file exists when it doesn't is the phantom-capability version of the phantom-schema problem this skill exists to catch. Project notes live wherever this project actually keeps them (check for a persisted notes/memory directory before assuming its name or location). If no broader cross-chat search is available, say plainly that the check covered this conversation and the project's files, not a wider archive.

**Do not skip this step.** Most failed builds here come from not knowing what was already decided or built, not from writing bad code.

### Step 2: Identify What's Real (~3 min)
List what actually exists, verified, not assumed:
- ✅ Infrastructure (repos, databases, deployments) -- confirmed by direct inspection
- ✅ Credentials/secrets -- what's actually configured vs. missing
- ✅ Previous work -- what was built, what was set aside, and why
- ❌ Blockers -- what doesn't exist yet, what needs adding before this runs for real

**Ask the user directly when it's unclear**, rather than guessing either way.

### Step 3: Propose the Streamlined Plan (~5 min)
1. **Zero duplication** -- don't recreate infrastructure that already exists.
2. **Fastest route** -- extend existing code/schema; don't scaffold a new project when extending gets there faster.
3. **Safest approach** -- name isolation boundaries, error handling, fallback behavior explicitly.
4. **Minimal dependencies** -- list credentials/configs actually needed; flag missing ones now, not at deploy time.
5. **Clearest execution** -- one focused goal, not several speculative features bundled together.

### Step 4: Confirm Before Executing
Ask: "Proceed with this plan?"
- If yes → execute.
- If no → refine based on feedback.

## When to Force These Questions

Always ask before you proceed:

1. **"Do we already have a decision on this?"**
   - Check this conversation, and whatever persisted project notes/docs actually exist and are reachable right now.
   - If yes → align with that decision, don't contradict it.
   - If no → propose a decision and confirm it.

2. **"Do we already have this built?"**
   - Check live infrastructure directly (database, repos, deployment status).
   - Check the project's own recorded architecture/notes, wherever they actually live in this project.
   - If yes → extend it, don't rebuild.
   - If no → build it once, right.

3. **"What's the fastest, safest, easiest route?"**
   - Compare 2-3 options.
   - Explain the tradeoff for each.
   - Recommend the one that saves the most time/resources/risk.
   - Confirm with the user before proceeding.

4. **"What blockers exist? What's missing?"**
   - Credentials (API keys, service-role keys, tokens, etc.)
   - Infrastructure (a connected deployment platform, a configured service, etc.)
   - Decisions (should we do X or Y? which tenant/client first?)
   - **Flag these upfront, don't assume they exist.**

## Red Flags (Stop and Clarify)

- ❌ "I'll scaffold a new repo for this" (before checking if an existing repo can be extended)
- ❌ "Create a new table..." (before verifying the existing schema)
- ❌ "Deploy to Vercel" (without confirming a Vercel project exists and secrets are set)
- ❌ "Here's a command to run" (without first confirming the user has visibility into what's real)
- ❌ "This should take X hours" (without confirming dependencies and blockers)

On any of these, **stop and ask questions first.**

## Example: Right Way vs Wrong Way

**WRONG:**
> "I'll scaffold a new BrainAtlas repo, create the Supabase schema, deploy to Vercel, and wire up tenants."

**RIGHT (this skill):**
> "Before I scaffold anything, let me check: (1) Does fb-monetization-mvp already exist? Yes ✅. (2) Is there already a Supabase project? Yes, brainatlas-production ✅. (3) Is it deployed to Vercel? No ❌. So: don't scaffold a new repo (extend the existing one), don't create a new schema (use the existing one), DO connect to Vercel (missing), DO set secrets (missing). Here's the streamlined plan..."
