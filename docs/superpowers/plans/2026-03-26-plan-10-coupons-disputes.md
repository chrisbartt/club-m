# Coupons + Disputes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add seller-managed discount coupons applied at checkout and buyer-initiated dispute system with seller response and admin resolution.

**Architecture:** 2 new Prisma models (Coupon, Dispute) with enums, 2 new domains (coupons, disputes), coupon validation + discount in checkout flow, dispute lifecycle (open → respond → resolve) with notifications.

**Tech Stack:** Next.js 16, Prisma 7, Zod 4, Tailwind CSS 4, shadcn/ui

**Spec:** `docs/superpowers/specs/2026-03-26-coupons-disputes-design.md`

---

## File Structure

### New files
```
domains/coupons/validators.ts           — Zod schemas for coupon CRUD + apply
domains/coupons/queries.ts              — getCouponsForBusiness, validateCoupon
domains/coupons/actions.ts              — createCoupon, updateCoupon, toggleCoupon
domains/disputes/validators.ts          — Zod schemas for dispute open/respond/resolve
domains/disputes/queries.ts             — getDisputeByOrder, getOpenDisputes
domains/disputes/actions.ts             — openDispute, respondToDispute, resolveDispute
components/business/coupon-form.tsx     — Create/edit coupon form (client)
components/orders/coupon-input.tsx      — Coupon code input for checkout (client)
components/orders/dispute-form.tsx      — Open dispute form (client)
components/orders/dispute-status.tsx    — Dispute status display + seller response
components/admin/dispute-resolution-actions.tsx — Admin resolve buttons (client)
app/(member)/mon-business/coupons/page.tsx      — Seller coupon list
app/(member)/mon-business/coupons/nouveau/page.tsx — Create coupon page
app/(admin)/admin/litiges/page.tsx      — Admin disputes list + resolution
```

### Modified files
```
prisma/schema.prisma                    — Add Coupon, Dispute models + enums, update Order/BusinessProfile/Member
domains/orders/actions.ts               — Coupon validation + discount in createCartOrder
app/(site)/checkout/page.tsx            — Add coupon code input + discount display
app/(member)/achats/[id]/page.tsx       — Add dispute button + status
app/(member)/mon-business/commandes/[id]/page.tsx — Add dispute badge + response
components/member/member-sidebar.tsx    — Add Coupons link
components/admin/admin-sidebar.tsx      — Add Litiges link
```

---

## Task 1: Prisma schema — Coupon + Dispute models

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add CouponType and DisputeStatus enums**

```prisma
enum CouponType {
  PERCENTAGE
  FIXED_AMOUNT
}

enum DisputeStatus {
  OPEN
  SELLER_RESPONDED
  RESOLVED_BUYER
  RESOLVED_SELLER
  CLOSED
}
```

- [ ] **Step 2: Add Coupon model**

```prisma
model Coupon {
  id             String      @id @default(cuid())
  businessId     String
  business       BusinessProfile @relation(fields: [businessId], references: [id])
  code           String
  type           CouponType
  value          Decimal
  currency       Currency?
  minOrderAmount Decimal?
  maxUses        Int?
  usedCount      Int         @default(0)
  startsAt       DateTime?
  expiresAt      DateTime?
  isActive       Boolean     @default(true)
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt

  orders         Order[]

  @@unique([businessId, code])
  @@index([businessId, isActive])
}
```

- [ ] **Step 3: Add Dispute model**

```prisma
model Dispute {
  id              String        @id @default(cuid())
  orderId         String        @unique
  order           Order         @relation(fields: [orderId], references: [id])
  memberId        String
  member          Member        @relation(fields: [memberId], references: [id])
  reason          String
  description     String
  sellerResponse  String?
  adminNote       String?
  status          DisputeStatus @default(OPEN)
  resolution      String?
  deletedAt       DateTime?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@index([status])
  @@index([memberId])
}
```

- [ ] **Step 4: Update Order model**

