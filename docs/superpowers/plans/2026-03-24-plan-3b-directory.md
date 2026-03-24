# Plan 3B — Directory & Business Profiles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the annuaire (directory) system — public business directory, member business profiles (SHOWCASE for Premium, STORE for Business), and product management for Business members. The annuaire is the entry point for discovery, with mini-boutiques integrated into business profiles.

**Architecture:** Directory domain for profile CRUD and queries. Business domain for products. Public pages show the annuaire and individual profiles. Members manage their business profile and products. Admin moderates profiles.

**Tech Stack:** Next.js 16, Prisma 7, Zod 4, shadcn/ui, Cloudinary

**Spec:** `docs/superpowers/specs/2026-03-23-club-m-platform-design.md` — Section 5 (BusinessProfile, Product models)

---

## Codebase Notes

**Import rules:** Same as previous plans — `@/lib/generated/prisma/client`, `@/lib/db`, `@/lib/auth`, `@/lib/auth-guards`, `@/lib/utils`, `@/lib/constants`, `@/domains/audit/actions`

**Server Actions:** Return-value pattern. **Zod 4.** **French URLs.** **params/searchParams are Promises in Next.js 16.**

**Key spec rules:**
- Premium members → BusinessProfile with profileType SHOWCASE (vitrine only)
- Business members → BusinessProfile with profileType STORE (vitrine + products + sales)
- Only STORE profiles can have products
- Profiles must be approved by admin before being publicly visible
- Annuaire is the main discovery entry point, not a standalone marketplace

---

## File Structure

```
domains/directory/types.ts              — Directory/profile types
domains/directory/validators.ts         — Zod schemas for profile + product CRUD
domains/directory/queries.ts            — Public directory queries
domains/directory/actions.ts            — Profile CRUD actions (member)
domains/directory/admin-actions.ts      — Profile moderation (admin)

domains/business/types.ts               — Product types
domains/business/validators.ts          — Product validators
domains/business/queries.ts             — Product queries
domains/business/actions.ts             — Product CRUD actions

app/(public)/annuaire/page.tsx          — Public directory listing
app/(public)/annuaire/[slug]/page.tsx   — Public business profile + mini-boutique

app/(member)/annuaire/page.tsx          — Member directory (enriched)
app/(member)/mon-business/page.tsx      — My business profile management
app/(member)/mon-business/produits/page.tsx      — My products list
app/(member)/mon-business/produits/nouveau/page.tsx — Create product
app/(member)/mon-business/produits/[id]/page.tsx    — Edit product

app/(admin)/admin/annuaire/page.tsx     — Admin directory moderation

components/directory/business-card.tsx           — Business card for listings
components/directory/business-profile-form.tsx   — Profile create/edit form
components/directory/product-card.tsx             — Product card
components/directory/product-form.tsx             — Product create/edit form
components/directory/mini-boutique.tsx            — Products section in profile
```

---

## Task 1: Directory Domain

**Files:**
- Create: `domains/directory/types.ts`, `domains/directory/validators.ts`, `domains/directory/queries.ts`, `domains/directory/actions.ts`, `domains/directory/admin-actions.ts`

### domains/directory/types.ts
```typescript
import type { BusinessProfile, Product, Member } from '@/lib/generated/prisma/client'

export type ProfileWithMember = BusinessProfile & {
  member: Pick<Member, 'id' | 'firstName' | 'lastName' | 'avatar' | 'tier' | 'verificationStatus'>
}

export type ProfileWithProducts = BusinessProfile & {
  member: Pick<Member, 'id' | 'firstName' | 'lastName' | 'avatar' | 'tier' | 'verificationStatus'>
  products: Product[]
}

export type PublicProfileListItem = {
  id: string
  businessName: string
  slug: string
  description: string
  category: string
  coverImage: string | null
  profileType: string
  memberName: string
  memberAvatar: string | null
  isVerified: boolean
  productCount: number
}
```

### domains/directory/validators.ts
```typescript
import { z } from 'zod'

export const createProfileSchema = z.object({
  businessName: z.string().min(1, 'Nom requis').max(200),
  description: z.string().min(10, 'Description trop courte').max(2000),
  category: z.string().min(1, 'Categorie requise'),
  coverImage: z.string().optional(),
  images: z.array(z.string()).default([]),
  phone: z.string().optional(),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  website: z.string().optional(),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
})

export const updateProfileSchema = createProfileSchema.partial().extend({
  id: z.string().min(1),
})
```

