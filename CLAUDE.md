# Club M — CLAUDE.md

## Project

Club M is a community platform for women entrepreneurs in Kinshasa, DRC.
Monolithic Next.js 16 app with route groups: (public), (auth), (member), (admin).

## Non-Negotiable Rules

1. No business logic in `app/` — pages call `domains/` and render results
2. No direct Prisma imports in `app/` or `components/` — use `domains/*/queries.ts` or `actions.ts`
3. Every Server Action starts with a guard: `requireAuth()`, `requireMember()`, etc.
4. Every Server Action validates input with Zod
5. Errors use typed classes: `AuthError`, `ValidationError`, `BusinessError`
6. JWT is a transport optimization — guards always re-read the DB
7. Images go through Cloudinary — no local uploads
8. Soft-delete only — never hard-delete records
9. Prisma imports from `@/lib/generated/prisma/client` (NOT `@prisma/client`)

## Key Specs

- Design spec: `docs/superpowers/specs/2026-03-23-club-m-platform-design.md`
- Plan 1 (Foundation): `docs/superpowers/plans/2026-03-23-plan-1-foundation.md`

## Test Accounts (dev)

- Admin: `admin@clubm.cd` / `admin123`
- Free member: `free@clubm.cd` / `member123`
- Premium member: `premium@clubm.cd` / `member123`
- Business member: `business@clubm.cd` / `member123`
- Customer: `client@example.com` / `customer123`