Add:
```prisma
  couponId  String?
  coupon    Coupon?   @relation(fields: [couponId], references: [id])
  discount  Decimal   @default(0)
  dispute   Dispute?
```

- [ ] **Step 5: Update BusinessProfile model**

Add: `coupons Coupon[]`

- [ ] **Step 6: Update Member model**

Add: `disputes Dispute[]`

- [ ] **Step 7: Extend NotificationType enum**

Add:
```prisma
  DISPUTE_OPENED
  DISPUTE_SELLER_RESPONDED
  DISPUTE_RESOLVED
```

- [ ] **Step 8: Push and generate**

```bash
npx prisma db push
npx prisma generate
```

- [ ] **Step 9: Verify and commit**

```bash
npx tsc --noEmit --skipLibCheck
git add prisma/
git commit -m "feat: add Coupon and Dispute models with enums

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Coupons domain (validators, queries, actions)

**Files:**
- Create: `domains/coupons/validators.ts`
- Create: `domains/coupons/queries.ts`
- Create: `domains/coupons/actions.ts`

- [ ] **Step 1: Create validators**

Schemas:
- `createCouponSchema`: code (string min 1 max 20), type (enum PERCENTAGE/FIXED_AMOUNT), value (number min 0), currency (optional enum), minOrderAmount (optional number min 0), maxUses (optional int min 1), startsAt (optional date string), expiresAt (optional date string)
- `updateCouponSchema`: id + same fields as create
- `applyCouponSchema`: code (string), businessId (string)

Check existing validators for Zod 4 patterns.

- [ ] **Step 2: Create queries**

- `getCouponsForBusiness(businessId)` — all coupons for a business, ordered by createdAt desc
- `validateCoupon(code, businessId, cartTotal, cartCurrency)` — returns `{ valid: true, coupon }` or `{ valid: false, error: string }`. Checks: exists, businessId match, isActive, dates, usedCount < maxUses, currency match for FIXED_AMOUNT, minOrderAmount

- [ ] **Step 3: Create actions**

- `createCoupon(input)` — requireMember('BUSINESS'), validate, normalize code (trim + uppercase), create
- `updateCoupon(input)` — requireMember('BUSINESS'), validate ownership, update
- `toggleCoupon(couponId)` — requireMember('BUSINESS'), validate ownership, toggle isActive

All follow project pattern. Code normalization: `code.trim().toUpperCase()`

- [ ] **Step 4: Verify and commit**

```bash
npx tsc --noEmit --skipLibCheck
git add domains/coupons/
git commit -m "feat: add coupons domain with queries, actions, validators

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Disputes domain (validators, queries, actions)

**Files:**
- Create: `domains/disputes/validators.ts`
- Create: `domains/disputes/queries.ts`
- Create: `domains/disputes/actions.ts`

- [ ] **Step 1: Create validators**

- `openDisputeSchema`: orderId (string), reason (string — one of "Produit non reçu", "Produit non conforme", "Produit endommagé", "Autre"), description (string min 10 max 2000)
- `respondDisputeSchema`: disputeId (string), response (string min 10 max 2000)
- `resolveDisputeSchema`: disputeId (string), decision (enum "RESOLVED_BUYER" / "RESOLVED_SELLER" / "CLOSED"), adminNote (optional string)

- [ ] **Step 2: Create queries**

- `getDisputeByOrder(orderId)` — single dispute for an order, include member + order.business
- `getDisputesForBuyer(memberId)` — buyer's disputes
- `getOpenDisputes()` — all non-CLOSED disputes for admin, include member, order (with business, items)

- [ ] **Step 3: Create actions**

**openDispute(input):**
- requireAuth()
- Validate input
- Fetch order, check: belongs to user, status is SHIPPED or DELIVERED, no existing dispute, within 14 days of createdAt
- Create dispute with status OPEN
- Notify seller (DISPUTE_OPENED)

**respondToDispute(input):**
- requireMember('BUSINESS')
- Validate input
- Fetch dispute with order, check: order.businessId matches seller's profile
- Update dispute: sellerResponse, status → SELLER_RESPONDED
- Notify buyer (DISPUTE_SELLER_RESPONDED)

