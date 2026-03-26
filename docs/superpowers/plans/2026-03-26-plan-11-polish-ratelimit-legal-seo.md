# Rate Limiting + Pages Légales + SEO — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add in-memory rate limiting on auth endpoints, legal pages (CGU, confidentialité), and SEO essentials (dynamic meta tags, sitemap, robots.txt).

**Architecture:** Rate limiter as a generic `lib/rate-limit.ts` helper applied in 3 auth actions. Legal pages as static server components with AppContainerWebSite layout. SEO via Next.js conventions (generateMetadata, app/sitemap.ts, app/robots.ts).

**Tech Stack:** Next.js 16, Tailwind CSS 4, shadcn/ui

**Spec:** `docs/superpowers/specs/2026-03-26-polish-ratelimit-legal-seo-design.md`

---

## File Structure

### New files
```
lib/rate-limit.ts                       — Generic in-memory rate limiter
app/(site)/cgu/page.tsx                 — CGU page
app/(site)/confidentialite/page.tsx     — Privacy policy page
app/sitemap.ts                          — Dynamic sitemap
app/robots.ts                           — Robots.txt
```

### Modified files
```
domains/members/actions.ts              — Rate limit registerMember
domains/auth/actions.ts                 — Rate limit requestPasswordReset
lib/auth.ts                             — Rate limit login (authorize)
components/layout/footer.tsx            — Add CGU + confidentialité links
app/(site)/marketplace/page.tsx         — Add generateMetadata
app/(site)/evenements/page.tsx          — Add generateMetadata
app/(site)/evenements/[id]/page.tsx     — Add generateMetadata
app/(site)/annuaires/page.tsx           — Add generateMetadata
app/(site)/contact/page.tsx             — Add generateMetadata
app/(site)/mentions-legales/page.tsx    — Add generateMetadata
```

---

## Task 1: Rate limiter helper

**Files:**
- Create: `lib/rate-limit.ts`

- [ ] **Step 1: Create the rate limiter**

```typescript
const store = new Map<string, { count: number; resetAt: number }>()

// Cleanup expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of store) {
    if (value.resetAt < now) store.delete(key)
  }
}, 5 * 60 * 1000)

export function rateLimit(key: string, limit: number, windowMs: number): { success: boolean; remaining: number } {
  const now = Date.now()
  const record = store.get(key)

  if (!record || record.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { success: true, remaining: limit - 1 }
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0 }
  }

  record.count++
  return { success: true, remaining: limit - record.count }
}
```

Also add a helper to get IP from headers:

```typescript
import { headers } from 'next/headers'

export async function getClientIp(): Promise<string> {
  const h = await headers()
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 3: Commit**

```bash
git add lib/rate-limit.ts
git commit -m "feat: add in-memory rate limiter helper

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Apply rate limiting to auth actions

**Files:**
- Modify: `domains/members/actions.ts` (registerMember — around line 43)
- Modify: `domains/auth/actions.ts` (requestPasswordReset — around line 48)
- Modify: `lib/auth.ts` (authorize — around line 21)

- [ ] **Step 1: Rate limit registerMember**

Read `domains/members/actions.ts`. In `registerMember`, after Zod validation but before the first DB query, add:

```typescript
import { rateLimit, getClientIp } from '@/lib/rate-limit'

const ip = await getClientIp()
const rl = rateLimit(`register:${ip}`, 3, 60 * 60 * 1000) // 3 per hour
if (!rl.success) {
  return { success: false, error: 'RATE_LIMITED' }
}
```

- [ ] **Step 2: Rate limit requestPasswordReset**

Read `domains/auth/actions.ts`. In `requestPasswordReset`, after validation, add:

```typescript
import { rateLimit } from '@/lib/rate-limit'

const rl = rateLimit(`reset:${parsed.data.email}`, 3, 60 * 60 * 1000) // 3 per hour per email
if (!rl.success) {
  return { success: false, error: 'RATE_LIMITED' }
}
```

- [ ] **Step 3: Rate limit login**

Read `lib/auth.ts`. The login is in the NextAuth `authorize` callback. This is trickier because `authorize` throws or returns null — it doesn't use the return-value pattern.

