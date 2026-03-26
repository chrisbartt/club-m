# Automated Tests — Spec

**Date:** 2026-03-26
**Status:** Approved
**Scope:** Chantier #23 du NEXT_STEPS.md — tests unitaires server actions

---

## Goal

Add unit tests for the 5 most critical domains using Vitest with mocked Prisma DB.

## Approach

- **Framework:** Vitest (ESM native, fast, Next.js compatible)
- **Strategy:** Unit tests on server actions with mocked DB (no real database)
- **Mock:** Prisma client mocked via `vitest.mock('@/lib/db')` — each test controls what the DB returns
- **Auth mocks:** Mock `requireAuth`, `requireMember`, `requireAdmin` to simulate authenticated users

## Domains to test (5)

### 1. Orders (highest risk)
- `createCartOrder` — validates items, computes total, applies coupon discount, creates order, decrements stock
- `purchaseProduct` — single product purchase, variant handling, stock check
- `markAsShipped` — status transition PAID → SHIPPED, ownership check
- `confirmDelivery` — code validation, expiry check, status transition

### 2. Members
- `registerMember` — validation, duplicate email check, user + member creation
- Rate limiting behavior

### 3. Auth
- `requestPasswordReset` — email validation, token creation, cooldown check
- `resetPassword` — token validation, expiry, password update

### 4. Reviews
- `createReview` — ownership check, DELIVERED status check, duplicate check, notification
- `flagReview` — ownership check (seller), status update
- `moderateReview` — admin guard, visibility toggle

### 5. Coupons
- `createCoupon` — validation, code normalization (uppercase), ownership
- `validateCoupon` — all validation rules (active, dates, usage limit, currency, min amount)
- `toggleCoupon` — ownership check, toggle

## Test structure

```
__tests__/
  domains/
    orders/actions.test.ts
    members/actions.test.ts
    auth/actions.test.ts
    reviews/actions.test.ts
    coupons/actions.test.ts
  setup.ts                    — global mock setup
```

## What we DON'T test

- UI components (no React Testing Library)
- E2E flows (no Playwright)
- Queries (simple Prisma wrappers, low risk)
- Validators (Zod handles this)
- Integrations (email, cloudinary — external services)
