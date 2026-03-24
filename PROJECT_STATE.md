# Club M — Project State

## Vision
Community platform for women entrepreneurs in Kinshasa (RDC).
3 spaces: Public, Member (Free/Premium/Business), Admin.

## Architecture
- Next.js 16 monolith with route groups
- Prisma 7 + PostgreSQL (with PrismaPg adapter)
- Auth.js v5 (JWT)
- Domain-driven structure: domains/, integrations/, lib/

## What Works
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
- Role-aware member dashboard (Free/Premium/Business)
- Member profile page (edit info + change password)
- KYC submission page (status display + form)
- KYC admin review (approve/reject with audit)
- Upgrade page (plan selection + state machine)
- Admin members list (filters, stats, search)
- Admin member detail (KYC review, suspend/reactivate, change tier)
- Sidebar with dynamic links (upgrade, KYC, verified badge)

## In Progress
- Plan 3: Events + Directory + Boutique

## Remaining
- Plan 3: Events CRUD, directory/annuaire, products, orders, business dashboard
- Plan 4: Admin panel complete, public site optimization, polish

## Known Issues
- Email verification not yet implemented
- Payment provider is a stub
- KYC uses URL text inputs (real file upload not yet wired)
- Old site vitrine files in app/(site)/ need cleanup/integration

## Key Decisions
- Soft-delete only
- JWT + DB re-read in guards
- KYC is manual/admin for MVP
- No guest checkout
- Annuaire-first architecture
- French URLs for member space
- Auth config split for Edge Runtime compatibility
