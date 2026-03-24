# Plan 4 — Admin Complete + Public Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the admin panel (analytics dashboard, payments supervision, audit log, products moderation) and connect the existing site vitrine to the new system.

**Architecture:** Admin dashboard uses Recharts for analytics. Remaining admin pages follow the established pattern (server component + domain queries). Site vitrine integration connects the old (site) route group to the new auth/layout system.

**Tech Stack:** Next.js 16, Prisma 7, Recharts, shadcn/ui

**Spec:** `docs/superpowers/specs/2026-03-23-club-m-platform-design.md`

---

## Codebase Notes

Same import rules as all previous plans. **French URLs.** **params/searchParams are Promises.** **Return-value pattern.**

**Existing admin pages:** dashboard (placeholder), membres, evenements, annuaire, commandes.
**Missing admin pages:** paiements, journal (audit), produits.
**Admin sidebar links:** dashboard, membres, evenements, annuaire, produits, commandes, paiements, journal — all at `/admin/*`

**Existing site vitrine:** `app/(site)/` contains the old site pages (accueil, a-propos, devenir-membre, evenements, annuaires, contact, etc.). These pages exist but may have broken imports referencing old schemas/components.

---

## File Structure

```
domains/payments/queries.ts              — Payment queries for admin
domains/audit/queries.ts                 — Audit log queries

app/(admin)/admin/dashboard/page.tsx     — REWRITE: analytics dashboard
app/(admin)/admin/paiements/page.tsx     — Payments supervision
app/(admin)/admin/journal/page.tsx       — Audit log viewer
app/(admin)/admin/produits/page.tsx      — Products moderation

components/admin/admin-stats-cards.tsx   — Reusable stats cards
components/admin/admin-charts.tsx        — Analytics charts (Recharts)
```

---

## Task 1: Admin Analytics Queries

**Files:**
- Create: `domains/payments/queries.ts`
- Create: `domains/audit/queries.ts`

### domains/payments/queries.ts
```typescript
import { db } from '@/lib/db'
import type { PaymentStatus } from '@/lib/generated/prisma/client'

export async function getAdminPayments(filters?: { status?: PaymentStatus }) {
  return db.payment.findMany({
    where: filters?.status ? { status: filters.status } : undefined,
    include: {
      order: { select: { id: true, business: { select: { businessName: true } } } },
      ticket: { select: { id: true, event: { select: { title: true } } } },
      subscription: { select: { id: true, member: { select: { firstName: true, lastName: true } } } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
}

export async function getPaymentsStats() {
  const [total, success, pending, failed, totalRevenue] = await Promise.all([
    db.payment.count(),
    db.payment.count({ where: { status: 'SUCCESS' } }),
    db.payment.count({ where: { status: 'PENDING' } }),
    db.payment.count({ where: { status: 'FAILED' } }),
    db.payment.aggregate({
      where: { status: 'SUCCESS' },
      _sum: { amount: true },
    }),
  ])
  return { total, success, pending, failed, totalRevenue: Number(totalRevenue._sum.amount ?? 0) }
}
```

### domains/audit/queries.ts
```typescript
import { db } from '@/lib/db'

export async function getAuditLogs(filters?: { entity?: string; limit?: number }) {
  return db.auditLog.findMany({
    where: filters?.entity ? { entity: filters.entity } : undefined,
    orderBy: { createdAt: 'desc' },
    take: filters?.limit ?? 100,
  })
}

export async function getAuditLogEntities(): Promise<string[]> {
  const results = await db.auditLog.findMany({
    select: { entity: true },
    distinct: ['entity'],
    orderBy: { entity: 'asc' },
  })
  return results.map((r) => r.entity)
}
```

Also add a global admin dashboard query. Create `domains/members/admin-queries.ts` already exists — we need a new file for cross-domain stats:

### Create `domains/admin-dashboard-queries.ts`
```typescript
import { db } from '@/lib/db'

export async function getGlobalDashboardStats() {
  const [
    totalMembers, freeMembers, premiumMembers, businessMembers,
    totalEvents, publishedEvents,
    totalOrders, completedOrders,
    totalRevenue, pendingKyc,
  ] = await Promise.all([
    db.member.count(),
    db.member.count({ where: { tier: 'FREE' } }),
    db.member.count({ where: { tier: 'PREMIUM' } }),
    db.member.count({ where: { tier: 'BUSINESS' } }),
    db.event.count(),
    db.event.count({ where: { status: 'PUBLISHED' } }),
    db.order.count(),
    db.order.count({ where: { status: 'COMPLETED' } }),
    db.payment.aggregate({ where: { status: 'SUCCESS' }, _sum: { amount: true } }),
    db.kycVerification.count({ where: { status: 'PENDING' } }),
  ])

  return {
    members: { total: totalMembers, free: freeMembers, premium: premiumMembers, business: businessMembers },
    events: { total: totalEvents, published: publishedEvents },
    orders: { total: totalOrders, completed: completedOrders },
    revenue: Number(totalRevenue._sum.amount ?? 0),
    pendingKyc,
  }
}

export async function getMemberGrowthByMonth() {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const members = await db.member.findMany({
    where: { createdAt: { gte: sixMonthsAgo } },
    select: { createdAt: true, tier: true },
    orderBy: { createdAt: 'asc' },
  })

  const monthly = new Map<string, { free: number; premium: number; business: number }>()
  for (const m of members) {
    const key = m.createdAt.toISOString().slice(0, 7)
    const existing = monthly.get(key) ?? { free: 0, premium: 0, business: 0 }
    if (m.tier === 'FREE') existing.free++
    else if (m.tier === 'PREMIUM') existing.premium++
    else existing.business++
    monthly.set(key, existing)
  }

  return Array.from(monthly.entries()).map(([month, data]) => ({ month, ...data }))
}

export async function getRevenueByMonth() {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const payments = await db.payment.findMany({
    where: { status: 'SUCCESS', createdAt: { gte: sixMonthsAgo } },
    select: { amount: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  })

  const monthly = new Map<string, number>()
  for (const p of payments) {
    const key = p.createdAt.toISOString().slice(0, 7)
    monthly.set(key, (monthly.get(key) ?? 0) + Number(p.amount))
  }

  return Array.from(monthly.entries()).map(([month, revenue]) => ({ month, revenue }))
}
```

- [ ] **Commit**
```bash
git add domains/payments/queries.ts domains/audit/queries.ts domains/admin-dashboard-queries.ts
git commit -m "feat: add admin dashboard, payments, and audit queries"
```

---

## Task 2: Admin Analytics Dashboard

**Files:**
- Rewrite: `app/(admin)/admin/dashboard/page.tsx`
- Create: `components/admin/admin-charts.tsx`

### components/admin/admin-charts.tsx — Client Component ('use client')

Two chart components using Recharts:

1. `MemberGrowthChart`: Stacked bar chart showing member growth by tier (Free/Premium/Business) per month
2. `RevenueChart`: Area chart showing monthly revenue

Both use French month labels and are responsive.

### Rewrite admin dashboard page

Server component showing:
- 6 KPI cards in 2 rows: Total membres, Premium, Business, Revenus totaux, Evenements publies, KYC en attente
- Member growth chart (last 6 months)
- Revenue chart (last 6 months)
- Quick links: "Voir tous les membres", "KYC en attente ({count})", "Voir les commandes"

- [ ] **Commit**
```bash
git add app/(admin)/admin/dashboard/ components/admin/admin-charts.tsx
git commit -m "feat: add admin analytics dashboard with KPIs and charts"
```

---

## Task 3: Admin Payments + Audit + Products Pages

**Files:**
- Create: `app/(admin)/admin/paiements/page.tsx`
- Create: `app/(admin)/admin/journal/page.tsx`
- Create: `app/(admin)/admin/produits/page.tsx`

### Admin paiements page
- Get payments via getAdminPayments + getPaymentsStats
- Stats cards: Total, Reussis, En attente, Echoues, Revenu total
- Status filter (link-based)
- Table: ID (short), type (Commande/Ticket/Abonnement), montant, statut badge, provider, date
- Type determined by which FK is filled (orderId/ticketId/subscriptionId)

### Admin journal page
- Get audit logs via getAuditLogs + getAuditLogEntities
- "Journal d'audit" heading
- Entity filter dropdown
- Table: Date, Utilisateur (email), Action, Entite, ID entite
- Formatted action names (e.g., "kyc.approve" → "Approbation KYC")

### Admin produits page
- Get all products with business info for moderation
- Table: Nom, Business, Prix, Type badge, Actif badge, Date
- Simple moderation view