**resolveDispute(input):**
- requireAdmin()
- Validate input
- Update dispute: status → decision, adminNote, resolution text
- Notify both buyer and seller (DISPUTE_RESOLVED)

- [ ] **Step 4: Verify and commit**

```bash
npx tsc --noEmit --skipLibCheck
git add domains/disputes/
git commit -m "feat: add disputes domain with queries, actions, validators

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Seller coupon management pages

**Files:**
- Create: `components/business/coupon-form.tsx`
- Create: `app/(member)/mon-business/coupons/page.tsx`
- Create: `app/(member)/mon-business/coupons/nouveau/page.tsx`
- Modify: `components/member/member-sidebar.tsx`

- [ ] **Step 1: Create CouponForm client component**

Form with fields: code, type (select PERCENTAGE/FIXED_AMOUNT), value, currency (shown only for FIXED_AMOUNT), minOrderAmount, maxUses, startsAt, expiresAt. Submit calls createCoupon or updateCoupon.

- [ ] **Step 2: Create coupons list page**

Server component showing seller's coupons with: code, type, value, used/max, status (active/expired/exhausted), toggle button, link to edit.

- [ ] **Step 3: Create new coupon page**

Simple page wrapping CouponForm in create mode.

- [ ] **Step 4: Add Coupons link to member sidebar**

In the business links section (after Revenus), add:
```typescript
{ href: '/mon-business/coupons', label: 'Coupons', icon: Ticket },
```
Add `Ticket` to lucide-react imports.

- [ ] **Step 5: Verify and commit**

```bash
npx tsc --noEmit --skipLibCheck
git add components/business/coupon-form.tsx "app/(member)/mon-business/coupons/" components/member/member-sidebar.tsx
git commit -m "feat: add seller coupon management pages

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Coupon application at checkout

**Files:**
- Create: `components/orders/coupon-input.tsx`
- Modify: `app/(site)/checkout/page.tsx`
- Modify: `domains/orders/actions.ts`

- [ ] **Step 1: Create CouponInput client component**

A text input with "Appliquer" button. On click:
- Calls validateCoupon query (via a server action wrapper)
- Shows success (green text with discount amount) or error (red text with reason)
- Exposes the validated coupon code and discount amount to the parent

Props: `businessId`, `cartTotal`, `cartCurrency`, `onApply(couponCode, discount)`, `onRemove()`

- [ ] **Step 2: Update checkout page**

Read `app/(site)/checkout/page.tsx`. Add CouponInput component in the order summary section. When a coupon is applied:
- Show discount line in the summary (ex: "Reduction (GRACE10) : -5 000 FC")
- Update the displayed total
- Pass couponCode to the createCartOrder call

- [ ] **Step 3: Update createCartOrder in order actions**

Read `domains/orders/actions.ts`, find createCartOrder.

Add coupon handling:
1. Accept optional `couponCode` in the input
2. If couponCode is provided, validate the coupon (re-validate server-side)
3. Calculate discount: PERCENTAGE → `totalAmount * (value / 100)`, FIXED_AMOUNT → `value`. Cap at totalAmount.
4. Compute `finalAmount = totalAmount - discount`
5. Commission is calculated on `finalAmount` (discounted total)
6. Store `couponId` and `discount` on the Order
7. Increment `coupon.usedCount`

Update the order validator to accept optional `couponCode: z.string().optional()`.

- [ ] **Step 4: Verify and commit**

