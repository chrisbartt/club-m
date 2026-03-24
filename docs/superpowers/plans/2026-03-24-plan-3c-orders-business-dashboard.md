# Plan 3C — Orders & Business Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the order system (product purchase with confirmation code) and the Business member dashboard (KPIs, orders management, clients, revenue). This completes the commerce flow: customer buys product → vendeuse ships → code confirmation → order closed.

**Architecture:** Orders domain handles the purchase flow and confirmation code lifecycle. Business dashboard queries aggregate data for the vendeuse. Admin sees order supervision. All payments are simulated (stub) for MVP.

**Tech Stack:** Next.js 16, Prisma 7, Zod 4, shadcn/ui, Recharts (already installed)

**Spec:** `docs/superpowers/specs/2026-03-23-club-m-platform-design.md` — Sections 5 (Order model) and 7 (Flow 4)

---

## Codebase Notes

Same import rules as previous plans. **French URLs.** **params/searchParams are Promises.** **Return-value pattern for server actions.**

**Key spec rules for orders:**
- Buyer is either a Member or a Customer (mutually exclusive)
- Seller is a BusinessProfile (STORE type)
- confirmationCode: 6 alphanumeric chars, expires in 14 days
- Flow: PENDING → PAID → SHIPPED → DELIVERED (code confirmed) → COMPLETED
- Code visible to buyer in "Mes achats", buyer gives code to seller/deliverer
- Seller enters code in dashboard to confirm delivery
- MVP: no real escrow, just order status progression
- Commission: 10% (COMMISSION_RATE from constants)

---

## File Structure

```
domains/orders/types.ts                — Order-related types
domains/orders/validators.ts           — Zod schemas
domains/orders/queries.ts              — Order queries (buyer + seller sides)
domains/orders/actions.ts              — Purchase, ship, confirm delivery

domains/business/dashboard-queries.ts  — Business dashboard aggregations

app/(public)/annuaire/[slug]/produit/[productId]/page.tsx  — Product detail (public)

app/(member)/achats/page.tsx           — My purchases (buyer view)
app/(member)/mon-business/page.tsx     — UPDATE: add dashboard KPIs
app/(member)/mon-business/commandes/page.tsx    — Orders received (seller)
app/(member)/mon-business/commandes/[id]/page.tsx — Order detail (seller)
app/(member)/mon-business/clients/page.tsx       — My clients
app/(member)/mon-business/revenus/page.tsx       — Revenue overview

app/(admin)/admin/commandes/page.tsx   — Admin orders supervision

components/orders/purchase-button.tsx          — Buy product button
components/orders/order-card.tsx               — Order card (buyer view)
components/orders/seller-order-card.tsx         — Order card (seller view)
components/orders/confirm-delivery-form.tsx     — Code confirmation form
components/business/kpi-card.tsx               — KPI card for dashboard
components/business/revenue-chart.tsx          — Revenue chart (Recharts)
```

---

## Task 1: Orders Domain

**Files:**
- Create: `domains/orders/types.ts`, `domains/orders/validators.ts`, `domains/orders/queries.ts`, `domains/orders/actions.ts`

### types.ts
Types for OrderWithItems, OrderWithBuyer, SellerOrderListItem.

### validators.ts
```typescript
import { z } from 'zod'

export const createOrderSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).default(1),
})

export const confirmDeliverySchema = z.object({
  orderId: z.string().min(1),
  confirmationCode: z.string().min(1, 'Code requis'),
})

export const updateOrderStatusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum(['SHIPPED']),
})
```

### queries.ts
- `getBuyerOrders(memberId)`: Orders placed by a member, with items, product info, business info
- `getCustomerOrders(customerId)`: Orders placed by a customer
- `getSellerOrders(businessId)`: Orders received by a business, with buyer info and items
- `getOrderById(orderId)`: Full order with all relations
- `getAdminOrders(filters?)`: All orders for admin supervision

### actions.ts
Server actions:

1. `purchaseProduct(input)`:
   - Guard: requireAuth() (member or customer)
   - Validate product exists, is active, has stock (if PHYSICAL)
   - Get business profile (must be STORE, approved)
   - Calculate total: quantity * price
   - Calculate commission: total * COMMISSION_RATE
   - Generate confirmationCode (6 chars, via generateConfirmationCode from utils)
   - Set codeExpiresAt: now + 14 days
   - Create Order + OrderItem + Payment (simulated SUCCESS) in transaction
   - Decrement stock if PHYSICAL
   - Return orderId + confirmationCode

2. `markAsShipped(orderId)`:
   - Guard: requireMember('BUSINESS')
   - Verify seller ownership
   - Verify order status is PAID
   - Update to SHIPPED

3. `confirmDelivery(input)`:
   - Guard: requireMember('BUSINESS')
   - Verify seller ownership
   - Verify order status is SHIPPED
   - Verify confirmationCode matches and not expired
   - Update order: status DELIVERED, codeUsed true
   - Auto-complete after validation: status → COMPLETED (MVP: immediate, no 48h delay)
   - Audit log