Query for products (add to domains/business/queries.ts or create inline):
```typescript
// Can query directly in the page or add to domains/business/queries.ts
const products = await db.product.findMany({
  include: { business: { select: { businessName: true, member: { select: { firstName: true, lastName: true } } } } },
  orderBy: { createdAt: 'desc' },
  take: 100,
})
```

- [ ] **Commit**
```bash
git add app/(admin)/admin/paiements/ app/(admin)/admin/journal/ app/(admin)/admin/produits/
git commit -m "feat: add admin pages — payments, audit log, products moderation"
```

---

## Task 4: Site Vitrine Integration

**Files:**
- Modify: `app/(public)/layout.tsx` — ensure navbar links to site pages
- Create: `app/(public)/a-propos/page.tsx` — redirect or proxy to (site) content
- Create: `app/(public)/contact/page.tsx`
- Create: `app/(public)/offres/page.tsx`

The old site vitrine lives in `app/(site)/`. These pages have their own components and layouts. Rather than rewriting them (they're "globalement valide" per the user), we create bridge pages in `(public)` that either:
1. Re-export the (site) content
2. Or create simple new pages that link to the existing (site) routes

**Strategy:** The simplest approach for MVP is to update the public navbar to include links to the old site pages. Since `(site)` is a route group, its pages are accessible at the root level (`/a-propos`, `/contact`, `/devenir-membre`, `/evenements`). But our new `(public)` route group also has `/evenements` → conflict.

**Resolution:** The old site pages at `/a-propos`, `/contact`, `/devenir-membre`, `/support`, `/mentions-legales` don't conflict with our new pages. The conflicts are:
- `/evenements` — old site has it, new (public) has it → new one takes priority (that's fine, our new one is better)
- `/annuaires` (old) vs `/annuaire` (new) — different paths, no conflict

So we just need to update the navbar to link to existing pages that are already accessible.

### Update navbar

Modify `components/shared/navbar.tsx` to include links:
- Accueil (/)
- A propos (/a-propos)
- Offres (/devenir-membre)
- Evenements (/evenements)
- Annuaire (/annuaire)
- Contact (/contact)

These link to either existing (site) pages or our new (public) pages.

### Update homepage

Modify `app/(public)/page.tsx` to be more complete:
- Hero section with Club M branding
- Quick stats (members count, events count)
- Featured events (3 upcoming)
- CTA: Rejoindre Club M
- Link to annuaire

- [ ] **Commit**
```bash
git add components/shared/navbar.tsx app/(public)/page.tsx
git commit -m "feat: update public navbar and homepage with site navigation"
```

---

## Task 5: Final Cleanup + Continuity

**Files:**
- Remove old broken files: `app/api/auth/register/route.ts` (causes TS errors, registration is via server action now)
- Update: `CLAUDE.md`, `PROJECT_STATE.md`, `SESSION_LOG.md`

### Cleanup
- Delete `app/api/auth/register/route.ts` if it exists and causes errors
- Delete any other files causing TS errors that are no longer needed

### Update CLAUDE.md
Add note about the (site) route group containing the original site vitrine.

### Update PROJECT_STATE.md
Mark everything as done. "In Progress: none — MVP complete."

### Update SESSION_LOG.md
Add Plan 4 execution entry. Note MVP completion.

- [ ] **Commit**
```bash
git add -A
git commit -m "feat: complete MVP — admin panel, site integration, cleanup"
```

---

## Validation Criteria

| # | Criteria | Verify |
|---|----------|--------|
| 1 | Admin dashboard shows real analytics | Login as admin, /admin/dashboard |
| 2 | Member growth chart renders | Charts visible with Recharts |
| 3 | Revenue chart renders | Charts visible |
| 4 | Admin payments page works | /admin/paiements shows payment records |
| 5 | Admin audit log works | /admin/journal shows action history |
| 6 | Admin products page works | /admin/produits shows products list |
| 7 | Public navbar has all links | Homepage navbar links work |
| 8 | Homepage is complete | / shows hero, events, CTAs |
| 9 | Old site pages still accessible | /a-propos, /contact load correctly |
| 10 | No TS errors in new files | `npx tsc --noEmit` clean for our files |

## Commit Strategy
```
feat: add admin dashboard, payments, and audit queries
feat: add admin analytics dashboard with KPIs and charts
feat: add admin pages — payments, audit log, products moderation
feat: update public navbar and homepage with site navigation
feat: complete MVP — admin panel, site integration, cleanup
```