Add at the top of the authorize function:

```typescript
import { rateLimit } from '@/lib/rate-limit'

// In authorize:
const ip = request?.headers?.get?.('x-forwarded-for') || 'unknown'
const rl = rateLimit(`login:${ip}`, 5, 15 * 60 * 1000) // 5 per 15 min
if (!rl.success) {
  throw new Error('Trop de tentatives. Reessayez dans quelques minutes.')
}
```

NOTE: Read the auth.ts file carefully. The `authorize` function may not have access to the request object. If not, use email as the key instead of IP:

```typescript
const rl = rateLimit(`login:${credentials.email}`, 5, 15 * 60 * 1000)
```

- [ ] **Step 4: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 5: Commit**

```bash
git add domains/members/actions.ts domains/auth/actions.ts lib/auth.ts lib/rate-limit.ts
git commit -m "feat: apply rate limiting to login, register, password reset

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Legal pages (CGU + Confidentialité)

**Files:**
- Create: `app/(site)/cgu/page.tsx`
- Create: `app/(site)/confidentialite/page.tsx`
- Modify: `components/layout/footer.tsx`

- [ ] **Step 1: Create CGU page**

Create `app/(site)/cgu/page.tsx`:

Server component wrapped in AppContainerWebSite. Content: generic CGU text for Club M marketplace, adapted for RDC/Kinshasa context. Sections: objet, inscription, obligations, propriété intellectuelle, responsabilité, modification, droit applicable.

Include `generateMetadata`:
```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Conditions Generales d'Utilisation | Club M",
  description: "Conditions generales d'utilisation de la plateforme Club M.",
}
```

The page content should be well-structured with headings (h1, h2), paragraphs, and a "Dernière mise à jour" date.

- [ ] **Step 2: Create Confidentialité page**

Create `app/(site)/confidentialite/page.tsx`:

Same structure. Content: politique de confidentialité — données collectées (nom, email, téléphone, adresse), usage (traitement commandes, communication), partage (vendeuses pour livraison), sécurité, droits des utilisateurs, contact.

Include `generateMetadata`.

- [ ] **Step 3: Update footer links**

Read `components/layout/footer.tsx`. Find the legal links section (around lines 216-240). Add links to `/cgu` and `/confidentialite`. Replace the anchor links (#cookies, #donnees) with the real pages.

- [ ] **Step 4: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 5: Commit**

```bash
git add "app/(site)/cgu/page.tsx" "app/(site)/confidentialite/page.tsx" components/layout/footer.tsx
git commit -m "feat: add CGU and privacy policy pages, update footer links

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: SEO — sitemap + robots.txt

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`

- [ ] **Step 1: Create sitemap**

```typescript
import type { MetadataRoute } from 'next'
import { db } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clubm.cd'

  // Static pages
  const staticPages = [
    '', '/marketplace', '/evenements', '/annuaires', '/contact',
    '/a-propos', '/devenir-membre', '/cgu', '/confidentialite', '/mentions-legales',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
  }))

  // Active products
  const products = await db.product.findMany({
    where: { isActive: true, business: { isApproved: true, profileType: 'STORE' } },
    select: { id: true, updatedAt: true, business: { select: { slug: true } } },
  })
  const productPages = products.map((p) => ({
    url: `${baseUrl}/boutique/${p.business.slug}/produit/${p.id}`,
    lastModified: p.updatedAt,
    changeFrequency: 'daily' as const,
  }))

  // Approved boutiques
  const boutiques = await db.businessProfile.findMany({
    where: { isApproved: true, profileType: 'STORE' },
    select: { slug: true, updatedAt: true },
  })
  const boutiquePages = boutiques.map((b) => ({
    url: `${baseUrl}/boutique/${b.slug}`,
    lastModified: b.updatedAt,
    changeFrequency: 'daily' as const,
  }))

  // Upcoming events
  const events = await db.event.findMany({
    where: { startDate: { gte: new Date() } },
    select: { id: true, updatedAt: true },
  })
  const eventPages = events.map((e) => ({
    url: `${baseUrl}/evenements/${e.id}`,
    lastModified: e.updatedAt,
    changeFrequency: 'weekly' as const,
  }))

  return [...staticPages, ...productPages, ...boutiquePages, ...eventPages]
}
```

NOTE: Check the actual Event model field names (might be `slug` instead of `id` for URLs). Read the event pages to confirm URL pattern.

- [ ] **Step 2: Create robots.txt**

```typescript
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clubm.cd'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/dashboard/',
        '/mon-business/',
        '/profil/',
        '/kyc/',
        '/achats/',
        '/tickets/',
        '/notifications/',
        '/upgrade/',
        '/checkout/',
        '/login/',
        '/register/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