- [ ] **Commit**
```bash
git add domains/orders/
git commit -m "feat: add orders domain — purchase, shipping, delivery confirmation"
```

---

## Task 2: Business Dashboard Queries

**Files:**
- Create: `domains/business/dashboard-queries.ts`

Aggregation queries for the Business member dashboard:

```typescript
import { db } from '@/lib/db'

export async function getBusinessDashboardStats(businessId: string) {
  const [totalOrders, totalRevenue, pendingOrders, completedOrders] = await Promise.all([
    db.order.count({ where: { businessId } }),
    db.order.aggregate({
      where: { businessId, status: { in: ['PAID', 'SHIPPED', 'DELIVERED', 'COMPLETED'] } },
      _sum: { totalAmount: true },
    }),
    db.order.count({ where: { businessId, status: { in: ['PAID', 'SHIPPED'] } } }),
    db.order.count({ where: { businessId, status: 'COMPLETED' } }),
  ])

  return {
    totalOrders,
    totalRevenue: Number(totalRevenue._sum.totalAmount ?? 0),
    pendingOrders,
    completedOrders,
  }
}

export async function getBusinessRecentOrders(businessId: string, limit = 5) {
  return db.order.findMany({
    where: { businessId },
    include: {
      member: { select: { firstName: true, lastName: true } },
      customer: { select: { firstName: true, lastName: true } },
      items: { include: { product: { select: { name: true } } } },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

export async function getBusinessClients(businessId: string) {
  // Get unique buyers from orders
  const orders = await db.order.findMany({
    where: { businessId },
    select: {
      memberId: true,
      customerId: true,
      member: { select: { id: true, firstName: true, lastName: true, user: { select: { email: true } } } },
      customer: { select: { id: true, firstName: true, lastName: true, user: { select: { email: true } } } },
      totalAmount: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  // Aggregate per client
  const clientMap = new Map<string, { id: string; name: string; email: string; orderCount: number; totalSpent: number; lastOrder: Date }>()
  for (const order of orders) {
    const buyer = order.member ?? order.customer
    if (!buyer) continue
    const key = order.memberId ?? order.customerId ?? ''
    const existing = clientMap.get(key)
    if (existing) {
      existing.orderCount++
      existing.totalSpent += Number(order.totalAmount)
    } else {
      clientMap.set(key, {
        id: buyer.id,
        name: `${buyer.firstName} ${buyer.lastName}`,
        email: buyer.user.email,
        orderCount: 1,
        totalSpent: Number(order.totalAmount),
        lastOrder: order.createdAt,
      })
    }
  }

  return Array.from(clientMap.values()).sort((a, b) => b.totalSpent - a.totalSpent)
}

export async function getBusinessRevenueByMonth(businessId: string) {
  // Get completed orders for the last 6 months
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const orders = await db.order.findMany({
    where: {
      businessId,
      status: { in: ['COMPLETED', 'DELIVERED'] },
      createdAt: { gte: sixMonthsAgo },
    },
    select: { totalAmount: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  })

  // Group by month
  const monthly = new Map<string, number>()
  for (const order of orders) {
    const key = order.createdAt.toISOString().slice(0, 7) // YYYY-MM
    monthly.set(key, (monthly.get(key) ?? 0) + Number(order.totalAmount))
  }

  return Array.from(monthly.entries()).map(([month, revenue]) => ({ month, revenue }))
}
```

- [ ] **Commit**
```bash
git add domains/business/dashboard-queries.ts
git commit -m "feat: add business dashboard queries — stats, clients, revenue"
```

---

## Task 3: Product Detail + Purchase

**Files:**
- Create: `app/(public)/annuaire/[slug]/produit/[productId]/page.tsx`
- Create: `components/orders/purchase-button.tsx`

### purchase-button.tsx — Client Component
Props: productId, price, currency, disabled?, disabledReason?
- "Acheter — X$" button
- Calls purchaseProduct action
- On success: toast "Commande confirmee ! Votre code: XXXXXX" + redirect to /achats
- On error: toast with error
- If not logged in: redirect to /login

### Product detail page (public)
- Fetch product by id (nested under business profile slug for URL context)
- Show: images, name, description, price, type, stock
- Show business info (name, link to profile)
- PurchaseButton (if logged in) or "Connectez-vous pour acheter" CTA

- [ ] **Commit**
```bash
git add app/(public)/annuaire/\[slug\]/produit/ components/orders/purchase-button.tsx
git commit -m "feat: add product detail page with purchase button"
```

---

## Task 4: Buyer — My Purchases

**Files:**
- Create: `app/(member)/achats/page.tsx`
- Create: `components/orders/order-card.tsx`

### order-card.tsx — Server Component
Shows: product name(s), seller business name, order date, total amount, status badge, confirmation code (visible only when PAID/SHIPPED — the buyer needs to give this code)

### achats page
- Get member's orders via getBuyerOrders
- "Mes achats" heading
- List of OrderCards
- Each shows the confirmation code prominently when status is PAID or SHIPPED
- Explanation text: "Donnez ce code au vendeur/livreur lors de la reception"

