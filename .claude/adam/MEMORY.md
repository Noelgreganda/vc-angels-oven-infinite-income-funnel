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

#### 3. **fb-monetization-mvp** (Private)
- **Status:** Active
- **Description:** AI-powered multi-page management dashboard optimizing the Facebook Performance Bonus
- **Tech Stack:** TypeScript
- **Owner:** Noelgreganda
- **Key Features:** [To be filled in]
- **Deployment:** [To be filled in]

#### 4. **vc-angels-oven-parent**
- **Status:** Available
- **Tech Stack:** TypeScript
- **Owner:** Noelgreganda
- **Key Features:** [To be filled in]
- **Deployment:** [To be filled in]

### Future Projects (Named in Scope)
- **SIP** (Solar Install Pinoy) - [Affiliate system built & deployed]
- **BrainAtlas** - [Status & details TBD]
- **Training** - [Status & details TBD]
- **Affiliate System** - ✅ Complete with QR code & affiliate invitation

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

---

## 💾 Data Export

All project data, configurations, and decisions are tracked in this memory file for consistency and reference across sessions.

---

**Last Updated:** 2026-09-13  
**Memory Version:** 1.0