```

- [ ] **Step 3: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 4: Commit**

```bash
git add app/sitemap.ts app/robots.ts
git commit -m "feat: add dynamic sitemap and robots.txt

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: SEO — dynamic meta tags on public pages

**Files:**
- Modify: `app/(site)/marketplace/page.tsx`
- Modify: `app/(site)/evenements/page.tsx`
- Modify: `app/(site)/evenements/[id]/page.tsx`
- Modify: `app/(site)/annuaires/page.tsx`
- Modify: `app/(site)/contact/page.tsx`
- Modify: `app/(site)/mentions-legales/page.tsx`

- [ ] **Step 1: Add static metadata to listing pages**

For pages that don't need dynamic data, add a simple `metadata` export:

**marketplace/page.tsx:**
```typescript
export const metadata: Metadata = {
  title: 'Marketplace | Club M',
  description: 'Decouvrez les produits et services de nos femmes entrepreneures a Kinshasa.',
}
```

**evenements/page.tsx:**
```typescript
export const metadata: Metadata = {
  title: 'Evenements | Club M',
  description: 'Retrouvez tous les evenements Club M pour femmes entrepreneures a Kinshasa.',
}
```

**annuaires/page.tsx:**
```typescript
export const metadata: Metadata = {
  title: 'Annuaire | Club M',
  description: 'Trouvez les meilleures entrepreneures de Kinshasa dans l\'annuaire Club M.',
}
```

**contact/page.tsx:**
```typescript
export const metadata: Metadata = {
  title: 'Contact | Club M',
  description: 'Contactez l\'equipe Club M pour toute question ou suggestion.',
}
```

**mentions-legales/page.tsx:**
```typescript
export const metadata: Metadata = {
  title: 'Mentions Legales | Club M',
  description: 'Mentions legales de la plateforme Club M.',
}
```

- [ ] **Step 2: Add dynamic metadata to event detail page**

**evenements/[id]/page.tsx:** Add `generateMetadata`:

```typescript
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  // Fetch event data (reuse existing query or light query)
  const event = await db.event.findUnique({
    where: { id },
    select: { title: true, description: true, imageUrl: true },
  })

  if (!event) return { title: 'Evenement | Club M' }

  return {
    title: `${event.title} | Club M`,
    description: event.description?.slice(0, 160) || 'Evenement Club M',
    openGraph: {
      title: event.title,
      description: event.description?.slice(0, 160),
      ...(event.imageUrl ? { images: [event.imageUrl] } : {}),
    },
  }
}
```

NOTE: Check the actual Event model fields and the page's params structure. Next.js 16 may have `params` as a Promise.

- [ ] **Step 3: Verify existing generateMetadata pages**

Read the 3 boutique pages that already have `generateMetadata` and verify they include `openGraph` with images. If not, add OG tags.

- [ ] **Step 4: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 5: Commit**

```bash
git add "app/(site)/marketplace/page.tsx" "app/(site)/evenements/" "app/(site)/annuaires/page.tsx" "app/(site)/contact/page.tsx" "app/(site)/mentions-legales/page.tsx"
git commit -m "feat: add dynamic meta tags to public pages

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Final verification + continuity

- [ ] **Step 1: TypeScript check**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 2: Update continuity files**

Update `SESSION_LOG.md` and `PROJECT_STATE.md`.

- [ ] **Step 3: Commit**

```bash
git add SESSION_LOG.md PROJECT_STATE.md
git commit -m "docs: update continuity files after polish phase

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```
