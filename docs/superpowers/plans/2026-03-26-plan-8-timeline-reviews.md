# Order Timeline + Review System — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add order status timeline (history of each order's lifecycle) and a product review system (1-5 stars, optional comment, post-delivery only, seller flagging, admin moderation).

**Architecture:** 2 new Prisma models (OrderStatusHistory, Review), a new `domains/reviews/` domain, timeline entries auto-created in existing order actions, review UI on buyer/seller/product pages, admin moderation page for flagged reviews.

**Tech Stack:** Next.js 16, Prisma 7, Zod 4, Tailwind CSS 4, shadcn/ui, lucide-react

**Spec:** `docs/superpowers/specs/2026-03-26-timeline-reviews-design.md`

---

## File Structure

### New files
```
domains/reviews/queries.ts              — getReviewsByProduct, getReviewByOrder, getAverageRating, getBusinessAverageRating, getFlaggedReviews
domains/reviews/actions.ts              — createReview, flagReview, moderateReview
domains/reviews/validators.ts           — Zod schemas for review create and flag
components/orders/order-timeline.tsx    — Vertical timeline display (server component)
components/orders/star-rating.tsx       — Interactive star selector (client component)
components/orders/star-display.tsx      — Read-only star display (server component)
components/orders/review-form.tsx       — Review submission form (client component)
components/orders/review-card.tsx       — Single review display (server component)
components/admin/review-moderation-actions.tsx — Maintain/hide buttons (client component)
app/(admin)/admin/avis/page.tsx         — Flagged reviews moderation page
```

### Modified files
```
prisma/schema.prisma                    — Add OrderStatusHistory + Review models, update Order/Product/Member relations, extend NotificationType enum
domains/orders/queries.ts               — Add getOrderTimeline query
domains/orders/actions.ts               — Add OrderStatusHistory creation in purchaseProduct, createCartOrder, markAsShipped, confirmDelivery
app/(member)/achats/[id]/page.tsx       — Add timeline + review form/display
app/(member)/mon-business/commandes/[id]/page.tsx — Add timeline + review display + flag button
app/(site)/boutique/[slug]/produit/[productId]/page.tsx — Add reviews section
app/(site)/boutique/[slug]/page.tsx     — Add average rating display
components/admin/admin-sidebar.tsx      — Add "Avis" link
```

---

## Task 1: Prisma schema — OrderStatusHistory + Review models

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add OrderStatusHistory model**

Add after the Order model (around line 416):

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

Add to the Order model (inside the model block):
```prisma
  statusHistory        OrderStatusHistory[]
```

- [ ] **Step 2: Add Review model**

Add after OrderStatusHistory:

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

Add relations to existing models:

In Order model: `review Review?`
In Product model: `reviews Review[]`
In Member model: `reviews Review[]`

- [ ] **Step 3: Extend NotificationType enum**

Add to the NotificationType enum:
```prisma
  REVIEW_RECEIVED
  REVIEW_HIDDEN
```

- [ ] **Step 4: Run migration**

Run: `npx prisma migrate dev --name add_timeline_and_reviews`

If migration fails due to DB drift, use `npx prisma db push` then resolve.

- [ ] **Step 5: Commit**

```bash
git add prisma/
git commit -m "feat: add OrderStatusHistory and Review models

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Order timeline — query + wire into actions

**Files:**
- Modify: `domains/orders/queries.ts`
- Modify: `domains/orders/actions.ts`

- [ ] **Step 1: Add getOrderTimeline query**

In `domains/orders/queries.ts`, add at the end:

```typescript
export async function getOrderTimeline(orderId: string) {
  return db.orderStatusHistory.findMany({
    where: { orderId },
    orderBy: { createdAt: 'asc' },
  })
}
```

- [ ] **Step 2: Wire OrderStatusHistory into purchaseProduct**

In `domains/orders/actions.ts`, in the `purchaseProduct` function, after the order is created (around line 101 where status is set to PAID), add:

```typescript
try {
  await db.orderStatusHistory.create({
    data: { orderId: order.id, status: 'PAID' },
  })
} catch (e) { console.error('Timeline entry failed:', e) }
```

Place this after the order creation but before the email/notification section.

- [ ] **Step 3: Wire into createCartOrder**

Same pattern in `createCartOrder`, after the order creation (around line 299):

```typescript
try {
  await db.orderStatusHistory.create({
    data: { orderId: order.id, status: 'PAID' },
  })
} catch (e) { console.error('Timeline entry failed:', e) }
```

- [ ] **Step 4: Wire into markAsShipped**

In `markAsShipped`, after the order update (around line 436):

```typescript
try {
  await db.orderStatusHistory.create({
    data: { orderId: order.id, status: 'SHIPPED' },
  })
} catch (e) { console.error('Timeline entry failed:', e) }
```

Note: use `order.id` — check the variable name used for the updated order in this function. It might be `updated.id` or similar. Read the function to confirm.

- [ ] **Step 5: Wire into confirmDelivery**

In `confirmDelivery`, after the order update (around line 537):

```typescript
try {
  await db.orderStatusHistory.create({
    data: { orderId: order.id, status: 'DELIVERED' },
  })
} catch (e) { console.error('Timeline entry failed:', e) }
```

Same note about variable name.

- [ ] **Step 6: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 7: Commit**

```bash
git add domains/orders/queries.ts domains/orders/actions.ts
git commit -m "feat: add order timeline query and wire status history into all actions

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: OrderTimeline component

