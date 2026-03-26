# Automated Tests — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Vitest unit tests for the 5 most critical server action domains (orders, members, auth, reviews, coupons) with mocked Prisma DB and auth guards.

**Architecture:** Vitest with path alias resolution via tsconfig, global mock setup for `@/lib/db` and `@/lib/auth-guards`, each test file mocks DB responses and verifies action behavior (validation, guards, business logic, return values).

**Tech Stack:** Vitest, TypeScript, mocked Prisma client

**Spec:** `docs/superpowers/specs/2026-03-26-automated-tests-design.md`

---

## File Structure

### New files
```
vitest.config.ts                          — Vitest configuration with path aliases
__tests__/setup.ts                        — Global mock setup (db, auth guards)
__tests__/helpers.ts                      — Test helpers (mock user/member factories)
__tests__/domains/orders/actions.test.ts  — Order action tests
__tests__/domains/members/actions.test.ts — Member action tests
__tests__/domains/auth/actions.test.ts    — Auth action tests
__tests__/domains/reviews/actions.test.ts — Review action tests
__tests__/domains/coupons/actions.test.ts — Coupon action tests
```

### Modified files
```
package.json                              — Add vitest dependency + test script
```

---

## Task 1: Vitest setup + mock infrastructure

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `__tests__/setup.ts`
- Create: `__tests__/helpers.ts`

- [ ] **Step 1: Install Vitest**

```bash
npm install -D vitest
```

- [ ] **Step 2: Add test script to package.json**

Add to "scripts":
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Create vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./__tests__/setup.ts'],
    include: ['__tests__/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
```

- [ ] **Step 4: Create global mock setup**

Create `__tests__/setup.ts`:

```typescript
import { vi } from 'vitest'

// Mock the database
vi.mock('@/lib/db', () => ({
  db: {
    user: { findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
    member: { findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn() },
    order: { findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn(), count: vi.fn() },
    orderItem: { create: vi.fn(), createMany: vi.fn() },
    orderStatusHistory: { create: vi.fn() },
    product: { findUnique: vi.fn(), findMany: vi.fn(), update: vi.fn() },
    productVariant: { findUnique: vi.fn(), findMany: vi.fn(), update: vi.fn() },
    payment: { create: vi.fn() },
    review: { findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn(), aggregate: vi.fn() },
    coupon: { findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn() },
    dispute: { findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn() },
    notification: { create: vi.fn() },
    auditLog: { create: vi.fn() },
    businessProfile: { findUnique: vi.fn() },
    passwordResetToken: { findFirst: vi.fn(), create: vi.fn(), update: vi.fn(), updateMany: vi.fn() },
    emailVerificationToken: { create: vi.fn() },
    $transaction: vi.fn((fn: (tx: unknown) => Promise<unknown>) => fn({
      order: { create: vi.fn(), update: vi.fn() },
      product: { update: vi.fn() },
      productVariant: { update: vi.fn() },
      payment: { create: vi.fn() },
      coupon: { update: vi.fn() },
    })),
  },
}))

// Mock auth guards
vi.mock('@/lib/auth-guards', () => ({
  requireAuth: vi.fn(),
  requireMember: vi.fn(),
  requireVerifiedMember: vi.fn(),
  requireAdmin: vi.fn(),
  requireOwnership: vi.fn(),
  requireVerifiedEmail: vi.fn(),
}))

// Mock auth (NextAuth)
vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}))

// Mock next/headers
vi.mock('next/headers', () => ({
  headers: vi.fn(() => new Map([['x-forwarded-for', '127.0.0.1']])),
  cookies: vi.fn(() => ({ get: vi.fn(), set: vi.fn() })),
}))

// Mock next/cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}))

// Mock email sending
vi.mock('@/lib/email', () => ({
  sendEmail: vi.fn(),
  sendWelcomeEmail: vi.fn(),
  sendOrderConfirmationBuyer: vi.fn(),
  sendOrderNotificationSeller: vi.fn(),
  sendOrderShippedEmail: vi.fn(),
  sendDeliveryConfirmationBuyer: vi.fn(),
  sendDeliveryConfirmationSeller: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  sendKycSubmittedAdminEmail: vi.fn(),
  sendKycApprovedEmail: vi.fn(),
  sendKycRejectedEmail: vi.fn(),
  sendProfileApprovedEmail: vi.fn(),
  sendProfileRejectedEmail: vi.fn(),
  sendTicketConfirmationEmail: vi.fn(),
}))

