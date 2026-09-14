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
- **Blocked on:** (1) Vercel project (manual, vercel.com/import), (2) real Supabase env vars set directly in Vercel, (3) a real first tenant -- `fb_pages` has zero rows; onboarding needs an actual Facebook Page ID + access token, not a placeholder.

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