**Files:**
- Create: `components/orders/order-timeline.tsx`

- [ ] **Step 1: Create the component**

Server component displaying a vertical timeline with colored dots per status.

```tsx
import { Package, CreditCard, Truck, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TimelineEntry {
  id: string
  status: string
  note: string | null
  createdAt: string
}

const STATUS_CONFIG: Record<string, { label: string; icon: typeof Package; color: string }> = {
  PENDING: { label: 'Commande creee', icon: Package, color: 'text-muted-foreground' },
  PAID: { label: 'Paiement confirme', icon: CreditCard, color: 'text-green-600' },
  SHIPPED: { label: 'Expediee', icon: Truck, color: 'text-blue-600' },
  DELIVERED: { label: 'Livree', icon: CheckCircle, color: 'text-green-600' },
}

interface OrderTimelineProps {
  timeline: TimelineEntry[]
}

export function OrderTimeline({ timeline }: OrderTimelineProps) {
  if (timeline.length === 0) return null

  return (
    <div className="space-y-0">
      {timeline.map((entry, index) => {
        const config = STATUS_CONFIG[entry.status] || STATUS_CONFIG.PENDING
        const Icon = config.icon
        const isLast = index === timeline.length - 1

        return (
          <div key={entry.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={cn('flex h-8 w-8 items-center justify-center rounded-full border-2', config.color)}>
                <Icon className="h-4 w-4" />
              </div>
              {!isLast && <div className="h-8 w-px bg-border" />}
            </div>
            <div className="pb-6">
              <p className="text-sm font-medium">{config.label}</p>
              {entry.note && (
                <p className="text-xs text-muted-foreground">{entry.note}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {new Date(entry.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 3: Commit**

```bash
git add components/orders/order-timeline.tsx
git commit -m "feat: add OrderTimeline component

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Star components (display + interactive)

**Files:**
- Create: `components/orders/star-display.tsx`
- Create: `components/orders/star-rating.tsx`

- [ ] **Step 1: Create StarDisplay (read-only)**

Server component for displaying a rating (supports fractional values for averages).

```tsx
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarDisplayProps {
  rating: number
  size?: 'sm' | 'md'
}

export function StarDisplay({ rating, size = 'sm' }: StarDisplayProps) {
  const sizeClass = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClass,
            star <= Math.round(rating)
              ? 'fill-amber-400 text-amber-400'
              : 'fill-muted text-muted'
          )}
        />
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Create StarRating (interactive)**

Client component for selecting a rating.

```tsx
'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  value: number
  onChange: (rating: number) => void
}

