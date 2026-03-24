# Club M — Project State

## Vision
Community platform for women entrepreneurs in Kinshasa (RDC).
3 spaces: Public, Member (Free/Premium/Business), Admin.

## Architecture
- Next.js 16 monolith with route groups
- Prisma 7 + PostgreSQL (with PrismaPg adapter)
- Auth.js v5 (JWT)
- Domain-driven structure: domains/, integrations/, lib/

## MVP Complete

All 4 plans executed as of 2026-03-24.

### Plan 1: Foundation
- Database schema (all 17 models)
- Core lib (errors, permissions, routes, constants, utils)
- Integration abstractions (payment, email, storage, kyc)
- Auth.js v5 configuration (split config for Edge Runtime)
- Server-side auth guards
- Middleware route protection
- Member registration + Customer registration
- Login with role-based redirect
- Protected layouts (member, admin)
- Seed data (admin, free, premium, business, customer)

### Plan 2: Member Space + KYC + Upgrade
- Role-aware member dashboard (Free/Premium/Business)
- Member profile page (edit info + change password)
- KYC submission page (status display + form)
- KYC admin review (approve/reject with audit)
- Upgrade page (plan selection + state machine)
- Sidebar with dynamic links (upgrade, KYC, verified badge)

### Plan 3A: Events & Ticketing
- Events domain (CRUD, pricing dynamique, admin queries)
- Tickets domain (booking, QR generation, scanning)
- Admin events pages (list, create, detail with pricing and tickets)
- Public events pages (listing, detail with pricing display)
- Member events (booking with tier pricing, access control)
- Tickets page (QR codes, upcoming/past grouping)

### Plan 3B: Directory & Business Profiles
- Directory domain (queries, actions, admin-actions, validators, types)
- Business domain (product queries, actions, validators, types)
- Public annuaire (listing with filters, profile detail with mini-boutique)
- Member business profile (create/edit, publish toggle, profile type)
- Member products management (list, create, edit, toggle active)
- Admin annuaire moderation (approve/reject profiles, filter by status)
- Member annuaire (directory view with enhanced contact info)

### Plan 3C: Orders & Business Dashboard
- Orders domain (purchase, shipping, delivery confirmation with code)
- Product detail page with purchase
- Buyer purchases page with confirmation codes
- Seller orders management with delivery confirmation
- Business dashboard (KPIs, revenue chart, clients, recent orders)
- Admin orders supervision

### Plan 4: Admin Complete + Polish
- Admin analytics dashboard (KPIs, charts)
- Admin events management (list, create, detail)
- Admin members management (list, detail, KYC review, suspend/reactivate)
- Admin orders supervision
- Public navbar with site navigation + mobile menu
- Homepage with stats, featured events, featured businesses
- Cleanup: deleted obsolete API route, fixed auth.config.ts types

## Known Limitations (MVP)
- Email verification not yet implemented
- Payment provider is a stub
- KYC uses URL text inputs (real file upload not yet wired)
- Old site vitrine files in app/(site)/ kept as-is for reference

## Key Decisions
- Soft-delete only
- JWT + DB re-read in guards
- KYC is manual/admin for MVP
- No guest checkout
- Annuaire-first architecture
- French URLs for member space
- Auth config split for Edge Runtime compatibility
