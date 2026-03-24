# Club M — Session Log

## Session 1 — 2026-03-23

### Actions
- Brainstormed and validated product design
- Wrote design spec v1.1
- Wrote Plan 1 (Foundation)
- Executed Plan 1 (6 blocks):
  1. Prisma schema + migration
  2. Core lib + integration abstractions
  3. Auth.js v5 + guards + middleware
  4. Members domain
  5. Providers + auth pages + protected layouts
  6. Seed + continuity files
- Fixed Edge Runtime issue (split auth.config.ts / auth.ts)

### Decisions
- Monolith modulaire Next.js (Approach A)
- Auth.js v5 beta (no stable v5 yet)
- PrismaPg adapter pattern
- Zod 4 syntax adaptations
- Admin routes at (admin)/admin/ for correct /admin/* URLs
- Auth config split for middleware Edge Runtime compatibility

## Session 2 — 2026-03-24

### Actions
- Wrote Plan 2 (Member + KYC + Upgrade)
- Executed Plan 2 (5 blocks):
  1. Fix route protection URLs (French alignment)
  2. Profile + KYC + Upgrade domains (13 files)
  3. Dashboard + member pages (10 files)
  4. Admin members + KYC review
  5. Sidebar polish + continuity files

### Decisions
- French URLs throughout member space (/profil, /achats, /kyc, etc.)
- KYC uses URL text inputs for MVP (file upload later)
- Admin uses /admin/membres (French) for consistency
- Zod 4 .refine() works correctly

### Next Session
- Write and execute Plan 3 (Events + Directory + Boutique)