export function StarRating({ value, onChange }: StarRatingProps) {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="p-0.5"
        >
          <Star
            className={cn(
              'h-7 w-7 transition-colors',
              star <= (hover || value)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-muted text-muted hover:text-amber-300'
            )}
          />
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 4: Commit**

```bash
git add components/orders/star-display.tsx components/orders/star-rating.tsx
git commit -m "feat: add StarDisplay and StarRating components

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Reviews domain (validators, queries, actions)

**Files:**
- Create: `domains/reviews/validators.ts`
- Create: `domains/reviews/queries.ts`
- Create: `domains/reviews/actions.ts`

- [ ] **Step 1: Create validators**

```typescript
import { z } from 'zod/v4'

export const createReviewSchema = z.object({
  orderId: z.string().min(1),
  rating: z.int().min(1).max(5),
  comment: z.string().max(1000).optional(),
})

export const flagReviewSchema = z.object({
  reviewId: z.string().min(1),
  reason: z.string().min(10).max(500),
})
```

Note: Check if Zod 4 uses `z.int()` or `z.number().int()`. Read an existing validator in the project (e.g., `domains/kyc/validators.ts`) to follow the same pattern.

- [ ] **Step 2: Create queries**

```typescript
import { db } from '@/lib/db'

export async function getReviewsByProduct(productId: string, limit = 20) {
  return db.review.findMany({
    where: { productId, visible: true, deletedAt: null },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { member: { select: { firstName: true } } },
  })
}

export async function getReviewByOrder(orderId: string) {
  return db.review.findUnique({
    where: { orderId },
    include: { member: { select: { firstName: true } } },
  })
}

export async function getAverageRating(productId: string) {
  const result = await db.review.aggregate({
    where: { productId, visible: true, deletedAt: null },
    _avg: { rating: true },
    _count: { rating: true },
  })
  return {
    average: result._avg.rating || 0,
    count: result._count.rating,
  }
}

export async function getBusinessAverageRating(businessId: string) {
  const result = await db.review.aggregate({
    where: {
      product: { businessId },
      visible: true,
      deletedAt: null,
    },
    _avg: { rating: true },
    _count: { rating: true },
  })
  return {
    average: result._avg.rating || 0,
    count: result._count.rating,
  }
}

export async function getFlaggedReviews() {
  return db.review.findMany({
    where: { flagged: true, deletedAt: null },
    orderBy: { updatedAt: 'desc' },
    include: {
      member: { select: { firstName: true, lastName: true } },
      product: { select: { name: true, businessId: true } },
      order: { select: { id: true } },
    },
  })
}
```

- [ ] **Step 3: Create actions**

```typescript
'use server'

import { db } from '@/lib/db'
import { requireAuth, requireMember, requireAdmin } from '@/lib/auth-guards'
import { createReviewSchema, flagReviewSchema } from '@/domains/reviews/validators'
import { createNotification } from '@/domains/notifications/actions'
import { flattenFieldErrors } from '@/lib/utils'

export async function createReview(input: unknown) {
  try {
    const user = await requireAuth()

    const parsed = createReviewSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false as const, error: 'INVALID_INPUT', details: flattenFieldErrors(parsed.error) }
    }

    const { orderId, rating, comment } = parsed.data

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: true } },
        business: { include: { member: { include: { user: true } } } },
        review: true,
      },
    })

    if (!order || order.memberId !== user.member?.id) {
      return { success: false as const, error: 'NOT_FOUND' }
    }

    if (order.status !== 'DELIVERED') {
      return { success: false as const, error: 'ORDER_NOT_DELIVERED' }
    }

    if (order.review) {
      return { success: false as const, error: 'ALREADY_REVIEWED' }
    }

    const productId = order.items[0]?.productId
    if (!productId) {
      return { success: false as const, error: 'NO_PRODUCT' }
    }

    const review = await db.review.create({
      data: {
        orderId,
        memberId: user.member.id,
        productId,
        rating,
        comment: comment || null,
      },
    })

    // Notify seller
    if (order.business?.member?.user) {
      const productName = order.items[0]?.product?.name || 'un produit'
      await createNotification({
        userId: order.business.member.user.id,
        type: 'REVIEW_RECEIVED',
        title: 'Nouvel avis',
        message: `${rating} etoiles sur ${productName}`,
        link: `/mon-business/commandes/${orderId}`,
      })
    }

    return { success: true as const, data: { reviewId: review.id } }
  } catch (error) {
    return { success: false as const, error: 'UNKNOWN_ERROR' }
  }
}

export async function flagReview(input: unknown) {
  try {
    const { member } = await requireMember('BUSINESS')

    const parsed = flagReviewSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false as const, error: 'INVALID_INPUT', details: flattenFieldErrors(parsed.error) }
    }

    const { reviewId, reason } = parsed.data

    const review = await db.review.findUnique({
      where: { id: reviewId },
      include: { product: true },
    })

    if (!review) {
      return { success: false as const, error: 'NOT_FOUND' }
    }

    // Verify review is on one of seller's products
    const profile = await db.businessProfile.findUnique({
      where: { memberId: member.id },
    })

    if (!profile || review.product.businessId !== profile.id) {
      return { success: false as const, error: 'NOT_AUTHORIZED' }
    }

    await db.review.update({
      where: { id: reviewId },
      data: { flagged: true, flagReason: reason },
    })

    return { success: true as const, data: { reviewId } }
  } catch (error) {
    return { success: false as const, error: 'UNKNOWN_ERROR' }
  }
}