```bash
npx tsc --noEmit --skipLibCheck
git add components/orders/coupon-input.tsx "app/(site)/checkout/page.tsx" domains/orders/actions.ts domains/orders/validators.ts
git commit -m "feat: apply coupon discount at checkout

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Dispute UI — buyer side

**Files:**
- Create: `components/orders/dispute-form.tsx`
- Create: `components/orders/dispute-status.tsx`
- Modify: `app/(member)/achats/[id]/page.tsx`

- [ ] **Step 1: Create DisputeForm client component**

Form with: reason (select with predefined options), description (textarea min 10 chars), submit button. Calls openDispute action.

Reason options: "Produit non reçu", "Produit non conforme", "Produit endommagé", "Autre"

- [ ] **Step 2: Create DisputeStatus component**

Displays the current state of a dispute:
- OPEN: "Litige ouvert — en attente de la vendeuse"
- SELLER_RESPONDED: shows seller response + "En attente de resolution admin"
- RESOLVED_BUYER: "Resolu en votre faveur" (green)
- RESOLVED_SELLER: "Resolu en faveur de la vendeuse"
- CLOSED: "Litige ferme"

Shows: reason, description, seller response (if any), admin resolution (if any)

- [ ] **Step 3: Update buyer order detail page**

Read `app/(member)/achats/[id]/page.tsx`.

Fetch dispute: `const dispute = await getDisputeByOrder(order.id)`

Add dispute section after the timeline:
- If no dispute AND order is SHIPPED/DELIVERED AND within 14 days → show DisputeForm
- If dispute exists → show DisputeStatus

- [ ] **Step 4: Verify and commit**

```bash
npx tsc --noEmit --skipLibCheck
git add components/orders/dispute-form.tsx components/orders/dispute-status.tsx "app/(member)/achats/[id]/page.tsx"
git commit -m "feat: add dispute form and status to buyer order detail

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Dispute UI — seller side

**Files:**
- Modify: `app/(member)/mon-business/commandes/[id]/page.tsx`

- [ ] **Step 1: Read the file**

- [ ] **Step 2: Add dispute display + response form**

Fetch dispute: `const dispute = await getDisputeByOrder(order.id)`

If a dispute exists, show a card with:
- Alert badge (orange/red) indicating open dispute
- Dispute reason and description from buyer
- If status is OPEN: show a response form (textarea + submit calling respondToDispute)
- If status is SELLER_RESPONDED: show "Votre reponse" + the response text + "En attente de resolution"
- If resolved: show resolution

Create the seller response as inline client component or a small separate component.

- [ ] **Step 3: Verify and commit**

```bash
npx tsc --noEmit --skipLibCheck
git add "app/(member)/mon-business/commandes/[id]/page.tsx"
git commit -m "feat: add dispute display and response to seller order detail

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: Admin disputes page

**Files:**
- Create: `components/admin/dispute-resolution-actions.tsx`
- Create: `app/(admin)/admin/litiges/page.tsx`
- Modify: `components/admin/admin-sidebar.tsx`

- [ ] **Step 1: Create DisputeResolutionActions client component**

Three buttons: "Faveur acheteur", "Faveur vendeuse", "Fermer". Optional admin note textarea. Calls resolveDispute action.

- [ ] **Step 2: Create admin disputes page**

Server component:
- requireAdmin()
- Fetch open disputes via getOpenDisputes()
- List with: order ID, buyer name, seller/business name, reason, status, date
- Each dispute expandable or linked to detail showing: description, seller response, resolution actions

- [ ] **Step 3: Add Litiges link to admin sidebar**

After Avis:
```typescript
{ href: '/admin/litiges', label: 'Litiges', icon: AlertTriangle },
```
Add `AlertTriangle` to lucide-react imports.

- [ ] **Step 4: Verify and commit**

```bash
npx tsc --noEmit --skipLibCheck
git add components/admin/dispute-resolution-actions.tsx "app/(admin)/admin/litiges/page.tsx" components/admin/admin-sidebar.tsx
git commit -m "feat: add admin disputes resolution page

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: Final verification + continuity

- [ ] **Step 1: TypeScript check**

Run: `npx tsc --noEmit --skipLibCheck`

Expected: 0 errors.

- [ ] **Step 2: Update continuity files**

Update `SESSION_LOG.md` and `PROJECT_STATE.md`.

- [ ] **Step 3: Commit**

```bash
git add SESSION_LOG.md PROJECT_STATE.md
git commit -m "docs: update continuity files after coupons + disputes implementation

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```
