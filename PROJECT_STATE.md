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
- Auth.js v5 configuration
- Server-side auth guards
- Middleware route protection
- Member registration + Customer registration
- Login with role-based redirect
- Protected layouts (member, admin)
- Seed data (admin, free, premium, business, customer)

## In Progress
- Plan 2: Member space + KYC + Upgrade

## Remaining
- Plan 2: Member dashboard content, profile, KYC, upgrade flow
- Plan 3: Events, directory, boutique, business dashboard
- Plan 4: Admin panel, public site optimization, polish

## Known Issues
- Email verification not yet implemented
- Payment provider is a stub
- Old site vitrine files in app/(site)/ need cleanup/integration

## Key Decisions
- Soft-delete only
- JWT + DB re-read in guards
- KYC is manual/admin for MVP
- No guest checkout
- Annuaire-first architecture