export async function moderateReview(reviewId: string, decision: 'MAINTAIN' | 'HIDE') {
  try {
    await requireAdmin()

    const review = await db.review.findUnique({
      where: { id: reviewId },
      include: { member: { include: { user: true } } },
    })

    if (!review) {
      return { success: false as const, error: 'NOT_FOUND' }
    }

    await db.review.update({
      where: { id: reviewId },
      data: {
        flagged: false,
        visible: decision === 'MAINTAIN',
      },
    })

    if (decision === 'HIDE' && review.member?.user) {
      await createNotification({
        userId: review.member.user.id,
        type: 'REVIEW_HIDDEN',
        title: 'Avis masque',
        message: 'Votre avis a ete masque suite a un signalement.',
      })
    }

    return { success: true as const, data: { reviewId } }
  } catch (error) {
    return { success: false as const, error: 'UNKNOWN_ERROR' }
  }
}
```

- [ ] **Step 4: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 5: Commit**

```bash
git add domains/reviews/
git commit -m "feat: add reviews domain with queries, actions, and validators

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: ReviewForm + ReviewCard components

**Files:**
- Create: `components/orders/review-form.tsx`
- Create: `components/orders/review-card.tsx`

- [ ] **Step 1: Create ReviewForm**

Client component with star rating + optional comment + submit.

```tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { StarRating } from '@/components/orders/star-rating'
import { createReview } from '@/domains/reviews/actions'

interface ReviewFormProps {
  orderId: string
}

export function ReviewForm({ orderId }: ReviewFormProps) {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit() {
    if (rating === 0) {
      toast.error('Selectionnez une note')
      return
    }

    startTransition(async () => {
      const result = await createReview({
        orderId,
        rating,
        comment: comment || undefined,
      })

      if (result.success) {
        toast.success('Avis publie !')
        router.refresh()
      } else {
        toast.error(
          result.error === 'ALREADY_REVIEWED'
            ? 'Vous avez deja laisse un avis'
            : result.error === 'ORDER_NOT_DELIVERED'
              ? 'La commande doit etre livree'
              : 'Erreur lors de la publication'
        )
      }
    })
  }

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="text-sm font-semibold">Laisser un avis</h3>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Votre note</p>
        <StarRating value={rating} onChange={setRating} />
      </div>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Commentaire (optionnel)</p>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Partagez votre experience..."
          maxLength={1000}
          rows={3}
        />
      </div>
      <Button onClick={handleSubmit} disabled={isPending || rating === 0} size="sm">
        {isPending ? 'Publication...' : 'Publier mon avis'}
      </Button>
    </div>
  )
}
```

- [ ] **Step 2: Create ReviewCard**

Server component displaying a single review.

```tsx
import { StarDisplay } from '@/components/orders/star-display'

interface ReviewCardProps {
  review: {
    rating: number
    comment: string | null
    createdAt: string
    member: { firstName: string }
  }
}

function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (days === 0) return "Aujourd'hui"
  if (days === 1) return 'Hier'
  if (days < 30) return `Il y a ${days} jours`
  const months = Math.floor(days / 30)
  return `Il y a ${months} mois`
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="space-y-1 border-b py-3 last:border-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StarDisplay rating={review.rating} />
          <span className="text-sm font-medium">{review.member.firstName}</span>
        </div>
        <span className="text-xs text-muted-foreground">{timeAgo(review.createdAt)}</span>
      </div>
      {review.comment && (
        <p className="text-sm text-muted-foreground">{review.comment}</p>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 4: Commit**

```bash
git add components/orders/review-form.tsx components/orders/review-card.tsx
git commit -m "feat: add ReviewForm and ReviewCard components

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Wire timeline + review into buyer order detail page

**Files:**
- Modify: `app/(member)/achats/[id]/page.tsx`

- [ ] **Step 1: Read the file**

Read `app/(member)/achats/[id]/page.tsx` fully.

- [ ] **Step 2: Add imports and data fetching**

Add imports:
```typescript
import { getOrderTimeline } from '@/domains/orders/queries'
import { getReviewByOrder } from '@/domains/reviews/queries'
import { OrderTimeline } from '@/components/orders/order-timeline'
import { ReviewForm } from '@/components/orders/review-form'
import { ReviewCard } from '@/components/orders/review-card'
```