- [ ] **Commit**
```bash
git add app/(member)/achats/ components/orders/order-card.tsx
git commit -m "feat: add buyer purchases page with confirmation codes"
```

---

## Task 5: Seller — Orders + Delivery Confirmation

**Files:**
- Create: `app/(member)/mon-business/commandes/page.tsx`, `app/(member)/mon-business/commandes/[id]/page.tsx`
- Create: `components/orders/seller-order-card.tsx`, `components/orders/confirm-delivery-form.tsx`

### seller-order-card.tsx — Server Component
Shows: buyer name, items, total, date, status badge, actions (Mark Shipped / Confirm Delivery)

### confirm-delivery-form.tsx — Client Component
- Code input field (6 chars)
- "Confirmer la livraison" button
- Calls confirmDelivery action
- On success: toast + refresh
- On error (wrong code, expired): toast with specific message

### Seller orders list page
- Get seller's orders via getSellerOrders(businessId)
- Filter by status tabs: Tous / En attente / Expediees / Completees
- List of SellerOrderCards

### Seller order detail page
- Load full order by id
- Check ownership (order.businessId matches member's profile)
- Show: buyer info, items, totals, status, dates
- If PAID: "Marquer comme expediee" button
- If SHIPPED: ConfirmDeliveryForm

- [ ] **Commit**
```bash
git add app/(member)/mon-business/commandes/ components/orders/seller-order-card.tsx components/orders/confirm-delivery-form.tsx
git commit -m "feat: add seller orders management with delivery confirmation"
```

---

## Task 6: Business Dashboard KPIs + Revenue

**Files:**
- Modify: `app/(member)/mon-business/page.tsx` — add dashboard section for Business members
- Create: `components/business/kpi-card.tsx`
- Create: `components/business/revenue-chart.tsx`
- Create: `app/(member)/mon-business/clients/page.tsx`
- Create: `app/(member)/mon-business/revenus/page.tsx`

### kpi-card.tsx — Server Component
Simple card showing: label, value (large number), optional trend indicator. Same style as the reference dashboard screenshot (dark theme, clean).

### revenue-chart.tsx — Client Component ('use client')
Uses Recharts (already installed). Shows monthly revenue line chart.
Props: data array of { month, revenue }

### Update mon-business page
For Business members with STORE profile, add a dashboard section at the top:
- 4 KPI cards: Chiffre d'affaires, Commandes, Commandes en cours, Commandes completees
- Revenue chart (last 6 months)
- Recent orders (5 latest)
- Quick links: Mes produits, Mes commandes, Mes clients, Mes revenus

### Clients page
- Get business clients via getBusinessClients
- Table: client name, email, orders count, total spent, last order date
- Sorted by total spent (best clients first)

### Revenue page
- Get revenue by month + stats
- Revenue chart (larger)
- Stats summary

- [ ] **Commit**
```bash
git add components/business/ app/(member)/mon-business/page.tsx app/(member)/mon-business/clients/ app/(member)/mon-business/revenus/
git commit -m "feat: add business dashboard with KPIs, revenue chart, clients"
```

---

## Task 7: Admin Orders + Continuity

**Files:**
- Create: `app/(admin)/admin/commandes/page.tsx`
- Modify: `PROJECT_STATE.md`, `SESSION_LOG.md`

### Admin orders page
- Get all orders via getAdminOrders
- Table: order ID (short), buyer, seller, total, status badge, date
- Filter by status
- Click → could link to detail (or just show inline for MVP)

### Continuity
Update PROJECT_STATE.md and SESSION_LOG.md for Plan 3C completion.

- [ ] **Commit**
```bash
git add app/(admin)/admin/commandes/ PROJECT_STATE.md SESSION_LOG.md
git commit -m "feat: add admin orders supervision and update docs for Plan 3C"
```

---

## Validation Criteria

| # | Criteria | Verify |
|---|----------|--------|
| 1 | Product detail shows purchase button | Visit /annuaire/[slug]/produit/[id] |
| 2 | Purchase creates order with code | Buy product, check DB |
| 3 | Buyer sees confirmation code | Visit /achats |
| 4 | Seller sees received orders | Visit /mon-business/commandes |
| 5 | Seller can mark shipped | Change status to SHIPPED |
| 6 | Seller confirms with code | Enter code, order → COMPLETED |
| 7 | Wrong code rejected | Enter wrong code, see error |
| 8 | Business dashboard shows KPIs | Visit /mon-business as Business |
| 9 | Revenue chart renders | Chart visible with Recharts |
| 10 | Admin sees all orders | Visit /admin/commandes |

## Commit Strategy
```
feat: add orders domain — purchase, shipping, delivery confirmation
feat: add business dashboard queries — stats, clients, revenue
feat: add product detail page with purchase button
feat: add buyer purchases page with confirmation codes
feat: add seller orders management with delivery confirmation
feat: add business dashboard with KPIs, revenue chart, clients
feat: add admin orders supervision and update docs for Plan 3C
```
