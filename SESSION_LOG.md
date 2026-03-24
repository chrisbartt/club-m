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

## Session 3 — 2026-03-24 (continued)

### Actions
- Wrote Plan 3A (Events & Ticketing)
- Executed Plan 3A (4 blocks):
  1. Events + Tickets domains (8 files)
  2. Admin events pages (5 files)
  3. Public + Member events + Tickets (9 files)
  4. Continuity update

### Decisions
- Plan 3 split into 3A (Events), 3B (Directory), 3C (Orders + Business Dashboard)
- QR code displayed as monospace text for MVP
- Ticket goes directly to PAID (payment stub)
- Events use slug + timestamp for URL uniqueness

### Next
- Plan 3B: Directory + Business Profiles