After the order fetch, add:
```typescript
const timeline = await getOrderTimeline(order.id)
const review = await getReviewByOrder(order.id)
```

- [ ] **Step 3: Add timeline section**

Find the existing timeline/status section in the page (around lines 210-223). Replace or augment it with:

```tsx
<div className="rounded-lg border p-4">
  <h2 className="mb-4 text-lg font-semibold">Suivi de la commande</h2>
  <OrderTimeline timeline={JSON.parse(JSON.stringify(timeline))} />
</div>
```

- [ ] **Step 4: Add review section**

After the timeline section, add:

```tsx
{order.status === 'DELIVERED' && !review && (
  <ReviewForm orderId={order.id} />
)}
{review && (
  <div className="rounded-lg border p-4">
    <h2 className="mb-3 text-lg font-semibold">Votre avis</h2>
    <ReviewCard review={JSON.parse(JSON.stringify(review))} />
  </div>
)}
```

- [ ] **Step 5: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 6: Commit**

```bash
git add "app/(member)/achats/[id]/page.tsx"
git commit -m "feat: add timeline and review to buyer order detail page

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: Wire timeline + review flag into seller order detail page

**Files:**
- Modify: `app/(member)/mon-business/commandes/[id]/page.tsx`

- [ ] **Step 1: Read the file**

Read `app/(member)/mon-business/commandes/[id]/page.tsx` fully.

- [ ] **Step 2: Add data fetching**

Add imports for `getOrderTimeline`, `getReviewByOrder`, `OrderTimeline`, `ReviewCard`.

Fetch timeline and review data alongside the existing order fetch.

- [ ] **Step 3: Replace or augment the existing timeline section**

The page currently has a manual timeline (around lines 347-405). Replace it with the `OrderTimeline` component using real data from `getOrderTimeline`.

- [ ] **Step 4: Add review display + flag button**

In the right column (after the delivery info section), add a review section. If a review exists on the order:
- Show `ReviewCard` with the review
- If `review.flagged === false`, show a "Signaler" button
- The flag button should open a simple form (can be inline) with a reason textarea and submit
- Create a small client component `FlagReviewButton` inline or as a separate component that calls `flagReview` action

If no review exists, show nothing or "Aucun avis pour cette commande".

- [ ] **Step 5: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 6: Commit**

```bash
git add "app/(member)/mon-business/commandes/[id]/page.tsx"
git commit -m "feat: add timeline and review display with flag to seller order detail

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: Add reviews to public product page

**Files:**
- Modify: `app/(site)/boutique/[slug]/produit/[productId]/page.tsx`

- [ ] **Step 1: Read the file**

- [ ] **Step 2: Add data fetching**

Add imports for `getReviewsByProduct`, `getAverageRating` from `domains/reviews/queries`, and `StarDisplay`, `ReviewCard` components.

After the product fetch, add:
```typescript
const [reviews, ratingInfo] = await Promise.all([
  getReviewsByProduct(product.id),
  getAverageRating(product.id),
])
```

- [ ] **Step 3: Add reviews section**

After the business info card (end of page), add:

```tsx
{ratingInfo.count > 0 && (
  <div className="rounded-lg border p-6">
    <div className="mb-4 flex items-center gap-3">
      <h2 className="text-lg font-semibold">Avis clients</h2>
      <div className="flex items-center gap-2">
        <StarDisplay rating={ratingInfo.average} />
        <span className="text-sm text-muted-foreground">
          {ratingInfo.average.toFixed(1)} ({ratingInfo.count} avis)
        </span>
      </div>
    </div>
    <div>
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={JSON.parse(JSON.stringify(review))} />
      ))}
    </div>
  </div>
)}
```

- [ ] **Step 4: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 5: Commit**

```bash
git add "app/(site)/boutique/[slug]/produit/[productId]/page.tsx"
git commit -m "feat: add reviews section to public product page

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: Add average rating to public boutique page

**Files:**
- Modify: `app/(site)/boutique/[slug]/page.tsx`

- [ ] **Step 1: Read the file**

- [ ] **Step 2: Add rating display**

Import `getBusinessAverageRating` and `StarDisplay`.

After fetching the profile, add:
```typescript
const ratingInfo = await getBusinessAverageRating(profile.id)
```

Pass `ratingInfo` to the `StoreHero` component or display it directly near the business name. The exact integration depends on the StoreHero component structure — read it to decide whether to pass as prop or render alongside.

If StoreHero doesn't accept custom content, add the rating display right after the StoreHero component:

```tsx
{ratingInfo.count > 0 && (
  <div className="flex items-center gap-2 px-4 py-2">
    <StarDisplay rating={ratingInfo.average} />
    <span className="text-sm text-muted-foreground">
      {ratingInfo.average.toFixed(1)} ({ratingInfo.count} avis)
    </span>
  </div>
)}
```

- [ ] **Step 3: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 4: Commit**

```bash
git add "app/(site)/boutique/[slug]/page.tsx"
git commit -m "feat: add average rating to public boutique page

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 11: Admin moderation page