### domains/directory/queries.ts
```typescript
import { db } from '@/lib/db'

export async function getPublicProfiles(filters?: { category?: string; search?: string }) {
  return db.businessProfile.findMany({
    where: {
      isPublished: true,
      isApproved: true,
      ...(filters?.category && { category: filters.category }),
      ...(filters?.search && {
        OR: [
          { businessName: { contains: filters.search, mode: 'insensitive' as const } },
          { description: { contains: filters.search, mode: 'insensitive' as const } },
        ],
      }),
    },
    include: {
      member: { select: { id: true, firstName: true, lastName: true, avatar: true, tier: true, verificationStatus: true } },
      _count: { select: { products: { where: { isActive: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getProfileBySlug(slug: string) {
  return db.businessProfile.findUnique({
    where: { slug },
    include: {
      member: { select: { id: true, firstName: true, lastName: true, avatar: true, tier: true, verificationStatus: true } },
      products: { where: { isActive: true }, orderBy: { createdAt: 'desc' } },
    },
  })
}

export async function getProfileByMemberId(memberId: string) {
  return db.businessProfile.findUnique({
    where: { memberId },
    include: { products: { orderBy: { createdAt: 'desc' } } },
  })
}

export async function getCategories(): Promise<string[]> {
  const results = await db.businessProfile.findMany({
    where: { isPublished: true, isApproved: true },
    select: { category: true },
    distinct: ['category'],
    orderBy: { category: 'asc' },
  })
  return results.map((r) => r.category)
}

export async function getAdminProfiles(filters?: { approved?: boolean }) {
  return db.businessProfile.findMany({
    where: filters?.approved !== undefined ? { isApproved: filters.approved } : undefined,
    include: {
      member: { select: { firstName: true, lastName: true, tier: true, verificationStatus: true, user: { select: { email: true } } } },
      _count: { select: { products: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
}
```

### domains/directory/actions.ts
```typescript
'use server'

import type { z } from 'zod'
import { db } from '@/lib/db'
import { requireMember } from '@/lib/auth-guards'
import { createProfileSchema, updateProfileSchema } from './validators'
import { generateSlug } from '@/lib/utils'
import { createAuditLog } from '@/domains/audit/actions'
import { hasMinTier } from '@/lib/permissions'

type ActionResult<T> = { success: true; data: T } | { success: false; error: string; details?: Record<string, string[]> }

function flattenErrors(error: z.ZodError): Record<string, string[]> {
  const result: Record<string, string[]> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? '_root')
    if (!result[key]) result[key] = []
    result[key].push(issue.message)
  }
  return result
}

export async function createBusinessProfile(input: unknown): Promise<ActionResult<{ profileId: string; slug: string }>> {
  const { user, member } = await requireMember('PREMIUM')

  // Check no existing profile
  const existing = await db.businessProfile.findUnique({ where: { memberId: member.id } })
  if (existing) return { success: false, error: 'PROFILE_ALREADY_EXISTS' }

  const parsed = createProfileSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: 'INVALID_INPUT', details: flattenErrors(parsed.error) }

  const profileType = hasMinTier(member.tier, 'BUSINESS') ? 'STORE' : 'SHOWCASE'
  const slug = generateSlug(parsed.data.businessName) + '-' + Date.now().toString(36)

  const profile = await db.businessProfile.create({
    data: {
      memberId: member.id,
      ...parsed.data,
      email: parsed.data.email || null,
      slug,
      profileType,
      isPublished: false,
      isApproved: false,
    },
  })

  await createAuditLog({ userId: user.id, userEmail: user.email, action: 'directory.create_profile', entity: 'BusinessProfile', entityId: profile.id })

  return { success: true, data: { profileId: profile.id, slug: profile.slug } }
}

export async function updateBusinessProfile(input: unknown): Promise<ActionResult<{ profileId: string }>> {
  const { user, member } = await requireMember('PREMIUM')

  const parsed = updateProfileSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: 'INVALID_INPUT', details: flattenErrors(parsed.error) }

  const { id, ...data } = parsed.data
  const profile = await db.businessProfile.findUnique({ where: { id } })
  if (!profile) return { success: false, error: 'RESOURCE_NOT_FOUND' }
  if (profile.memberId !== member.id) return { success: false, error: 'NOT_OWNER' }

  await db.businessProfile.update({
    where: { id },
    data: { ...data, email: data.email || null },
  })

  return { success: true, data: { profileId: id } }
}

export async function togglePublishProfile(profileId: string): Promise<ActionResult<{ isPublished: boolean }>> {
  const { member } = await requireMember('PREMIUM')

  const profile = await db.businessProfile.findUnique({ where: { id: profileId } })
  if (!profile) return { success: false, error: 'RESOURCE_NOT_FOUND' }
  if (profile.memberId !== member.id) return { success: false, error: 'NOT_OWNER' }
  if (!profile.isApproved) return { success: false, error: 'PROFILE_NOT_APPROVED' }

  const updated = await db.businessProfile.update({
    where: { id: profileId },
    data: { isPublished: !profile.isPublished },
  })

  return { success: true, data: { isPublished: updated.isPublished } }
}
```

