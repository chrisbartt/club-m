# Design Harmonization + Responsive Mobile — Spec

**Date:** 2026-03-26
**Status:** Approved
**Scope:** Chantiers #11 (harmoniser le design) et #12 (responsive mobile) du NEXT_STEPS.md

---

## Goal

Consolidate 4 fragmented design systems into 2 coherent ones:

1. **Vitrine** (site public) — light only, semantic CSS variables
2. **Dashboard** (member + business + admin) — unified shadcn/ui with light/dark toggle via `next-themes`

Simultaneously fix responsive layout issues on mobile (sidebar collapse, grid breakpoints).

## Decisions

- Light/dark toggle in member, business, admin. Site vitrine stays light only.
- Everyone starts in light mode by default. Users choose their theme (persisted in localStorage).
- Business dashboard loses its custom dark identity (navy sidebar, dotted pattern, custom cards). It uses the exact same component system as member/admin.
- Primary color everywhere: `#a55b46` (terracotta Club M).

## Architecture

### Theme System

- Install `next-themes` (standard for Next.js App Router)
- `ThemeProvider` wraps `app/(member)/layout.tsx` and `app/(admin)/admin/layout.tsx`
- Site vitrine has no provider → always light
- Theme preference shared across member/business/admin via localStorage

### CSS Variables (globals.css)

Single set of variables, 2 modes:

| Variable | Light | Dark |
|----------|-------|------|
| `--background` | `#ffffff` | `#0a0a0a` |
| `--foreground` | `#091626` | `#fafafa` |
| `--card` | `#ffffff` | `#111111` |
| `--card-foreground` | `#091626` | `#fafafa` |
| `--primary` | `#a55b46` | `#a55b46` |
| `--primary-foreground` | `#ffffff` | `#ffffff` |
| `--muted` | `#f8f8f8` | `#262626` |
| `--muted-foreground` | `#717b86` | `#a1a1aa` |
| `--border` | `#e9eef5` | `#262626` |
| `--accent` | `#f8f8f8` | `#262626` |
| `--destructive` | (keep current) | (keep current) |

### What Gets Deleted

- `components/business/business-sidebar.tsx` — replaced by unified sidebar
- `components/business/business-navbar.tsx` — replaced by unified layout
- `app/(member)/mon-business/layout.tsx` — business routes use the member layout
- Custom CSS variables in globals.css: `--bgSidebar`, `--bgNavbar`, `--colorTitle`, `--colorMuted`, `--primaryColor`, etc.

### What Gets Created

- `components/shared/theme-toggle.tsx` — Sun/Moon button using `next-themes`
- `components/shared/theme-provider.tsx` — wrapper around `next-themes` ThemeProvider
- `components/shared/mobile-sidebar.tsx` — Sheet-based sidebar for mobile

## Components Migration

### Business Dashboard (heavy)

| File | Before | After |
|------|--------|-------|
| `components/business/kpi-card.tsx` | `bg-[#1a1a24] border-white/[0.06]` | `<Card>` shadcn standard |
| All `/mon-business/*` pages | Dark hardcoded classes | Semantic classes (`bg-card`, `text-foreground`, `border-border`) |
| `components/directory/product-form.tsx` | Dark input classes `bg-white/[0.03] border-white/[0.06]` | Standard shadcn Input/Textarea |

### Site Vitrine (cosmetic)

Replace hardcoded hex values with semantic Tailwind classes:
- `text-[#091626]` → `text-foreground`
- `text-[#717b86]` → `text-muted-foreground`
- `bg-[#a55b46]` → `bg-primary`
- `text-[#a55b46]` → `text-primary`
- `border-[#e9eef5]` → `border-border`

No structural changes.

### Member/Admin (minimal)

- Add `ThemeProvider` wrapper
- Add `ThemeToggle` button in sidebar (bottom, next to logout)
- Replace any remaining hardcoded colors

## Sidebar Unification

### Desktop (`lg+`)
- `w-64`, fixed, `border-r bg-background`
- Same component for member and admin (different links)
- Business routes reuse the member sidebar with business-specific links

### Mobile (`< lg`)
- Sidebar hidden
- Hamburger button (Menu icon) visible in a sticky top bar
- Sidebar content rendered inside a `Sheet` component (slide from left)
- Sheet closes on link click

### ThemeToggle Placement
- Bottom of sidebar, above "Déconnexion" button
- Sun icon in dark mode, Moon icon in light mode

## Responsive Fixes

### What changes
- Sidebar: hidden on mobile, Sheet slide-over
- Dashboard KPIs: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- Marketplace grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Tables: horizontal scroll wrapper on mobile (`overflow-x-auto`)

### What stays
- Site vitrine: already has mobile-nav with Sheet
- Forms: naturally responsive (vertical stack)
- Checkout: already single-column

## Out of Scope

- Dark mode for site vitrine
- Redesigning the vitrine layout/structure
- New UI components or features
- Recharts theme adaptation (charts keep their current colors)