**Files:**
- Create: `components/admin/review-moderation-actions.tsx`
- Create: `app/(admin)/admin/avis/page.tsx`
- Modify: `components/admin/admin-sidebar.tsx`

- [ ] **Step 1: Create ReviewModerationActions component**

Client component with "Maintenir visible" and "Masquer l'avis" buttons.

```tsx
'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { moderateReview } from '@/domains/reviews/actions'

interface ReviewModerationActionsProps {
  reviewId: string
}

export function ReviewModerationActions({ reviewId }: ReviewModerationActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleModerate(decision: 'MAINTAIN' | 'HIDE') {
    startTransition(async () => {
      const result = await moderateReview(reviewId, decision)
      if (result.success) {
        toast.success(decision === 'MAINTAIN' ? 'Avis maintenu' : 'Avis masque')
        router.refresh()
      } else {
        toast.error('Erreur')
      }
    })
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" onClick={() => handleModerate('MAINTAIN')} disabled={isPending}>
        Maintenir
      </Button>
      <Button size="sm" variant="destructive" onClick={() => handleModerate('HIDE')} disabled={isPending}>
        Masquer
      </Button>
    </div>
  )
}
```

- [ ] **Step 2: Create admin avis page**

```tsx
import { requireAdmin } from '@/lib/auth-guards'
import { getFlaggedReviews } from '@/domains/reviews/queries'
import { StarDisplay } from '@/components/orders/star-display'
import { ReviewModerationActions } from '@/components/admin/review-moderation-actions'

export default async function AdminAvisPage() {
  await requireAdmin()
  const reviews = await getFlaggedReviews()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Avis signales</h1>

      {reviews.length === 0 ? (
        <p className="text-muted-foreground">Aucun avis signale.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StarDisplay rating={review.rating} />
                  <span className="text-sm font-medium">
                    {review.member.firstName} {review.member.lastName}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    sur {review.product.name}
                  </span>
                </div>
              </div>
              {review.comment && (
                <p className="text-sm">{review.comment}</p>
              )}
              <div className="rounded-md bg-destructive/10 p-3">
                <p className="text-sm font-medium text-destructive">Raison du signalement :</p>
                <p className="text-sm">{review.flagReason}</p>
              </div>
              <ReviewModerationActions reviewId={review.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Add "Avis" link to admin sidebar**

In `components/admin/admin-sidebar.tsx`, add a new link in the links array (after Paiements):

```typescript
{ href: '/admin/avis', label: 'Avis', icon: Star },
```

Add `Star` to the lucide-react import.

- [ ] **Step 4: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 5: Commit**

```bash
git add components/admin/review-moderation-actions.tsx "app/(admin)/admin/avis/page.tsx" components/admin/admin-sidebar.tsx
git commit -m "feat: add admin moderation page for flagged reviews

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 12: Final verification + continuity

- [ ] **Step 1: TypeScript check**

Run: `npx tsc --noEmit --skipLibCheck`

Expected: 0 errors.

- [ ] **Step 2: Visual testing**

Start dev server and verify:
- Create an order via checkout, check `/achats/[id]` — timeline shows "Paiement confirme"
- As seller, ship the order → timeline updates with "Expediee"
- Confirm delivery → timeline shows "Livree" + review form appears for buyer
- Submit a review → ReviewCard appears, seller sees it on their order detail
- Seller flags review → appears in `/admin/avis`
- Admin moderates → review hidden or maintained
- Public product page shows reviews and average rating
- Public boutique page shows business average rating

- [ ] **Step 3: Update continuity files**

Update `SESSION_LOG.md` and `PROJECT_STATE.md`.

- [ ] **Step 4: Commit**

```bash
git add SESSION_LOG.md PROJECT_STATE.md
git commit -m "docs: update continuity files after timeline + reviews implementation

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```
