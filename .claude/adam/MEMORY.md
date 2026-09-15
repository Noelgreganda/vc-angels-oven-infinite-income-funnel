# Adam Command Center Memory

**Role:** Project Manager & Technical Advisor  
**Active Since:** 2026-09-13  
**Scope:** All projects (SIP, BrainAtlas, training, affiliate, etc.)

---

## 🎯 Core Responsibilities

- Centralized project coordination across all initiatives
- Architecture & technical decision recommendations
- Deployment strategy planning
- Feature prioritization
- Resource allocation guidance
- Build instruction execution
- Full data analysis + recommendations for all projects

---

## 📊 Projects Tracked

### Current Active Projects

#### 1. **vc-angels-oven-infinite-income-funnel** 
- **Status:** Active Development
- **Tech Stack:** TypeScript, Next.js, Supabase
- **Current Branch:** `claude/adam-command-center-l560qv`
- **Owner:** Noelgreganda
- **Key Features:** [To be filled in]
- **Deployment:** [To be filled in]

#### 2. **brainforge-ai**
- **Status:** Cloned (Available)
- **Description:** BrainForge AI automation platform for sales funnels, AI assistants, and digital product automation
- **Tech Stack:** JavaScript
- **Owner:** Noelgreganda
- **Key Features:** [To be filled in]
- **Deployment:** [To be filled in]

