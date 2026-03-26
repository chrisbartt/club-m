# Order Timeline + Review System — Spec

**Date:** 2026-03-26
**Status:** Approved
**Scope:** Chantiers #19 (timeline commande) et #16 (système d'avis) du NEXT_STEPS.md

---

## Goal

Add order status timeline (visible history of each order's lifecycle) and a product review system (1-5 stars, optional comment, post-delivery only, with seller flagging and admin moderation).

## Decisions

- Only the buyer who received a delivered order can leave a review (1 review per order max)
- Rating: 1-5 stars + optional text comment
- Reviews are published immediately. Seller can flag abusive reviews. Admin moderates flagged reviews only.
- Average rating is computed at query time (no denormalization for MVP)
- Each order status change creates an OrderStatusHistory entry automatically

## Data Models

### OrderStatusHistory (new)

```prisma
model OrderStatusHistory {
  id        String      @id @default(cuid())
  orderId   String
  order     Order       @relation(fields: [orderId], references: [id])
  status    OrderStatus
  note      String?
  createdAt DateTime    @default(now())

  @@index([orderId])
}
```

### Review (new)

```prisma
model Review {
  id         String    @id @default(cuid())
  orderId    String    @unique
  order      Order     @relation(fields: [orderId], references: [id])
  memberId   String
  member     Member    @relation(fields: [memberId], references: [id])
  productId  String
  product    Product   @relation(fields: [productId], references: [id])
  rating     Int
  comment    String?
  flagged    Boolean   @default(false)
  flagReason String?
  visible    Boolean   @default(true)
  deletedAt  DateTime?
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt

  @@index([productId])
  @@index([memberId])
}
```

### Changes to existing models

**Order:** add relations
```prisma
statusHistory OrderStatusHistory[]
review        Review?
```

**Product:** add relation
```prisma
reviews Review[]
```

**Member:** add relation
```prisma
reviews Review[]
```

## Domain Structure

### New domain: `domains/reviews/`

**queries.ts:**
- `getReviewsByProduct(productId, limit?)` — visible reviews for a product, ordered by createdAt desc, includes member firstName
- `getReviewByOrder(orderId)` — single review for an order (or null)
- `getAverageRating(productId)` — returns `{ average: number, count: number }`
- `getBusinessAverageRating(businessId)` — average across all products of a business
- `getFlaggedReviews()` — all flagged reviews for admin moderation, includes order/product/member info

**actions.ts:**
- `createReview(input)` — guard: requireAuth, validate: orderId + rating (1-5) + comment?. Check order belongs to user, status is DELIVERED, no existing review. Creates review + notification to seller.
- `flagReview(reviewId, reason)` — guard: requireMember('BUSINESS'). Check review is on one of seller's products. Sets flagged=true + flagReason.
- `moderateReview(reviewId, decision: 'MAINTAIN' | 'HIDE')` — guard: requireAdmin. Sets visible=true or false, sets flagged=false.

**validators.ts:**
- `createReviewSchema` — { orderId: string, rating: int min 1 max 5, comment?: string max 1000 }
- `flagReviewSchema` — { reviewId: string, reason: string min 10 max 500 }

### Extension: `domains/orders/`

**queries.ts — add:**
- `getOrderTimeline(orderId)` — returns OrderStatusHistory[] ordered by createdAt asc

**actions.ts — modify:**
- `createCartOrder` — after creating order, create OrderStatusHistory entry with status PAID
- `markAsShipped` — after updating order, create entry with status SHIPPED
- `confirmDelivery` — after updating order, create entry with status DELIVERED

Each entry is created with `db.orderStatusHistory.create({ data: { orderId, status } })` right after the order status update, inside the same try block. No transaction needed — if the history entry fails, log and continue (non-blocking).

## Components

### New components

| Component | Type | Location |
|-----------|------|----------|
| `OrderTimeline` | Server | `components/orders/order-timeline.tsx` |
| `ReviewForm` | Client | `components/orders/review-form.tsx` |
| `ReviewCard` | Server | `components/orders/review-card.tsx` |
| `StarRating` | Client | `components/orders/star-rating.tsx` |
| `StarDisplay` | Server | `components/orders/star-display.tsx` |
| `ReviewModerationActions` | Client | `components/admin/review-moderation-actions.tsx` |

**OrderTimeline:** Vertical timeline with status dots (colored by status), date, optional note. Accepts `timeline: OrderStatusHistory[]` prop.

**StarRating:** Interactive stars (1-5). Click to select. Filled stars = gold, empty = gray. Accepts `value` and `onChange` props.

**StarDisplay:** Read-only stars. Accepts `rating: number` (can be fractional for averages). Renders filled/half/empty stars.

**ReviewForm:** Contains StarRating + textarea + submit button. Calls `createReview` server action. Shows success toast on completion.

**ReviewCard:** Displays rating (StarDisplay), comment, reviewer first name, "il y a X jours" relative time.

**ReviewModerationActions:** Two buttons — "Maintenir visible" and "Masquer l'avis". Calls `moderateReview` server action.

## Pages

### Modified pages

**`app/(member)/achats/[id]/page.tsx`** — buyer order detail:
- Add `OrderTimeline` section
- Add review section: if order is DELIVERED and no review exists → show `ReviewForm`. If review exists → show `ReviewCard`.

**`app/(member)/mon-business/commandes/[id]/page.tsx`** — seller order detail:
- Add `OrderTimeline` section
- If a review exists on the order → show `ReviewCard` + "Signaler" button (if not already flagged). Signaler opens a dialog with reason input.

**`app/(site)/boutique/[slug]/produit/[id]/page.tsx`** — public product page:
- Add reviews section at bottom: average rating (StarDisplay + "X avis"), list of visible ReviewCards

**`app/(site)/boutique/[slug]/page.tsx`** — public boutique page:
- Show average rating next to business name (StarDisplay + count)

### New page

**`app/(admin)/admin/avis/page.tsx`** — flagged reviews moderation:
- List of flagged reviews with: product name, reviewer name, rating, comment, flag reason, ReviewModerationActions
- Add link in admin sidebar

## Notifications

- `createReview` → notification to seller: type `REVIEW_RECEIVED`, title "Nouvel avis", message "{rating} étoiles sur {productName}", link `/mon-business/commandes/{orderId}`
- `flagReview` → notification to admin (optional, not critical for MVP)
- `moderateReview` with HIDE → notification to reviewer: type `REVIEW_HIDDEN`, title "Avis masqué", message "Votre avis a été masqué suite à un signalement."

Add `REVIEW_RECEIVED` and `REVIEW_HIDDEN` to `NotificationType` enum.

## Out of Scope

- Review editing (write once)
- Review replies from seller
- Photo reviews
- Denormalized average rating (computed at query time)
- Sorting/filtering reviews by rating
- Review on services (only products with delivered orders)
