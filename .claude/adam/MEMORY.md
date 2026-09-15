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
- **Vercel:** connected -- `https://fb-monetization-mvp-brainatlas-243p7ar66.vercel.app`. Env vars set. Not independently verified from this session (egress policy blocks `*.vercel.app` and `graph.facebook.com` from this container -- confirmed via the proxy's own status endpoint, not assumed). Noel should confirm directly: GET `/api/webhook/messenger?hub.mode=subscribe&hub.verify_token=bogus&hub.challenge=x` should return the literal 9-byte body `Forbidden`.
- **First tenant onboarded (partially):** "Today in Philippine History" -- `clients.id = 2b59149d-d5bf-4213-b3a7-a7faf60258f4`, `status = 'onboarding'` (honest -- not `'active'` yet, see blocker below), `client_capabilities` canary flag set. Real Facebook Page ID confirmed: `1646483675599523` [stated by Noel]. Still blocked on the three FB secrets (see below) -- this specific tenant can now also go through the self-service onboarding flow below instead of a manual SQL insert, once the secrets exist.
- **Self-service onboarding app (2026-09-15):** `/onboarding` (public form: business info, FB Page ID/access token/App Secret, DTI/BIR/business-permit document upload -- verify token is no longer typed by the user, see below) and `/admin` (password-gated, `ADMIN_PASSWORD` env var -- a stopgap, not real multi-admin auth) to approve/reject submissions and deactivate active tenants. The submitted Page access token is validated against Meta's Graph API server-side before anything is written to the DB; the verify token is generated automatically and shown once on success along with the correct callback URL (derived from the request origin, not hardcoded). All secret handling is server-side only (`app/api/onboarding`, `app/api/admin/submissions/**`, via `lib/supabaseAdmin`) -- nothing sensitive ever touches client-side code or the anon key. Documents live in a private Storage bucket (`onboarding-documents`), served to admins via 5-minute signed URLs, not public links. New schema: `clients` gained `full_name`/`onboarding_status`/`dti_registration_path`/`bir_registration_path`/`business_permit_path`/`verified_by_admin`/`verification_notes`; new tables `onboarding_submissions` (audit trail, masked token only) and `admin_audit_log`. Deliberately did NOT build `tenant_metrics`/`division_metrics` or a shift-based performance dashboard from the original proposal -- no bot/reply pipeline exists yet to generate that data.
- **Fixed a real latent bug:** `lib/supabaseAdmin.ts` read `process.env.SUPABASE_URL`, but Vercel only has `NEXT_PUBLIC_SUPABASE_URL` set -- every server route using it (webhook included) would have thrown at runtime despite env vars showing "live" in Vercel. Now accepts either name.
- **Blocked on:** the `fb_pages` row can't be created yet -- `access_token_secret`, `verify_token_secret`, `app_secret_secret` are all `NOT NULL` in the real schema, and we only have the Page ID. Need, from Noel: (1) a Page access token (Meta Graph API Explorer or Page settings), (2) the Facebook App's App Secret (Meta App dashboard -> Settings -> Basic), (3) a verify token Noel picks himself. Once those exist, either run them through `/onboarding` + `/admin` approval, or insert directly and flip `clients.status` to `'active'`.

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