#### 3. **fb-monetization-mvp** (Private) — BrainAtlas platform code
- **Status:** Active
- **Description:** Multi-tenant Next.js app for the BrainAtlas Facebook-bot platform. One shared app + one shared Supabase project serve every client, isolated by rows (RLS) rather than separate infrastructure per client -- see BrainAtlas entry below for the reasoning.
- **Tech Stack:** Next.js 16, React 19, `@supabase/supabase-js`, `@google/genai` (Gemini, not Anthropic)
- **Owner:** Noelgreganda
- **Key Features:** Messenger webhook (`app/api/webhook/messenger/route.ts`) with per-tenant kill switch (`getTenant()` / `clients.status`, `fb_pages.is_active`), per-resource rate limiting (`checkQuota()`, `client_rate_limits`), dedup, canary flag (`client_capabilities`), `deployment_events` log. Reply generation is NOT built yet -- ingestion/safety only.
- **Deployment:** ❌ Not deployed. No Vercel project connected, no env vars set anywhere. Local build verified (`npm run build` passes) but nothing is live.
- **Vercel:** Project ID `prj_UUodrhr6KYPKOMpryQm8ghXQFWCo`, team ID `team_QYpVsJrdTZVIkWVkhhKrGEGG` (slug `noel-greganda-s-projects`). **Two different URLs exist for the same project** -- this caused real confusion: `https://fb-monetization-mvp-brainatlas-243p7ar66.vercel.app` (the original import-time domain, whose Git-push auto-deploy was confirmed broken -- never redeployed despite 4+ real commits landing on `origin/main`) vs. `https://fb-monetization-mvp.vercel.app` (the alias the GitHub Actions CLI-deploy workflow reports and updates). **Use the `.vercel.app` short one to check current state** -- confirmed actually live via a real successful `vercel deploy --prod` run (GitHub Actions run 34926533477, 2026-09-15T03:51Z). Whether the `-brainatlas-243p7ar66` domain also gets updated by CLI deploys is unconfirmed.
- **Deploy pipeline:** `.github/workflows/deploy.yml` deploys via `vercel deploy --prod` CLI, triggered on push to `main` + `workflow_dispatch`. `VERCEL_TOKEN`/`VERCEL_ORG_ID`/`VERCEL_PROJECT_ID` GitHub secrets are set and confirmed working (run succeeded 2026-09-15). This is now the real, verified deploy trigger -- Vercel's own dashboard Git integration should be considered unreliable for this project. A Vercel MCP connector is also available in-session but returns 403 Forbidden for this team/project -- authenticated as some identity without access to it, not usable for this project as-is.
- **First tenant onboarded (partially):** "Today in Philippine History" -- `clients.id = 2b59149d-d5bf-4213-b3a7-a7faf60258f4`, `status = 'onboarding'` (honest -- not `'active'` yet, see blocker below), `client_capabilities` canary flag set. Real Facebook Page ID confirmed: `1646483675599523` [stated by Noel]. Still blocked on the three FB secrets (see below) -- this specific tenant can now also go through the self-service onboarding flow below instead of a manual SQL insert, once the secrets exist.
- **Self-service onboarding app (2026-09-15, superseded same day by OAuth rebuild below):** `/onboarding` (public form) and `/admin` (password-gated, `ADMIN_PASSWORD` env var -- a stopgap, not real multi-admin auth) to approve/reject submissions and deactivate active tenants. Home page (`app/page.tsx`) is now a real landing page linking to both via `next/link` -- replaced the old internal demo dashboard that predated this session. No customer dashboard exists (no bot/reply pipeline to show data from), so no third link for it. All secret handling is server-side only (`app/api/onboarding`, `app/api/admin/submissions/**`, via `lib/supabaseAdmin`) -- nothing sensitive ever touches client-side code or the anon key. Documents live in a private Storage bucket (`onboarding-documents`), served to admins via 5-minute signed URLs, not public links. New schema: `clients` gained `full_name`/`onboarding_status`/`dti_registration_path`/`bir_registration_path`/`business_permit_path`/`verified_by_admin`/`verification_notes`; new tables `onboarding_submissions` (audit trail) and `admin_audit_log`. Deliberately did NOT build `tenant_metrics`/`division_metrics` or a shift-based performance dashboard from the original proposal -- no bot/reply pipeline exists yet to generate that data.
- **Fixed a real latent bug:** `lib/supabaseAdmin.ts` read `process.env.SUPABASE_URL`, but Vercel only has `NEXT_PUBLIC_SUPABASE_URL` set -- every server route using it (webhook included) would have thrown at runtime despite env vars showing "live" in Vercel. Now accepts either name.
- **Onboarding rebuilt on Facebook OAuth (2026-09-15, commit `caf54cb` on `fb-monetization-mvp`):** manual Page-access-token/App-Secret entry is gone -- tenants click "Connect Facebook Page", which opens a popup through one shared Facebook App ("BrainAtlas Integrator", app id `2693372515299698`, code fallback if `FACEBOOK_APP_ID` unset). `/api/facebook-oauth/start` builds the OAuth dialog URL (CSRF `state` in an httpOnly cookie); `/api/facebook-callback` exchanges the code for a long-lived Page token, lists the user's Pages via `/me/accounts`, encrypts each token (AES-256-GCM, `lib/tokenCrypto.ts`, key = `TOKEN_ENCRYPTION_KEY` env var) and stages it in a new table `oauth_pending_connections` -- the popup `postMessage`s only an opaque connection id + Page name back to the form, never the token. Final submission (`/api/onboarding`) resolves that id, copies the already-encrypted token into `fb_pages.access_token_secret`, marks the staged row consumed, and best-effort calls the Graph API to subscribe the Page to the app's webhook (`/{page-id}/subscribed_apps`) so there's no more "paste this into your Meta dashboard" step. Supabase migration `add_fb_oauth_connect_flow` applied directly (fb-monetization-mvp has no local `supabase/` migrations dir -- schema changes go through the Supabase MCP against project `rdjwnrouavvrlhozbzaa`).
  - **Real architectural consequence, not just UI:** one shared Facebook App means webhook signature verification and the `hub.verify_token` handshake can no longer be per-tenant DB lookups against `fb_pages.app_secret_secret`/`verify_token_secret` -- there's only one webhook config now, in the Integrator app's own Messenger settings. `app/api/webhook/messenger/route.ts` now checks `process.env.FACEBOOK_APP_SECRET` (signature) and `process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN` (handshake) directly instead. Those two `fb_pages` columns were relaxed to nullable in the migration (not dropped) and are left `NULL` for every OAuth-connected page.
  - Also fixed low text-contrast on every form field (`text-gray-900` + visible border + focus ring, was relying on browser-default gray).
  - `npm run build` + `tsc --noEmit` + `eslint` on the changed files all pass locally.
