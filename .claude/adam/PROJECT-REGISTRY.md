# Adam Project Registry

Central registry for all projects under management.

## Repository Connections

| Project | Repo | Status | Tech | Path |
|---------|------|--------|------|------|
| vc-angels-oven-infinite-income-funnel | `Noelgreganda/vc-angels-oven-infinite-income-funnel` | Active | TypeScript | `/home/user/vc-angels-oven-infinite-income-funnel` |
| brainforge-ai | `Noelgreganda/brainforge-ai` | Available | JavaScript | `/home/user/noelgreganda/brainforge-ai` |
| fb-monetization-mvp (BrainAtlas code) | `Noelgreganda/fb-monetization-mvp` | Private, built, not deployed | Next.js 16 | `/home/user/fb-monetization-mvp` |
| vc-angels-oven-parent | `Noelgreganda/vc-angels-oven-parent` | Available | TypeScript | — |
| sipai-legal (SIP AI code) | `Noelgreganda/sipai-legal` | Private, live | React + Firebase Functions | `/home/user/sipai-legal` |
| SIP | see `sipai-legal` | Live | — | — |
| BrainAtlas | see `fb-monetization-mvp` + Supabase `brainatlas-production` (ref `rdjwnrouavvrlhozbzaa`) | Code built, not deployed | Supabase + Next.js | — |
| Training | — | TBD | — | — |
| Affiliate | see `sipai-legal` | Live | — | — |

## Architecture Overview

```
Adam Command Center (Central Hub)
├── SIP / Affiliate  → sipai-legal (Firebase: solar-install-pinoy) -- LIVE
├── BrainAtlas       → fb-monetization-mvp (Next.js) + Supabase brainatlas-production -- built, not deployed
├── Training
├── vc-angels-oven-infinite-income-funnel (Current)
├── brainforge-ai
└── vc-angels-oven-parent
```

## Quick Access

- **Current Working Directory:** `/home/user/vc-angels-oven-infinite-income-funnel`
- **Brainforge AI:** `/home/user/noelgreganda/brainforge-ai`
- **fb-monetization-mvp (BrainAtlas):** `/home/user/fb-monetization-mvp`
- **sipai-legal (SIP AI):** `/home/user/sipai-legal`
- **This Memory:** `/home/user/vc-angels-oven-infinite-income-funnel/.claude/adam/`