### domains/directory/admin-actions.ts
```typescript
'use server'

import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-guards'
import { createAuditLog } from '@/domains/audit/actions'

type ActionResult<T> = { success: true; data: T } | { success: false; error: string }

export async function approveProfile(profileId: string): Promise<ActionResult<null>> {
  const { user } = await requireAdmin()

  await db.businessProfile.update({ where: { id: profileId }, data: { isApproved: true } })
  await createAuditLog({ userId: user.id, userEmail: user.email, action: 'directory.approve', entity: 'BusinessProfile', entityId: profileId })

  return { success: true, data: null }
}

export async function rejectProfile(profileId: string): Promise<ActionResult<null>> {
  const { user } = await requireAdmin()

  await db.businessProfile.update({ where: { id: profileId }, data: { isApproved: false, isPublished: false } })
  await createAuditLog({ userId: user.id, userEmail: user.email, action: 'directory.reject', entity: 'BusinessProfile', entityId: profileId })

  return { success: true, data: null }
}
```

- [ ] **Commit**
```bash
git add domains/directory/
git commit -m "feat: add directory domain — profile CRUD, queries, admin moderation"
```

---

## Task 2: Business (Products) Domain

**Files:**
- Create: `domains/business/types.ts`, `domains/business/validators.ts`, `domains/business/queries.ts`, `domains/business/actions.ts`

### domains/business/validators.ts
```typescript
import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(1, 'Nom requis').max(200),
  description: z.string().min(1, 'Description requise').max(2000),
  price: z.number().min(0, 'Prix minimum: 0'),
  currency: z.enum(['USD', 'CDF', 'EUR']).default('USD'),
  images: z.array(z.string()).default([]),
  type: z.enum(['PHYSICAL', 'SERVICE', 'DIGITAL']).default('PHYSICAL'),
  category: z.string().optional(),
  stock: z.number().int().min(0).optional(),
})

export const updateProductSchema = createProductSchema.partial().extend({
  id: z.string().min(1),
})
```

### domains/business/queries.ts
```typescript
import { db } from '@/lib/db'

export async function getProductsByBusiness(businessId: string) {
  return db.product.findMany({
    where: { businessId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getProductById(productId: string) {
  return db.product.findUnique({
    where: { id: productId },
    include: { business: { select: { memberId: true, slug: true, businessName: true } } },
  })
}

export async function getActiveProductsByBusiness(businessId: string) {
  return db.product.findMany({
    where: { businessId, isActive: true },
    orderBy: { createdAt: 'desc' },
  })
}
```

### domains/business/actions.ts
Server actions for product CRUD. All guarded with requireVerifiedBusiness (or at minimum requireMember('BUSINESS') + ownership check on the profile). Actions:
- `createProduct(input)`: Create product linked to member's BusinessProfile (STORE type only)
- `updateProduct(input)`: Update product (ownership check)
- `toggleProductActive(productId)`: Toggle isActive
- `deleteProduct(productId)`: Soft-delete (set isActive: false) — we don't hard-delete

- [ ] **Commit**
```bash
git add domains/business/
git commit -m "feat: add business domain — product CRUD, queries, validators"
```

---

## Task 3: Public Directory Pages

**Files:**
- Create: `app/(public)/annuaire/page.tsx`, `app/(public)/annuaire/[slug]/page.tsx`
- Create: `components/directory/business-card.tsx`, `components/directory/mini-boutique.tsx`

### business-card.tsx — Server Component
Shows: cover image/placeholder, business name, category badge, member name, verified badge if applicable, product count if STORE, short description.

### mini-boutique.tsx — Server Component
Props: products array. Shows products in a grid within a business profile page. Each product: image, name, price, type badge. Only shown if profile is STORE and has products.

### Public annuaire page
- Fetch approved+published profiles via getPublicProfiles
- Category filter (from getCategories)
- Search input
- Grid of BusinessCards
- "Rejoignez Club M pour plus de visibilite" CTA

### Public profile page ([slug])
- Fetch profile by slug via getProfileBySlug
- If not found or not published/approved: redirect to /annuaire
- Show full business info: cover, name, description, category, contact info
- Show member info: name, avatar, verified badge
- If STORE: show MiniBoutique with products
- If SHOWCASE: show "Vitrine — contactez pour plus d'infos"

