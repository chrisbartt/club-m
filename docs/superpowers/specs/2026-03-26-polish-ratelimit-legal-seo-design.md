# Rate Limiting + Pages Légales + SEO — Spec

**Date:** 2026-03-26
**Status:** Approved
**Scope:** Chantiers #20 (rate limiting), #21 (pages légales), #22 (SEO) du NEXT_STEPS.md

---

## Goal

Add in-memory rate limiting on auth endpoints, static legal pages, and dynamic SEO (meta tags, sitemap, robots.txt) to prepare the platform for production.

## 1. Rate Limiting

### Approach

In-memory rate limiter using a `Map` — no external dependency (Redis/Upstash) for MVP.

### Protected endpoints

| Endpoint | Limit | Window | Key |
|----------|-------|--------|-----|
| Login (loginMember) | 5 attempts | 15 min | IP address |
| Register (registerMember) | 3 registrations | 1 hour | IP address |
| Forgot password (requestPasswordReset) | 3 requests | 1 hour | Email |

### Implementation

- `lib/rate-limit.ts` — generic helper: `rateLimit(key: string, limit: number, windowMs: number): { success: boolean, remaining: number }`
- Uses `Map<string, { count: number, resetAt: number }>` with auto-cleanup of expired entries
- Applied in server actions before any DB query
- On limit exceeded: return `{ success: false, error: 'RATE_LIMITED' }` — no throw

### Getting IP in server actions

Use `headers()` from `next/headers` to read `x-forwarded-for` or `x-real-ip`. Fallback to `'unknown'`.

## 2. Pages Légales

### Pages

| Route | Title | Content |
|-------|-------|---------|
| `/cgu` | Conditions Générales d'Utilisation | Générique, adapté RDC/Kinshasa, Club M, e-commerce |
| `/confidentialite` | Politique de Confidentialité | Données collectées, usage, droits |
| `/mentions-legales` | Mentions Légales | Déjà existante — vérifier/compléter |

### Structure

- Server components in `app/(site)/cgu/page.tsx`, `app/(site)/confidentialite/page.tsx`
- Reuse `AppContainerWebSite` layout
- Add links to footer
- Content is placeholder text (to be validated by a lawyer before production)

## 3. SEO

### Dynamic meta tags

Add or complete `generateMetadata` on all public pages:

| Page | Title Pattern | Description | OG Image |
|------|--------------|-------------|----------|
| Homepage | "Club M — Communaute Femmes Entrepreneures" | Static | None (or default) |
| Product detail | "{productName} — {businessName} \| Club M" | Product description (truncated 160 chars) | First product image |
| Boutique | "{businessName} \| Club M" | Business description (truncated) | Cover image |
| Event | "{eventTitle} \| Club M" | Event description | Event image |
| Marketplace | "Marketplace \| Club M" | Static | None |

### Sitemap

`app/sitemap.ts` — Next.js convention, returns `MetadataRoute.Sitemap`:

- Static pages: /, /marketplace, /evenements, /annuaires, /cgu, /confidentialite, /mentions-legales
- Dynamic: active products, approved boutiques, upcoming events
- Fetched from DB at build/request time

### Robots.txt

`app/robots.ts` — Next.js convention, returns `MetadataRoute.Robots`:

```
User-Agent: *
Allow: /
Disallow: /admin/
Disallow: /dashboard/
Disallow: /mon-business/
Disallow: /profil/
Disallow: /kyc/
Disallow: /achats/
Disallow: /tickets/
Disallow: /notifications/
Disallow: /upgrade/
Sitemap: https://clubm.cd/sitemap.xml
```

## Out of Scope

- Redis/Upstash rate limiting (in-memory sufficient for MVP)
- Generated OG images (use existing product/business images)
- Schema.org / JSON-LD structured data
- Canonical URLs
- i18n / hreflang tags
