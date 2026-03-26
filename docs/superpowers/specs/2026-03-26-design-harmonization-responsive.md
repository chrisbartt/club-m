# Design Harmonization + Responsive Mobile — Spec

**Date:** 2026-03-26
**Status:** Approved (revised after review)
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

- `next-themes` is already installed. `providers/theme-provider.tsx` already exists.
- **Fix:** Change `defaultTheme` from `"dark"` to `"light"` in `providers/theme-provider.tsx`.
- The root layout already wraps with `ThemeProvider` — member, business and admin inherit it automatically.
- Site vitrine inherits it too, but since no toggle is exposed, it stays light for users.
- Theme preference is shared across all dashboards via localStorage (single key).

### CSS Variables (globals.css)

Replace current OKLch values with hex values. Single set of variables, 2 modes:

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

#### Variable Migration Table (old → new)

| Old Custom Variable | Used In | Replacement |
|---------------------|---------|-------------|
| `--bgSidebar` (`#091626`) | business-sidebar.tsx | `bg-background` |
| `--bgNavbar` (`#171a1e`) | business-navbar.tsx | `bg-background/95 backdrop-blur` |
| `--bgFond` (`#0d0f11`) | business-layout-shell.tsx | `bg-background` |
| `--colorTitle` (`#091626`) | globals.css table styles | `text-foreground` |
| `--colorMuted` (`#717b86`) | globals.css table styles | `text-muted-foreground` |
| `--primaryColor` (`#a55b46`) | business components | `bg-primary` / `text-primary` |

**Order:** Migrate all usages FIRST, then delete the old variables.

### What Gets Deleted

- `components/business/business-sidebar.tsx` — replaced by unified member sidebar with business links
- `components/business/business-navbar.tsx` — removed, no separate navbar needed
- `app/(member)/mon-business/layout.tsx` — removed, member layout handles business routes too
- `components/business/business-layout-shell.tsx` — removed
- Custom CSS variables in globals.css: `--bgSidebar`, `--bgNavbar`, `--bgFond`, `--colorTitle`, `--colorMuted`, `--primaryColor`

### What Gets Created

- `components/shared/theme-toggle.tsx` — Sun/Moon button using `next-themes`
- `components/shared/mobile-sidebar.tsx` — Sheet-based sidebar for mobile (reuses Sheet from shadcn)

### What Already Exists (no need to create)

- `providers/theme-provider.tsx` — already exists, just fix `defaultTheme`
- `next-themes` — already installed

## Components Migration

### Business Dashboard (heavy — 9+ files)

| File | Before | After |
|------|--------|-------|
| `components/business/kpi-card.tsx` | `bg-[#1a1a24] border-white/[0.06]` | `<Card>` shadcn with `bg-card border` |
| `components/business/alerts-sidebar.tsx` | `bg-[#1a1a24] border-*-500/20` | `<Card>` with semantic colors |
| `components/business/activity-feed.tsx` | White text, dark backgrounds | `text-foreground bg-card` |
| `components/business/recent-orders-table.tsx` | `bg-white/5 border-white/10` | `bg-muted border-border` |
| `components/business/quick-actions.tsx` | `border-white/[0.06] text-white/70` | `border-border text-muted-foreground` |
| `components/business/revenue-chart.tsx` | `stroke="rgba(255,255,255,0.06)"` hardcoded | Use CSS variable or theme-aware stroke |
| `components/directory/product-form.tsx` | `bg-white/[0.03] border-white/[0.06]` dark inputs | Standard shadcn Input/Textarea (already partially done in Phase 2A) |
| All `/mon-business/*` pages | Dark hardcoded classes | Semantic classes (`bg-card`, `text-foreground`, `border-border`) |

### Recharts Theme Fix

`components/business/revenue-chart.tsx` uses hardcoded white/dark strokes and fills. These must be updated to use theme-aware values:
- Grid stroke: `stroke="rgba(255,255,255,0.06)"` → use `hsl(var(--border))` or conditional
- Text fills: hardcoded white → `hsl(var(--foreground))`
- Tooltip: dark background → `bg-card border-border`

### Site Vitrine (cosmetic — ~20 files)

Replace hardcoded hex values with semantic Tailwind classes:
- `text-[#091626]` → `text-foreground`
- `text-[#717b86]` → `text-muted-foreground`
- `bg-[#a55b46]` → `bg-primary`
- `text-[#a55b46]` → `text-primary`
- `border-[#e9eef5]` → `border-border`
- `bg-[#f8f8f8]` → `bg-muted`
- `bg-[#a55b46]/5` → `bg-primary/5`
- `hover:bg-[#a55b46]/80` → `hover:bg-primary/80`

No structural changes. The vitrine stays light-only — these semantic classes just happen to resolve to the same colors in light mode.

### Member/Admin (minimal)

- Add `ThemeToggle` button in sidebar (bottom, above logout)
- Replace any remaining hardcoded colors

## Sidebar Unification

### Strategy

The member sidebar (`components/member/member-sidebar.tsx`) becomes the single sidebar for member AND business routes:
- It already conditionally shows business links when `memberTier === 'PREMIUM' || 'BUSINESS'`
- The member layout (`app/(member)/layout.tsx`) currently skips sidebar for `/mon-business` routes — **remove this skip**
- Business-specific links (Commandes, Produits, Clients, Revenus) are added to the sidebar when the user has a business profile

The admin sidebar (`components/admin/admin-sidebar.tsx`) stays separate (different links) but uses the same styling pattern.

### Desktop (`lg+`)
- `w-64`, fixed, `border-r bg-background`
- Hidden class: `hidden lg:flex`

### Mobile (`< lg`)
- Sidebar hidden
- Sticky top bar with: hamburger button (Menu icon) + "Club M" title
- Sidebar content rendered inside a `Sheet` component (slide from left)
- Sheet closes on link click

### ThemeToggle Placement
- Bottom of sidebar, above "Déconnexion" button
- Sun icon in dark mode, Moon icon in light mode

## Responsive Fixes

### Pages requiring grid updates

| Page/Component | Current Grid | Target Grid |
|----------------|-------------|-------------|
| Business dashboard KPIs | Unknown breakpoints | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` |
| Member dashboard stats | `sm:grid-cols-2` | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` |
| Marketplace product grid | `lg:grid-cols-3` | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` |
| Admin dashboard KPIs | Unknown | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` |
| Business clients grid | Unknown | `grid-cols-1 sm:grid-cols-2` |

### Tables
- All data tables get `overflow-x-auto` wrapper on mobile
- Affected: admin members, admin orders, admin payments, business orders, business clients

### What stays
- Site vitrine: already has mobile-nav with Sheet
- Forms: naturally responsive (vertical stack)
- Checkout: already single-column

## Out of Scope

- Dark mode for site vitrine (no toggle exposed)
- Redesigning the vitrine layout/structure
- New UI components or features