- [ ] **Commit**
```bash
git add app/(public)/annuaire/ components/directory/business-card.tsx components/directory/mini-boutique.tsx
git commit -m "feat: add public directory pages with business profiles and mini-boutique"
```

---

## Task 4: Member Business Profile Management

**Files:**
- Create: `app/(member)/mon-business/page.tsx`
- Create: `components/directory/business-profile-form.tsx`

### business-profile-form.tsx — Client Component
Form for creating/editing business profile:
- Fields: businessName, description, category (input or select), phone, email, website, whatsapp, address, coverImage (URL for MVP), images (comma-separated URLs for MVP)
- Calls createBusinessProfile or updateBusinessProfile
- Toast + router.refresh on success

### mon-business page
Server component:
- Get member profile
- If no business profile: show creation form (requires Premium+)
- If has profile: show profile info + edit form + publish toggle
- If STORE: link to products management (/mon-business/produits)
- Show profile approval status

- [ ] **Commit**
```bash
git add app/(member)/mon-business/page.tsx components/directory/business-profile-form.tsx
git commit -m "feat: add member business profile management page"
```

---

## Task 5: Member Products Management

**Files:**
- Create: `app/(member)/mon-business/produits/page.tsx`, `app/(member)/mon-business/produits/nouveau/page.tsx`, `app/(member)/mon-business/produits/[id]/page.tsx`
- Create: `components/directory/product-form.tsx`, `components/directory/product-card.tsx`

### product-form.tsx — Client Component
Form for creating/editing products:
- Fields: name, description, price, currency, type (PHYSICAL/SERVICE/DIGITAL), category, stock (optional, for PHYSICAL), images (URLs for MVP)
- Calls createProduct or updateProduct
- Toast on success

### product-card.tsx — Server Component
Shows: image, name, price, type badge, stock info, active/inactive toggle

### Products list page
- Get member's business profile + products
- If not STORE: redirect to /mon-business with message
- Grid of product cards with active/inactive toggle
- "Ajouter un produit" button

### Create product page
- ProductForm, calls createProduct, redirect on success

### Edit product page
- Load product by id (await params)
- Check ownership
- ProductForm with defaultValues

- [ ] **Commit**
```bash
git add app/(member)/mon-business/produits/ components/directory/product-form.tsx components/directory/product-card.tsx
git commit -m "feat: add member products management — list, create, edit"
```

---

## Task 6: Admin Directory Moderation

**Files:**
- Create: `app/(admin)/admin/annuaire/page.tsx`

### Admin annuaire page
- Get all profiles (approved + pending) via getAdminProfiles
- Table: business name, member, tier, profile type, approved status, product count
- Approve/Reject buttons for each profile
- Filter: approved/pending toggle

- [ ] **Commit**
```bash
git add app/(admin)/admin/annuaire/
git commit -m "feat: add admin directory moderation page"
```

---

## Task 7: Member Annuaire Page + Continuity

**Files:**
- Create: `app/(member)/annuaire/page.tsx`
- Modify: `PROJECT_STATE.md`, `SESSION_LOG.md`

### Member annuaire page
Same as public but with:
- Enriched view (more details visible to members)
- Member-specific contact options
- Link to member's own profile if exists

- [ ] **Commit**
```bash
git add app/(member)/annuaire/ PROJECT_STATE.md SESSION_LOG.md
git commit -m "feat: add member annuaire page and update docs for Plan 3B"
```

---

## Validation Criteria

| # | Criteria | How to verify |
|---|----------|---------------|
| 1 | Public annuaire shows approved profiles | Visit /annuaire (no auth) |
| 2 | Profile detail shows business info + products | Visit /annuaire/[slug] |
| 3 | Premium member can create SHOWCASE profile | Login as premium, go to /mon-business |
| 4 | Business member can create STORE profile | Login as business, go to /mon-business |
| 5 | Business member can add products | Go to /mon-business/produits/nouveau |
| 6 | Only STORE profiles show products | SHOWCASE profile has no products section |
| 7 | Admin can approve/reject profiles | Login as admin, /admin/annuaire |
| 8 | Unapproved profiles not visible publicly | Profile not in /annuaire until approved |
| 9 | Category filtering works | Filter by category on annuaire page |
| 10 | Products appear in mini-boutique | Visit STORE profile, see products |

## Commit Strategy
```
feat: add directory domain — profile CRUD, queries, admin moderation
feat: add business domain — product CRUD, queries, validators
feat: add public directory pages with business profiles and mini-boutique
feat: add member business profile management page
feat: add member products management — list, create, edit
feat: add admin directory moderation page
feat: add member annuaire page and update docs for Plan 3B
```
