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

## Session 4 — 2026-03-24 (continued)

### Actions
- Executed Plan 3B (3 blocks):
  1. Directory + Business domains (queries, actions, validators, types)
  2. Public annuaire + Member business profile pages + components
  3. Products management, admin annuaire moderation, member annuaire

### Files Created (Block 3)
- components/directory/product-card.tsx — Product display card (server component)
- components/directory/product-form.tsx — Create/edit product form (client component)
- components/directory/toggle-active-button.tsx — Toggle product active state (client component)
- app/(member)/mon-business/produits/page.tsx — Products list page
- app/(member)/mon-business/produits/nouveau/page.tsx — New product page
- app/(member)/mon-business/produits/[id]/page.tsx — Edit product page
- components/admin/profile-moderation-actions.tsx — Approve/reject profile buttons
- app/(admin)/admin/annuaire/page.tsx — Admin directory moderation page
- app/(member)/annuaire/page.tsx — Member annuaire page

### Decisions
- Product images use comma-separated URLs for MVP
- Admin annuaire uses simple link-based filter (all/pending/approved)
- Member annuaire reuses DirectoryFilters component from public annuaire

### Next
- Plan 3C: Orders, code confirmation, business dashboard

## Session 5 — 2026-03-24 (continued)

### Actions
- Executed Plan 3C (4 blocks):
  1. Orders domain + Dashboard queries (types, queries, actions, validators, dashboard-queries)
  2. Product detail page + Buyer purchases page (with confirmation codes)
  3. Seller orders management + Business dashboard (KPIs, revenue chart, clients, recent orders)
  4. Admin orders supervision page + Continuity files update

### Decisions
- Confirmation code: 6-char alphanumeric, expires in 14 days
- Commission rate: 10% on each order
- Admin orders includes business relation for seller visibility
- OrderForAdmin type extends OrderForSeller with business info

### Next
- Plan 4: Admin panel complete, public site optimization, polish

## Session 6 — 2026-03-24 (continued)

### Actions
- Executed Plan 4 (3 blocks):
  1. Admin analytics dashboard + admin queries
  2. Admin remaining pages (events create/detail, members detail)
  3. Site integration + Cleanup + Continuity

### Block 3 Details
- Updated navbar with site navigation links (A propos, Offres, Evenements, Annuaire, Contact)
- Added mobile responsive hamburger menu (Sheet component)
- Updated homepage with hero, stats (members/events/businesses), featured events, featured businesses, CTA
- Deleted obsolete `app/api/auth/register/route.ts` (old API route)
- Fixed `lib/auth.config.ts` TypeScript errors (callback typing)
- Updated CLAUDE.md, PROJECT_STATE.md, SESSION_LOG.md

### Files Created/Modified
- components/shared/navbar.tsx — Updated with full site navigation
- components/shared/mobile-nav.tsx — New client component for mobile menu
- app/(public)/page.tsx — Full landing page with dynamic data
- lib/auth.config.ts — Fixed TS errors with `any` typed callbacks + `satisfies`

### MVP Status
MVP is complete. All plans (1, 2, 3A, 3B, 3C, 4) executed successfully.