// Mock notifications
vi.mock('@/domains/notifications/actions', () => ({
  createNotification: vi.fn(),
}))

// Mock rate limiting (allow all by default)
vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn(() => ({ success: true, remaining: 10 })),
  getClientIp: vi.fn(() => Promise.resolve('127.0.0.1')),
}))
```

- [ ] **Step 5: Create test helpers**

Create `__tests__/helpers.ts`:

```typescript
export function mockUser(overrides = {}) {
  return {
    id: 'user-1',
    email: 'test@clubm.cd',
    passwordHash: '$2b$10$hashedpassword',
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    member: mockMember(),
    customer: null,
    adminAccount: null,
    ...overrides,
  }
}

export function mockMember(overrides = {}) {
  return {
    id: 'member-1',
    userId: 'user-1',
    firstName: 'Test',
    lastName: 'User',
    phone: '+243123456789',
    bio: 'Test bio',
    avatar: null,
    tier: 'FREE' as const,
    status: 'ACTIVE' as const,
    verificationStatus: 'DECLARED' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

export function mockBusinessMember(overrides = {}) {
  return mockMember({ tier: 'BUSINESS', ...overrides })
}

export function mockProduct(overrides = {}) {
  return {
    id: 'product-1',
    businessId: 'business-1',
    name: 'Test Product',
    description: 'A test product',
    price: { toNumber: () => 100 } as unknown,
    currency: 'USD' as const,
    images: [],
    type: 'PHYSICAL' as const,
    categoryId: null,
    isActive: true,
    stock: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

export function mockOrder(overrides = {}) {
  return {
    id: 'order-1',
    memberId: 'member-1',
    customerId: null,
    businessId: 'business-1',
    totalAmount: { toNumber: () => 100 } as unknown,
    commission: { toNumber: () => 10 } as unknown,
    discount: { toNumber: () => 0 } as unknown,
    currency: 'USD' as const,
    confirmationCode: 'ABC123',
    codeExpiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    codeUsed: false,
    status: 'PAID' as const,
    shippedAt: null,
    deliveredAt: null,
    couponId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    items: [],
    ...overrides,
  }
}

export function mockCoupon(overrides = {}) {
  return {
    id: 'coupon-1',
    businessId: 'business-1',
    code: 'TEST10',
    type: 'PERCENTAGE' as const,
    value: { toNumber: () => 10 } as unknown,
    currency: null,
    minOrderAmount: null,
    maxUses: null,
    usedCount: 0,
    startsAt: null,
    expiresAt: null,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

export function mockReview(overrides = {}) {
  return {
    id: 'review-1',
    orderId: 'order-1',
    memberId: 'member-1',
    productId: 'product-1',
    rating: 4,
    comment: 'Great product',
    flagged: false,
    flagReason: null,
    visible: true,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}
```

- [ ] **Step 6: Verify setup compiles**

Run: `npx vitest run --passWithNoTests`

- [ ] **Step 7: Commit**

```bash
git add vitest.config.ts __tests__/setup.ts __tests__/helpers.ts package.json package-lock.json
git commit -m "feat: add Vitest setup with mock infrastructure

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Order action tests

**Files:**
- Create: `__tests__/domains/orders/actions.test.ts`

- [ ] **Step 1: Write order tests**

Test the critical order server actions. For each test:
1. Mock the auth guard return value
2. Mock the DB responses
3. Call the action
4. Assert the return value

Key tests:
- `createCartOrder` with valid input → returns success
- `createCartOrder` with empty items → returns validation error
- `createCartOrder` with coupon → applies discount correctly
- `markAsShipped` with valid owner → returns success
- `markAsShipped` with wrong owner → returns error
- `confirmDelivery` with valid code → returns success
- `confirmDelivery` with expired code → returns error
- `confirmDelivery` with wrong code → returns error

NOTE: The `createCartOrder` and `purchaseProduct` functions use `db.$transaction`. The mock $transaction in setup.ts passes a mock tx object to the callback. The test needs to ensure the callback's tx methods are properly mocked. This may require per-test setup of the $transaction mock.

Read `domains/orders/actions.ts` first to understand the exact flow and what DB calls are made.

- [ ] **Step 2: Run tests**

```bash
npx vitest run __tests__/domains/orders/actions.test.ts
```

- [ ] **Step 3: Commit**

```bash
git add __tests__/domains/orders/actions.test.ts
git commit -m "test: add order action tests

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Member action tests

**Files:**
- Create: `__tests__/domains/members/actions.test.ts`

- [ ] **Step 1: Write member tests**

Key tests:
- `registerMember` with valid input → creates user + member, returns success
- `registerMember` with duplicate email → returns error
- `registerMember` with invalid email → returns validation error
- `registerMember` with rate limit exceeded → returns RATE_LIMITED

Mock `bcrypt` or the password hashing if needed. Read `domains/members/actions.ts` to understand what needs mocking.

- [ ] **Step 2: Run tests**

```bash
npx vitest run __tests__/domains/members/actions.test.ts
```

- [ ] **Step 3: Commit**

```bash
git add __tests__/domains/members/actions.test.ts
git commit -m "test: add member action tests

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Auth action tests

**Files:**
- Create: `__tests__/domains/auth/actions.test.ts`

- [ ] **Step 1: Write auth tests**

Key tests:
- `requestPasswordReset` with valid email → creates token, returns success
- `requestPasswordReset` with unknown email → returns success (don't reveal if email exists)
- `requestPasswordReset` with rate limit → returns error
- `resetPassword` with valid token → updates password, returns success
- `resetPassword` with expired token → returns error
- `resetPassword` with invalid token → returns error

Read `domains/auth/actions.ts` to understand the exact flow.

- [ ] **Step 2: Run tests**

```bash
npx vitest run __tests__/domains/auth/actions.test.ts
```

- [ ] **Step 3: Commit**

```bash
git add __tests__/domains/auth/actions.test.ts
git commit -m "test: add auth action tests

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Review action tests

**Files:**
- Create: `__tests__/domains/reviews/actions.test.ts`

- [ ] **Step 1: Write review tests**

Key tests:
- `createReview` with valid input (DELIVERED order, no existing review) → creates review, returns success
- `createReview` on non-DELIVERED order → returns error
- `createReview` with existing review → returns ALREADY_REVIEWED
- `createReview` on someone else's order → returns NOT_FOUND
- `flagReview` by product owner → sets flagged=true
- `flagReview` by non-owner → returns NOT_AUTHORIZED
- `moderateReview` MAINTAIN → sets visible=true, flagged=false
- `moderateReview` HIDE → sets visible=false, notifies reviewer

Read `domains/reviews/actions.ts` first.

- [ ] **Step 2: Run tests**

```bash
npx vitest run __tests__/domains/reviews/actions.test.ts
```

- [ ] **Step 3: Commit**

```bash
git add __tests__/domains/reviews/actions.test.ts
git commit -m "test: add review action tests

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Coupon action + validation tests

**Files:**
- Create: `__tests__/domains/coupons/actions.test.ts`

- [ ] **Step 1: Write coupon tests**

Key tests:
- `createCoupon` with valid input → normalizes code to uppercase, creates coupon
- `createCoupon` with duplicate code → returns error
- `toggleCoupon` by owner → toggles isActive
- `toggleCoupon` by non-owner → returns error
- `validateCoupon` with valid coupon → returns { valid: true, discount }
- `validateCoupon` with expired coupon → returns { valid: false }
- `validateCoupon` with exhausted uses → returns { valid: false }
- `validateCoupon` with wrong currency (FIXED_AMOUNT) → returns { valid: false }
- `validateCoupon` below min order amount → returns { valid: false }
- `validateCoupon` PERCENTAGE discount calculation is correct
- `validateCoupon` FIXED_AMOUNT discount capped at total

Read `domains/coupons/actions.ts` and `domains/coupons/queries.ts` (validateCoupon is in queries).

- [ ] **Step 2: Run tests**

```bash
npx vitest run __tests__/domains/coupons/actions.test.ts
```

- [ ] **Step 3: Commit**

```bash
git add __tests__/domains/coupons/actions.test.ts
git commit -m "test: add coupon action and validation tests

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Run all tests + final verification

- [ ] **Step 1: Run all tests**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 2: Fix any failures**

If tests fail, debug and fix. Common issues:
- Mock not returning the right shape
- Async/await issues
- Prisma Decimal mocking

- [ ] **Step 3: Update continuity files**

Update `SESSION_LOG.md`.

- [ ] **Step 4: Commit**

```bash
git add SESSION_LOG.md
git commit -m "docs: update continuity after automated tests

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```