- **Env vars auto-provisioned + live (2026-09-15, commits `21d82bd`/`7467f83`, deploy run `34931306487`):** `deploy.yml` now generates and sets `TOKEN_ENCRYPTION_KEY` and `FACEBOOK_WEBHOOK_VERIFY_TOKEN` in Vercel on every deploy via `vercel env add` (idempotent -- no-ops once set), never surfaced in chat or committed anywhere. **First attempt (run `34930977844`) silently no-op'd on both** -- `vercel env add`/`vercel env ls` need an actual `.vercel/project.json`, which `vercel deploy` creates implicitly from `VERCEL_ORG_ID`/`VERCEL_PROJECT_ID` env vars but `vercel env` does not; fixed by adding `vercel link --yes` as the first command in that step. Confirmed via the CI job logs on the next run: "Set TOKEN_ENCRYPTION_KEY in Vercel production env." / "Set FACEBOOK_WEBHOOK_VERIFY_TOKEN in Vercel production env." Both are real now, not just a job that exited 0 -- worth remembering given the first run's false-positive. Verified via Supabase MCP post-deploy: `oauth_pending_connections`/`fb_pages`/`onboarding_submissions` row counts are exactly what's expected for zero real traffic (0/0/0, `clients`=1 unchanged), no new security/performance advisor findings, `add_fb_oauth_connect_flow` is the latest applied migration.
- **The one real remaining blocker: `FACEBOOK_APP_SECRET`.** Can't be self-provisioned like the other two -- it's issued by Meta for app `2693372515299698` and only exists in that app's dashboard (Settings -> Basic). The deploy workflow now checks for it every run and posts a `::warning::` in the Actions log if missing (confirmed firing on both runs above) rather than failing silently at request time. Also unconfirmed, and outside this session's access to check: whether "BrainAtlas Integrator" actually has Facebook Login enabled with `https://fb-monetization-mvp.vercel.app/api/facebook-callback` registered as a valid OAuth redirect URI, and whether `pages_messaging` needs Meta App Review / Business verification for non-admin/tester users -- that's a Meta dashboard question, not a code gap.
- **Could not live-test the deployed site this session** -- both this sandbox's own egress (proxy returns `connect_rejected`/org policy for `fb-monetization-mvp.vercel.app`) and the Vercel MCP connector (`web_fetch_vercel_url`/`list_deployments` -- 403 Forbidden, same team-scope issue noted above) are blocked from reaching it. Verification for this session was necessarily: local build/lint/typecheck, GitHub Actions job logs (real, not just exit codes), and direct Supabase queries -- not an actual browser run-through of `/onboarding`. Whoever has real browser access should click through it once `FACEBOOK_APP_SECRET` is set, to confirm the popup/postMessage flow actually works end to end, not just that each piece compiles.
- **Tenant task automation + review queue built (2026-09-15, commits `fcf79f9`/`ee5123b`).** Prompted by a "MISSION CRITICAL... full automation... Execute fully autonomous" request that had comment replies and daily posts auto-publishing to the real Page with zero human review, plus SQL against a schema that doesn't match reality (`clients.company_name`/`is_active`, `fb_pages.access_token` -- none of those columns exist) and a placeholder access token that would've undone the whole OAuth build. Declined to run that SQL or wire auto-publish; asked Noel directly (AskUserQuestion) whether the first version should auto-publish or queue for review -- he chose **review queue**. Built accordingly:
  - Migration `add_task_automation_review_queue`: `tenant_task_schedules` (which tasks are enabled per tenant), `content_drafts` (AI output sits `pending_review` until an admin approves/rejects -- flagged, not blocked, against the tenant's `compliance_packs` blocklist via `checkContentAgainstPack()` if one is assigned; "Today in Philippine History" has none, expected for a non-regulated content domain), `task_execution_logs` (every run including skips).
  - `app/api/tasks/executor` (`lib/generateContent.ts` for Gemini, `lib/facebookGraph.ts` for Graph calls) only ever writes drafts. `app/api/admin/content-drafts/[id]/approve` is the *only* route that calls the Graph API to actually publish -- new admin UI tabs (Content Review, Task Logs) alongside the existing Customers tab in `AdminDashboard.tsx`. `lib/rateLimit.ts` gained `gemini_tokens`/`facebook_publish` quota keys (both were anticipated-but-unwired placeholders already sitting in that file from earlier work).
  - **First deploy attempt (`fcf79f9`) failed outright**, not silently: `vercel.json` had 4 crons including an hourly one, and Vercel rejected the whole deploy -- "Hobby accounts are limited to daily cron jobs." All 4 failed together, so nothing shipped (prior build stayed live, no outage). Fixed (`ee5123b`) by collapsing to one daily cron with no query string; the executor now runs whatever's "due" that day internally (hourly+daily tiers every day, weekly only Monday, monthly only the 1st) instead of Vercel triggering each tier separately -- confirmed via CI logs on the retry that the deploy actually succeeded this time (full build + alias, not just exit 0).
  - Seeded all four schedules for the real tenant (`client_id 2b59149d-...`), `is_active=true`. They will legitimately no-op (skipped, logged) every day until the two blockers above clear: `FACEBOOK_APP_SECRET` unset -> no completed OAuth -> no `fb_pages` row for this tenant yet. Not tested live for the same egress/MCP-403 reasons noted above -- verified via migration confirmation, seed-row confirmation, and clean local build/typecheck only.
- **Messenger auto-reply built (2026-09-15, commit `7eb30b3`, LIVE -- confirmed via CI logs, this is the current production deployment).** Prompted by a second unreviewed-auto-publish snippet (this one for real-time DMs, with several real bugs too: unimported `axios`, nonexistent `@anthropic-sdk/sdk` package, plaintext `fb_pages.access_token` column that doesn't exist, nonexistent `engagement_log` table, a hardcoded fake `sentiment: 'positive'`). Declined to ship it as-is; asked Noel a second, narrower question since real-time chat genuinely can't wait for admin review the way a scheduled post can (unlike the mission-critical request above) -- he chose **auto-send, compliance-gated**. Built: every existing safety gate preserved (signature verification, two-level kill switch, inbound rate limit, dedup) plus a fix for a real gap that predated this change (`event.message.is_echo` was never filtered -- without it, the echo Meta sends back for the bot's own reply would log as a new inbound message and could reply to itself). Reply generates via Gemini, checked with `checkContentAgainstPack()`; a flagged reply is swapped for the tenant's `compliance_packs.content.escalationScript` (new `getEscalationScript()`) instead of sent as-is or dropped. `gemini_tokens`/`messenger_api_send` quotas now actually gate it.
- **Brand-voice context built (2026-09-15, commit `fecbf28`, on GitHub but NOT deployed yet -- see blocker below) -- third proposed snippet, this one for a standalone `/api/ai/generate-response` route calling Anthropic again.** No safety concern this time, just built as a shared `lib/brandContext.ts` wired into all three generation call sites (webhook reply, hourly comment drafts, daily post drafts) instead of a new authenticated route. `brand_voice` reads from `client_config` (key `"brand_voice"`, same generic table quota overrides use) with a generic default; `recentPosts` pulls the tenant's real last-3 published posts from `scheduled_posts` (empty, honestly, for a tenant with no publish history).
- **3 daily post candidates (commit `35aeb11`, undeployed) -- fourth snippet, a standalone unauthenticated `/api/content/generate` route.** Real bugs: no auth check at all (any caller could POST any `client_id` and burn Gemini quota), a new `generated_content` table duplicating `content_drafts` (so nothing it wrote would ever show up in the Content Review tab that already exists), client-supplied `niche`/`tone`/`language` bypassing the `client_config`-based brand-voice system just built, free-text parsing of one response on a `"---"` delimiter. It did get the core call right (`pending_review`, not auto-publish), so the one real improvement -- 3 options instead of 1 -- got folded into the existing `runDaily()` instead: generates candidates one at a time (each independently quota-gated and compliance-checked, so a quota cutoff mid-batch still leaves usable drafts), each fed the prior ones' openings as a "don't repeat this angle" note.
- **Real posting-time suggestion, not fake scheduling (commit `9ab576b`, undeployed) -- fifth snippet, `/api/scheduler/schedule-post`.** Worse bug than the others: accepted raw `access_token` and `page_id` directly in an unauthenticated request body -- the exact thing the whole OAuth/encryption build from earlier today exists to prevent. Also: `findPeakTime()` hardcoded to return `'8:00 AM'` with a comment admitting it's a placeholder; an empty `schedulePostToCloudScheduler()` stub introducing an unconfigured GCP dependency and doing nothing; a `scheduled_posts` insert using `status: 'scheduled'` (not a valid value in that table's real check constraint) and a `page_id` column that table doesn't have. All declined outright -- and did NOT build a substitute "find peak hour" feature that fires precisely either, since that's genuinely not buildable right now (same Hobby-plan one-cron-per-day limit already hit), and building the data half without the action half would just be a more sophisticated version of the same fabricated-precision problem being called out. What got built instead: `getPeakOnlineHour()` (`lib/facebookGraph.ts`) makes a real Graph Insights call (`page_fans_online_per_day`) and returns the actual best hour or `null` on any failure -- never a guessed fallback -- computed once per daily run (migration `add_content_drafts_suggested_post_hour`) and shown to the admin in Content Review as a labeled *suggestion* ("Publishing below still happens immediately on approval -- this is a hint, not a schedule"). Added `read_insights` to the OAuth scope now, before any real tenant has connected, so no one needs to reconnect later.
- **Admin Calendar tab, tenant-facing version declined as structurally unbuildable (commit `65b16e9`, undeployed) -- sixth snippet, `ContentCalendar.tsx`.** Before concluding anything, actually queried `pg_policies` and `is_admin()`'s real definition rather than assume: `scheduled_posts`/`fb_pages`/`clients` all have a genuine `is_admin()`-gated SELECT policy, and `is_admin()` checks a real Supabase Auth JWT claim (verified email == `noelgreganda@gmail.com`). An anon-key browser session with no login has no JWT, so this specific snippet would NOT have leaked data -- it would have silently shown "0 posts" for everyone forever (no error handling either, so a bug and a genuinely empty calendar look identical). The actual gap: this app has **no per-tenant login system at all** -- every admin-facing thing built this session is gated by the one shared `ADMIN_PASSWORD` for the platform operator. A real self-service "creator sees their own calendar" needs actual multi-tenant auth built first (a genuine, separate feature decision) -- not something to fake with an unscoped query against a table that already denies anonymous access by policy. Built the correct-for-today version instead: a "Calendar" admin tab (same `ADMIN_PASSWORD`-gated, service-role pattern as Content Review/Task Logs) showing `scheduled_posts` across tenants with real status badges. No fake "Edit" button -- editing isn't built, so nothing pretends it is.
- **Reply prompts enriched, fake confidence score declined (commit `5f78386`, undeployed) -- seventh snippet, `/api/ai/contextual-response`.** Substantially duplicated `runHourly`'s comment-reply drafting already built; same no-auth/duplicate-table/nonexistent-Anthropic-package pattern as before, declined. Two real improvements folded into the shared `buildBrandPromptPrefix()` (so all three generation sites get them, not just comment replies): the parent post's own text now travels with each comment (`getRecentPageComments` fetches `post.message` too -- it didn't before, so replies were generated from the comment alone with no idea what it was replying to), and explicit "sound human, not corporate bot" guidance. Declined `calculateConfidence()` -- a keyword-counting heuristic (-20 per generic phrase, +10 per emoji) dressed up as a 0-100 "confidence score" shown to the reviewing admin. Same fabricated-precision problem as the hardcoded `8:00 AM` two turns before: a number that looks calibrated but isn't could bias the human review it's supposedly informing. Human judgment stays the only quality gate.
- **Inline edit + real regenerate added; fake "Posted!" success state declined (commit `afc2119`, undeployed) -- eighth snippet, `ResponseReview.tsx`.** Worst issue of this whole run: `handleApprove()` updated a DB row then unconditionally showed "✅ Posted! Your response is now live" with zero Facebook API call anywhere -- just a comment describing what should happen. A direct false-success message to a real person, not just an internal stub. Compounding it: the write targeted `content_drafts` with the anon key, and that table has RLS enabled with zero policies (confirmed two turns ago) -- would've silently no-op'd, 0 rows affected, no error. Declined outright, along with the usual duplicate table (`generated_responses`), an empty "Generate Alternative" `onClick`, and the unbacked `confidence_score` prop (consistent with declining `calculateConfidence()` itself last turn). Two real ideas shipped properly: inline editing (`content-drafts/[id]/approve` now accepts an optional `content` override in the POST body, publishes/stores that; the queue's read-only text is now an editable textarea) and a real Regenerate action (new `content-drafts/[id]/regenerate` route -- same brand context, same compliance check, `gemini_tokens`-gated, replaces the row in place rather than leaving a duplicate).
- **Ninth snippet declined outright, no substitute built -- `AuthenticityScore.tsx`.** `calculateAuthenticityMetrics()` ignored its input entirely -- hardcoded `{85, 88, 75, 90, 85}` regardless of what data was passed, displayed as "✅ Your responses sound completely authentic. Followers can't tell they're AI-assisted." Unlike every other snippet this session, declined to build any substitute version: a single blended "authenticity score" claiming to predict whether real people can detect AI-generated content isn't measurable from reply text alone at any level of honest sophistication -- it would need to ask actual followers. Also named directly (not just a bug): "followers can't tell it's AI" as a stated goal is explicitly optimizing for undetectable AI engagement, adjacent to what platforms treat as inauthentic-behavior risk. Offered honest, separately-labeled descriptive stats (e.g. "3 of your last 20 replies were near-duplicates") as an alternative if wanted; did not build it unprompted.
- **Real narrative weekly/monthly reports (commit `957998c`, undeployed) -- tenth snippet, `/api/reports/generate-weekly`.** Reintroduced a problem already specifically avoided in `runReport()` two turns earlier: `sendEmailReport()` was an empty stub (no code) yet the route claimed `"...emailed to you."` -- same false-success pattern as the "Posted!" issue. Also a new `weekly_reports` table duplicating `task_execution_logs` (built specifically because no email provider exists here), `engagement_log` again, plaintext `access_token` again, no auth, `axios`/Anthropic again. Declined. The real improvement -- an LLM narrative instead of raw counts -- got added to `runReport()` itself: only generates when there's real published-post content to ground it (an LLM asked to analyze zero data will invent a plausible-sounding analysis otherwise), explicitly told not to invent numbers beyond what's given, `gemini_tokens`-gated. New `getPageEngagementSummary()` (`page_engaged_users`/`page_posts_impressions_unique` from real Graph Insights) feeds it real engagement totals, null on any failure -- same rule as `getPeakOnlineHour`. Still lands in `task_execution_logs.details`, visible in the existing Task Logs tab.
- **Report narrative rendering, fabricated recommendations declined (commit `e4b5244`, undeployed) -- eleventh snippet, `WeeklyReport.tsx`.** Worst single fabrication of the whole run: "Next Week's Goal" was entirely hardcoded static JSX ("Double down on history posts (3x higher engagement than quotes)") under "Based on this week's data, focus on:" -- zero connection to any data, same for every tenant every week forever, with a specific-sounding "3x" stat that was never computed anywhere. Declined outright, no substitute "recommendations" section built -- the real narrative from last turn already covers that, grounded in real data. Also declined (usual pattern): `weekly_reports`/`engagement_log` again, unbacked `engagement_score`, dead Download/Share buttons. What shipped: Task Logs now renders a report's real narrative as prose + real stats instead of raw JSON, for entries that have one.
- **New hard blocker, unrelated to Meta: Vercel Hobby plan's 100-deployments/day cap was hit mid-session.** `git push` for `fecbf28` triggered `deploy.yml` as always, but `vercel deploy` failed with `Error: Resource is limited - try again in 24 hours (more than 100, code: "api-deployments-free-per-day")`. This is cumulative across the whole day's iteration (this session pushed ~9 times), not caused by any single bad commit. Confirmed via the actual `vercel deploy` error text in CI logs, not assumed. Current live production commit is `7eb30b3` (has the compliance-gated Messenger auto-reply).
  - **Revised guidance (superseding what an earlier version of this note said):** still commit + push normally after each change -- this is an ephemeral session, uncommitted work doesn't survive it, and `git push` itself is unaffected (GitHub has no such limit; only the `vercel deploy` step inside the triggered workflow fails). What changed: stopped spending a full Monitor-and-check-logs cycle confirming each subsequent predictable failure once the cause was already confirmed once -- that was pure waste after the first confirmation. Eight more commits landed this way (`35aeb11` 3-candidate daily posts, `9ab576b` real Insights-based posting-time suggestion, `65b16e9` admin Calendar tab, `5f78386` reply prompt improvements, `afc2119` inline edit + regenerate, `957998c` narrative reports, `e4b5244` report rendering, `91a8807` Needs Attention tab), all fully built and locally verified, sitting on `main` un-deployed. **All of `fecbf28` through `91a8807` will deploy together** on the next successful run once the quota clears (~24h from whenever the count started) or Noel upgrades to Pro -- a `workflow_dispatch` run on `deploy.yml`, or any new commit, will pick up everything queued.
- **12th snippet declined entirely, nothing built -- `sms-and-messenger/route.ts`.** Unlike every other snippet this session, this one wasn't a buggy-but-improvable new idea -- it was a straight regression: a full duplicate of the already-live, already-correct Messenger webhook (`7eb30b3`) with every safety mechanism stripped back out (no signature verification, no kill switch, no dedup, no `is_echo` filtering -- reintroducing the self-reply-loop bug fixed two commits into the webhook work) and two unreviewed AI-influenced messages auto-sent per inbound message, the exact pattern Noel steered away from via the earlier "auto-send, compliance-gated" decision. Flagged plainly that adopting it would be a downgrade from what's live; nothing built.
- **Needs Attention tab (commit `91a8807`) -- 13th snippet, `/api/leads/should-escalate`.** A new LLM call to classify whether an inquiry needs a human, then `notifyOwner()` -- another empty stub implying WhatsApp/Telegram/Slack, same category declined multiple times already (no notification provider configured anywhere in this app). Declined the new classification call and the notification stub both. But the underlying signal already existed, unused: the webhook's `checkContentAgainstPack` flagging (built several turns ago) already determines "this needs a human" every time it swaps in the escalation script. Wired that existing signal into `conversations.flags` (jsonb, already designed for this -- no new column) and a new admin tab listing flagged conversations with a Mark Handled action, instead of adding a second, redundant classification step and an invented notification channel.
- **Old blocker (now moot -- manual entry no longer exists):** ~~the `fb_pages` row can't be created yet -- `access_token_secret`, `verify_token_secret`, `app_secret_secret` are all `NOT NULL`~~ superseded by the OAuth rebuild above; the first tenant ("Today in Philippine History") should now go through `/onboarding`'s Connect button like any other tenant once the three env vars above are set.

#### 4. **vc-angels-oven-parent**
- **Status:** Available
- **Tech Stack:** TypeScript
- **Owner:** Noelgreganda
- **Key Features:** [To be filled in]
- **Deployment:** [To be filled in]

#### 5. **sipai-legal** (Private) — SIP AI platform code
- **Status:** Active, deployed
- **Description:** SIP AI's real repo -- Firebase project `solar-install-pinoy` (the only real SIP Firebase project; `solar-install-pinoy-ai` exists but is empty). One repo, one Firebase project, one GitHub Actions pipeline, per the "no duplicates" rule set for this session.
- **Tech Stack:** React (CRA), Firebase Hosting/Firestore/Functions (Node 20, Gen1)
- **Owner:** Noelgreganda
- **Key Features:** Affiliate signup, assessor auth (fail-closed access-code check), FB group moderation webhook, stall-recovery nudges, client Messenger notifications, quotation email -- 11 Cloud Functions total, all deployed and verified in GitHub Actions logs.
- **Deployment:** ✅ Live -- `https://solar-install-pinoy.web.app`. `FB_PAGE_TOKEN`/`GMAIL_PASSWORD`/etc. are optional secrets not yet set, so those specific features log instead of sending until real values are added.

### Future Projects (Named in Scope)
- **SIP** (Solar Install Pinoy) - See `sipai-legal` entry above and Build Instructions below.
- **BrainAtlas** - See `fb-monetization-mvp` entry above. Not a separate repo -- it's that Next.js app + the `brainatlas-production` Supabase project (ref `rdjwnrouavvrlhozbzaa`, org "BrainAtlas Digital Solutions"). Schema already has a real multi-tenant design (`clients`, `fb_pages`, `conversations`, `messages`, `client_config`, `client_capabilities`, `client_products`, `bookings`, `orders`, `scheduled_posts`, `escalations`, `compliance_packs`, `client_rate_limits`, `deployment_events`, plus dedup tables) -- one seeded compliance pack (`wellness-supplements-ph`) already maps to a future Lifestyles Direct Distributor tenant. Two tenants planned: "Today in Philippine History" (content pipeline) and "Lifestyles Direct Distributor" (compliance-heavy). Neither is onboarded yet.
- **Training** - [Status & details TBD]
- **Affiliate System** - ✅ Complete with QR code & affiliate invitation

### Skills (`.claude/skills/`)
- **planning-master** - Verification gate before any build/architecture decision: check what's already decided/built before proposing new infra, name blockers upfront. Built after repeated pasted "execution scripts" from elsewhere assumed schema/infra that didn't match reality.
- **session-memory** - Avoid re-paying tokens/time for work already done in-session: read once per file, batch edits, consolidate duplicate notes, summarize before a full re-read.
- Both still in draft form -- no formal eval/test pass run yet, refined against real cases as they come up.

---

## 🔄 Workflow Rules

### When You Ask Adam:
1. **Provide full data analysis** of requested project(s)
2. **Include recommendations** for:
   - Architecture decisions
   - Deployment strategy
   - Feature prioritization
   - Resource allocation
3. **Build instructions** → Execute immediately
4. **Deployment orders** → Execute with confirmation
5. **Cross-project coordination** → Analyze dependencies across all projects

### Adam's Response Format:
```
## Project: [Name]
**Status:** [Current]
**Analysis:** [Full data]
**Recommendations:** [Actionable advice]
**Next Steps:** [What's needed]
```

---

## 📋 Build Instructions Repository

### ✅ SIP Affiliate Invitation System
- **Issue:** QR code pointing to broken URL with `~~` placeholder
- **Fix:** Generated correct QR code pointing to `https://sipai-legal.web.app/qa/`
- **Status:** ✅ DEPLOYED & WORKING
- **Date:** 2026-09-13
- **QR Code:** `public/sip-affiliate-signup-qr.png` (decoded back with `jsqr` and verified)
- **Full details:** `.claude/adam/SIP-AFFILIATE-DEPLOYMENT.md` (single source of truth for this)
- **Decision:** `solarinstallpinoy.com` is not registered and there's no plan
  to buy it. Do not build redirects, email addresses, or QR codes against
  that domain for this project — use the Firebase URL directly.
- **Cleanup:** Removed the dead `affiliate-invitation-system.tsx` (unreachable,
  imported an uninstalled package) and the unverified CDN-based QR generator
  in `affiliate-invitation.html` (now embeds the verified PNG directly, no
  external dependency). One working implementation, not three.
- **Contact email:** `affiliate-invitation.html` shows `solarinstall.pinoy@gmail.com`
  (set 2026-09-13), replacing the dead `affiliate@solarinstallpinoy.com`.

---

## 🚀 Deployment Log

### 2026-09-13 - SIP Affiliate QR Code
- **Status:** ✅ LIVE
- **URL:** https://sipai-legal.web.app/qa/
- **QR Code:** Generated and verified working
- **Trainees:** Can scan QR code to access affiliate signup
- **Distribution:** Ready for print/digital sharing

### 2026-09-14 - SIP AI: 11 Cloud Functions
- **Status:** ✅ LIVE (verified in GitHub Actions logs, not just assumed)
- **URL:** https://solar-install-pinoy.web.app
- **Note:** First deploy attempt genuinely failed (GCP-side contention, not a code bug); retry succeeded cleanly within 2 minutes.

### 2026-09-14 - BrainAtlas: webhook safety layer (not deployed)
- **Status:** ⚠️ Code complete and verified against the live DB, but not live anywhere -- no Vercel project connected yet.
- **What shipped:** kill switch, per-resource rate limiting, dedup, canary capability flag, `deployment_events` table, all in `fb-monetization-mvp`.
- **Not built:** reply generation, tenant onboarding flow. `fb_pages` has zero rows -- no real tenant exists.

---

## 💾 Data Export

All project data, configurations, and decisions are tracked in this memory file for consistency and reference across sessions.

---

**Last Updated:** 2026-09-14
**Memory Version:** 1.1
