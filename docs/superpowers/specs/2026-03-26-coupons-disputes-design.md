# Coupons + Disputes — Spec

**Date:** 2026-03-26
**Status:** Approved
**Scope:** Chantiers #17 (coupons/réductions) et #18 (gestion litiges) du NEXT_STEPS.md

---

## Goal

Add seller-managed discount coupons (percentage or fixed amount) applied at checkout, and a buyer-initiated dispute system with seller response and admin resolution.

## Decisions

- Coupons created by sellers for their own boutique only (no platform-wide coupons for MVP)
- Two coupon types: PERCENTAGE and FIXED_AMOUNT
- Only buyers can open disputes, after shipment (SHIPPED or DELIVERED), within 14 days
- Sellers can respond to disputes but cannot initiate them
- Admin resolves disputes with 3 options: in favor of buyer, in favor of seller, or close

## Data Models

### Coupon (new)

```prisma
enum CouponType {
  PERCENTAGE
  FIXED_AMOUNT
}

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

### Dispute (new)

```prisma
enum DisputeStatus {
  OPEN
  SELLER_RESPONDED
  RESOLVED_BUYER
  RESOLVED_SELLER
  CLOSED
}

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

### Changes to Order

```prisma
  couponId  String?
  coupon    Coupon?   @relation(fields: [couponId], references: [id])
  discount  Decimal   @default(0)
  dispute   Dispute?
```

### Changes to existing models

- BusinessProfile: add `coupons Coupon[]`
- Member: add `disputes Dispute[]`

### NotificationType additions

```prisma
  DISPUTE_OPENED
  DISPUTE_SELLER_RESPONDED
  DISPUTE_RESOLVED
```

## Coupon Logic

### Validation (at checkout)

A coupon is valid when ALL conditions are met:
1. Code exists and belongs to the cart's boutique (businessId match)
2. `isActive === true`
3. `startsAt` is null or in the past
4. `expiresAt` is null or in the future
5. `maxUses` is null or `usedCount < maxUses`
6. If FIXED_AMOUNT: coupon currency matches cart currency
7. `minOrderAmount` is null or cart total >= minOrderAmount

### Discount calculation

- PERCENTAGE: `discount = totalAmount * (value / 100)` — capped at totalAmount
- FIXED_AMOUNT: `discount = value` — capped at totalAmount

### Application (in createCartOrder)

- After computing totalAmount, subtract discount
- Store couponId and discount on Order
- Increment coupon.usedCount
- Commission (10%) is calculated on the discounted total

### Code normalization

Coupon codes are stored and compared as uppercase trimmed: `code.trim().toUpperCase()`

## Dispute Logic

### Opening conditions

- Order status is SHIPPED or DELIVERED
- No existing dispute on the order
- Order createdAt is within 14 days

### Reason options (predefined)

- "Produit non reçu"
- "Produit non conforme"
- "Produit endommagé"
- "Autre"

### Flow

1. Buyer opens dispute → status: OPEN → notification to seller (DISPUTE_OPENED)
2. Seller responds → status: SELLER_RESPONDED → notification to buyer
3. Admin resolves:
   - "En faveur de l'acheteur" → status: RESOLVED_BUYER → notification to both
   - "En faveur de la vendeuse" → status: RESOLVED_SELLER → notification to both
   - "Fermer" → status: CLOSED → notification to both

## Domain Structure

### New domain: `domains/coupons/`

- `validators.ts` — createCouponSchema, updateCouponSchema, applyCouponSchema
- `queries.ts` — getCouponsForBusiness, getCouponByCode, validateCoupon
- `actions.ts` — createCoupon, updateCoupon, toggleCoupon, applyCoupon (validation only, actual application in order action)

### New domain: `domains/disputes/`

- `validators.ts` — createDisputeSchema, respondDisputeSchema, resolveDisputeSchema
- `queries.ts` — getDisputeByOrder, getDisputesForMember, getOpenDisputes (admin)
- `actions.ts` — openDispute, respondToDispute, resolveDispute

## Pages

### New pages

- `app/(member)/mon-business/coupons/page.tsx` — seller coupon list
- `app/(member)/mon-business/coupons/nouveau/page.tsx` — create coupon form
- `app/(admin)/admin/litiges/page.tsx` — admin dispute list + resolution

### Modified pages

- `app/(site)/checkout/page.tsx` — add coupon code input + discount display
- `app/(member)/achats/[id]/page.tsx` — add "Signaler un problème" button + dispute status
- `app/(member)/mon-business/commandes/[id]/page.tsx` — dispute badge + response form
- `components/member/member-sidebar.tsx` — add "Coupons" link for business users
- `components/admin/admin-sidebar.tsx` — add "Litiges" link

## Components

### New components

- `components/business/coupon-form.tsx` — create/edit coupon form (client)
- `components/orders/coupon-input.tsx` — coupon code input for checkout (client)
- `components/orders/dispute-form.tsx` — open dispute form (client)
- `components/orders/dispute-status.tsx` — dispute timeline/status display
- `components/admin/dispute-resolution-actions.tsx` — admin resolve buttons (client)

## Out of Scope

- Platform-wide coupons (admin-created)
- Automatic refunds on dispute resolution (manual process)
- Coupon stacking (only 1 coupon per order)
- Coupon analytics dashboard
- Dispute evidence/file uploads
