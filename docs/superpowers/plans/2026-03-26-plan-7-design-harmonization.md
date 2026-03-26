# Design Harmonization + Responsive Mobile — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate 4 design systems into 2 (vitrine light-only + unified dashboard with light/dark toggle) and fix responsive mobile sidebar.

**Architecture:** Fix `next-themes` config (already installed), rewrite `globals.css` variables to hex with proper light/dark, migrate all business components from hardcoded dark to semantic shadcn classes, delete business custom layout/sidebar/navbar, make sidebars responsive with Sheet on mobile.

**Tech Stack:** Next.js 16, Tailwind CSS 4, shadcn/ui, next-themes (already installed)

**Spec:** `docs/superpowers/specs/2026-03-26-design-harmonization-responsive.md`

---

## File Structure

### Files to create
```
components/shared/theme-toggle.tsx        — Sun/Moon toggle button (client component)
components/shared/mobile-sidebar.tsx      — Sheet-based sidebar for mobile (client component)
```

### Files to delete
```
components/business/business-sidebar.tsx  — Replaced by unified member sidebar
components/business/business-navbar.tsx   — No longer needed
components/business/business-layout-shell.tsx — Replaced by member layout
context/sidebar-context.tsx               — Only used by business layout shell (if no other consumers)
```

### Files to heavily modify
```
app/globals.css                           — Rewrite CSS variables (hex, proper light/dark)
providers/theme-provider.tsx              — Fix defaultTheme to "light"
app/(member)/layout.tsx                   — Remove business route skip, add mobile sidebar
app/(member)/mon-business/layout.tsx      — Remove BusinessLayoutShell, keep auth guard only
components/member/member-sidebar.tsx      — Add business links, theme toggle, responsive hide
components/business/kpi-card.tsx          — Semantic classes
components/business/activity-feed.tsx     — Semantic classes
components/business/recent-orders-table.tsx — Semantic classes
components/business/alerts-sidebar.tsx    — Semantic classes
components/business/quick-actions.tsx     — Semantic classes
components/business/revenue-chart.tsx     — Theme-aware chart colors
components/business/orders-status-chart.tsx — Theme-aware chart colors
components/directory/product-form.tsx     — Remove dark hardcoded input/card classes
components/admin/admin-sidebar.tsx        — Add theme toggle, responsive hide
app/(admin)/admin/layout.tsx             — Add mobile sidebar
```

### Files to lightly modify (business pages — remove wrapper classes)
```
app/(member)/mon-business/page.tsx
app/(member)/mon-business/commandes/page.tsx
app/(member)/mon-business/commandes/[id]/page.tsx
app/(member)/mon-business/produits/page.tsx
app/(member)/mon-business/produits/nouveau/page.tsx
app/(member)/mon-business/produits/[id]/page.tsx
app/(member)/mon-business/clients/page.tsx
app/(member)/mon-business/clients/[id]/page.tsx
app/(member)/mon-business/revenus/page.tsx
```

---

## Task 1: CSS Variables — Rewrite globals.css

**Files:**
- Modify: `app/globals.css`
- Modify: `providers/theme-provider.tsx`

- [ ] **Step 1: Fix theme provider default**

In `providers/theme-provider.tsx`, change `defaultTheme="dark"` to `defaultTheme="light"`.

- [ ] **Step 2: Rewrite globals.css `:root` variables**

Replace the entire `:root` block (lines 79-130) with clean hex values. Remove all OKLch overrides. Keep the `--radius`.

```css
:root {
  --radius: 0.625rem;
  --background: #ffffff;
  --foreground: #091626;
  --card: #ffffff;
  --card-foreground: #091626;
  --popover: #ffffff;
  --popover-foreground: #091626;
  --primary: #a55b46;
  --primary-foreground: #ffffff;
  --secondary: #f8f8f8;
  --secondary-foreground: #091626;
  --muted: #f8f8f8;
  --muted-foreground: #717b86;
  --accent: #f8f8f8;
  --accent-foreground: #091626;
  --destructive: #dc2626;
  --border: #e9eef5;
  --input: #e9eef5;
  --ring: #a55b46;
  --chart-1: #a55b46;
  --chart-2: #2563eb;
  --chart-3: #16a34a;
  --chart-4: #f59e0b;
  --chart-5: #8b5cf6;
  --sidebar: #ffffff;
  --sidebar-foreground: #091626;
  --sidebar-primary: #a55b46;
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: #f8f8f8;
  --sidebar-accent-foreground: #091626;
  --sidebar-border: #e9eef5;
  --sidebar-ring: #a55b46;
}
```

- [ ] **Step 3: Rewrite `.dark` block**

Replace the entire `.dark` block (lines 132-183) with:

```css
.dark {
  --background: #0a0a0a;
  --foreground: #fafafa;
  --card: #111111;
  --card-foreground: #fafafa;
  --popover: #111111;
  --popover-foreground: #fafafa;
  --primary: #a55b46;
  --primary-foreground: #ffffff;
  --secondary: #1a1a1a;
  --secondary-foreground: #fafafa;
  --muted: #262626;
  --muted-foreground: #a1a1aa;
  --accent: #262626;
  --accent-foreground: #fafafa;
  --destructive: #ef4444;
  --border: #262626;
  --input: #262626;
  --ring: #a55b46;
  --chart-1: #a55b46;
  --chart-2: #3b82f6;
  --chart-3: #22c55e;
  --chart-4: #fbbf24;
  --chart-5: #a78bfa;
  --sidebar: #0a0a0a;
  --sidebar-foreground: #fafafa;
  --sidebar-primary: #a55b46;
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: #262626;
  --sidebar-accent-foreground: #fafafa;
  --sidebar-border: #262626;
  --sidebar-ring: #a55b46;
}
```

- [ ] **Step 4: Remove custom variables from @theme inline block**

In the `@theme inline` block (lines 6-65), remove all custom business variable mappings:

Delete lines 51-64 (everything from `--color-bgFond` to `--color-colorDarkBlue`).

- [ ] **Step 5: Update .table styles to use semantic variables**

In the `.table` block, replace:
- `var(--colorTitle)` → `var(--foreground)`
- `var(--colorMuted)` → `var(--muted-foreground)`
- `var(--colorBorderTr)` → `var(--border)`

- [ ] **Step 6: Remove .cardShadow dark override**

The `.dark .cardShadow` rule inside the old `.dark` block can be removed (it was `box-shadow: none`). Keep the light `.cardShadow` rule as-is.

- [ ] **Step 7: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 8: Commit**

```bash
git add app/globals.css providers/theme-provider.tsx
git commit -m "feat: rewrite CSS variables to hex with proper light/dark modes"
```

---

## Task 2: Theme toggle component

**Files:**
- Create: `components/shared/theme-toggle.tsx`

- [ ] **Step 1: Create ThemeToggle component**

```tsx
'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <Button
      variant="ghost"
      className="w-full justify-start gap-3 text-muted-foreground"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
    </Button>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 3: Commit**

```bash
git add components/shared/theme-toggle.tsx
git commit -m "feat: add theme toggle component"
```

---

## Task 3: Mobile sidebar component

**Files:**
- Create: `components/shared/mobile-sidebar.tsx`

- [ ] **Step 1: Create MobileSidebar component**

This component renders a hamburger button (visible on mobile only) that opens a Sheet containing the sidebar content.

```tsx
'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

interface MobileSidebarProps {
  children: React.ReactNode
}

export function MobileSidebar({ children }: MobileSidebarProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0" onClick={() => setOpen(false)}>
          {children}
        </SheetContent>
      </Sheet>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 3: Commit**

```bash
git add components/shared/mobile-sidebar.tsx
git commit -m "feat: add mobile sidebar with Sheet"
```

---

## Task 4: Unify member sidebar + responsive + theme toggle

**Files:**
- Modify: `components/member/member-sidebar.tsx`

- [ ] **Step 1: Read current file**

Read `components/member/member-sidebar.tsx` to understand current structure.

- [ ] **Step 2: Add business links, theme toggle, and responsive**

The sidebar needs:
1. Business-specific links when user has PREMIUM/BUSINESS tier (already partially done — add the full set: Commandes, Produits, Clients, Revenus)
2. ThemeToggle at bottom, above Déconnexion
3. `hidden lg:flex` to hide on mobile (MobileSidebar handles mobile)

Add business links after the existing Mon business link:

```tsx
...(memberTier === 'PREMIUM' || memberTier === 'BUSINESS'
  ? [
      { href: '/mon-business', label: 'Vue d\'ensemble', icon: Briefcase },
      { href: '/mon-business/commandes', label: 'Commandes', icon: ShoppingBag },
      { href: '/mon-business/produits', label: 'Produits', icon: Package },
      { href: '/mon-business/clients', label: 'Clients', icon: Users },
      { href: '/mon-business/revenus', label: 'Revenus', icon: BarChart3 },
    ]
  : []),
```

Add `ThemeToggle` import and render it above the Déconnexion button.

Add `hidden lg:flex` to the root `<aside>` className.

- [ ] **Step 3: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 4: Commit**

```bash
git add components/member/member-sidebar.tsx
git commit -m "feat: unify member sidebar with business links, theme toggle, responsive"
```

---

## Task 5: Update member layout — remove business skip, add mobile sidebar

**Files:**
- Modify: `app/(member)/layout.tsx`
- Modify: `app/(member)/mon-business/layout.tsx`

- [ ] **Step 1: Read both files**

Read `app/(member)/layout.tsx` and `app/(member)/mon-business/layout.tsx`.

- [ ] **Step 2: Update member layout**

Remove the `isBusinessRoute` skip logic (lines 28-45 approximately). All member routes (including `/mon-business/*`) now use the member sidebar.

Add MobileSidebar import and render it in a sticky top bar for mobile:

```tsx
import { MobileSidebar } from '@/components/shared/mobile-sidebar'

// In the return:
<div className="flex h-screen">
  <MemberSidebar ... />
  <div className="flex flex-1 flex-col overflow-hidden">
    <header className="flex h-14 items-center gap-3 border-b px-4 lg:hidden">
      <MobileSidebar>
        <MemberSidebar ... />
      </MobileSidebar>
      <span className="text-lg font-bold">Club M</span>
    </header>
    <main className="flex-1 overflow-y-auto p-4 lg:p-6">
      <EmailVerificationBanner ... />
      {children}
    </main>
  </div>
</div>
```

Remove the `headers()` import and `x-pathname` check since we no longer need to detect business routes.

- [ ] **Step 3: Simplify business layout**

In `app/(member)/mon-business/layout.tsx`, remove `BusinessLayoutShell`. Keep only the auth guard:

```tsx
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { hasMinTier } from '@/lib/permissions'

export default async function MonBusinessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { member: true },
  })

  if (!user?.member) redirect('/')
  if (user.member.status === 'SUSPENDED') redirect('/login?error=suspended')
  if (!hasMinTier(user.member.tier, 'PREMIUM')) redirect('/dashboard')

  return <>{children}</>
}
```

- [ ] **Step 4: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 5: Commit**

```bash
git add "app/(member)/layout.tsx" "app/(member)/mon-business/layout.tsx"
git commit -m "feat: unify member layout, remove business layout shell"
```

---

## Task 6: Migrate business components (part 1 — cards and tables)

**Files:**
- Modify: `components/business/kpi-card.tsx`
- Modify: `components/business/alerts-sidebar.tsx`
- Modify: `components/business/recent-orders-table.tsx`
- Modify: `components/business/quick-actions.tsx`
- Modify: `components/business/activity-feed.tsx`

- [ ] **Step 1: Read all 5 files**

Read each file to understand the current structure.

- [ ] **Step 2: Migrate kpi-card.tsx**

Replace all hardcoded dark classes:
- `bg-[#1a1a24]` → `bg-card`
- `bg-[#1e1e2a]` → `hover:bg-accent`
- `border-white/[0.06]` → `border-border`
- `text-white` → `text-card-foreground`
- `text-white/60` → `text-muted-foreground`

- [ ] **Step 3: Migrate alerts-sidebar.tsx**

Same pattern:
- `bg-[#1a1a24]` → `bg-card`
- `text-white` → `text-card-foreground`
- `text-white/80` → `text-foreground`
- `border-amber-500/20` → keep (semantic color, works in both themes)
- `border-orange-500/20` → keep

- [ ] **Step 4: Migrate recent-orders-table.tsx**

- `text-white` → `text-foreground`
- `text-white/20` → `text-muted-foreground`
- `border-white/[0.06]` → `border-border`
- `divide-white/[0.06]` → `divide-border`
- `hover:bg-white/[0.02]` → `hover:bg-muted/50`

- [ ] **Step 5: Migrate quick-actions.tsx**

- `border-white/[0.06]` → `border-border`
- `text-white/70` → `text-muted-foreground`
- `text-white` → `text-foreground`

- [ ] **Step 6: Migrate activity-feed.tsx**

- `text-white` → `text-foreground`
- `text-white/60` → `text-muted-foreground`
- `text-white/30` → `text-muted-foreground/50`
- `bg-white/5` → `bg-muted`
- `bg-white/20` → `bg-muted-foreground`
- `bg-white/[0.06]` → `border-border`

- [ ] **Step 7: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 8: Commit**

```bash
git add components/business/kpi-card.tsx components/business/alerts-sidebar.tsx components/business/recent-orders-table.tsx components/business/quick-actions.tsx components/business/activity-feed.tsx
git commit -m "feat: migrate business cards and tables to semantic classes"
```

---

## Task 7: Migrate business components (part 2 — charts)

**Files:**
- Modify: `components/business/revenue-chart.tsx`
- Modify: `components/business/orders-status-chart.tsx`

- [ ] **Step 1: Read both chart files**

- [ ] **Step 2: Migrate revenue-chart.tsx**

Replace hardcoded chart colors:
- Tooltip `backgroundColor: '#1a1a24'` → `backgroundColor: 'hsl(var(--card))'`
- Tooltip `border: '1px solid rgba(255,255,255,0.1)'` → `border: '1px solid hsl(var(--border))'`
- Tooltip `color: '#fff'` → `color: 'hsl(var(--card-foreground))'`
- Grid stroke: use `hsl(var(--border))`
- Keep the gradient colors (`#8b5cf6`) — they're accent colors that work in both themes

- [ ] **Step 3: Migrate orders-status-chart.tsx**

Same tooltip pattern:
- `backgroundColor: '#1a1a24'` → `backgroundColor: 'hsl(var(--card))'`
- `border: '1px solid rgba(255,255,255,0.1)'` → `border: '1px solid hsl(var(--border))'`
- `color: '#fff'` → `color: 'hsl(var(--card-foreground))'`
- `text-white` in center label → `text-foreground`

- [ ] **Step 4: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 5: Commit**

```bash
git add components/business/revenue-chart.tsx components/business/orders-status-chart.tsx
git commit -m "feat: migrate business charts to theme-aware colors"
```

---

## Task 8: Migrate product form

**Files:**
- Modify: `components/directory/product-form.tsx`

- [ ] **Step 1: Read the file**

Read `components/directory/product-form.tsx`.

- [ ] **Step 2: Replace dark hardcoded classes**

The product form has ~15 instances of dark classes:

Card wrapper:
- `bg-[#1a1a24]` → `bg-card`
- `border-white/[0.06]` → `border-border`
- `text-white` → `text-card-foreground`

All Input/Textarea classes:
- `border-white/[0.06] bg-white/[0.03] text-white placeholder:text-muted-foreground/50 focus-visible:border-[#8b5cf6]/50 focus-visible:ring-[#8b5cf6]/20` → Remove entirely (use default shadcn Input styling)

Select components:
- `border-white/[0.06] bg-white/[0.03] text-white` on SelectTrigger → Remove (use default)
- `border-white/[0.06] bg-[#1a1a24]` on SelectContent → Remove (use default)

Submit button:
- `bg-[#8b5cf6] ... hover:bg-[#7c3aed] ... shadow-purple-500/20` → `bg-primary text-primary-foreground hover:bg-primary/90`

Label classes:
- `text-sm text-muted-foreground` → Keep (already semantic)

Error text:
- `text-red-400` → `text-destructive`

- [ ] **Step 3: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 4: Commit**

```bash
git add components/directory/product-form.tsx
git commit -m "feat: migrate product form to semantic theme classes"
```

---

## Task 9: Migrate business pages (remove dark wrapper classes)

**Files:**
- Modify: all 9 pages in `app/(member)/mon-business/`

- [ ] **Step 1: Read all business pages**

Read each page file to identify dark hardcoded classes (e.g., `text-white`, `bg-[#...]`, etc.).

- [ ] **Step 2: Replace dark classes in each page**

For each page, replace:
- `text-white` → `text-foreground`
- `text-white/60` or similar → `text-muted-foreground`
- `bg-[#1a1a24]` → `bg-card`
- `border-white/[0.06]` → `border-border`
- Any other hardcoded dark classes → semantic equivalents

Note: Some pages may be clean if they delegate all rendering to components (already migrated in Tasks 6-8). Check each one.

- [ ] **Step 3: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 4: Commit**

```bash
git add "app/(member)/mon-business/"
git commit -m "feat: migrate business pages to semantic theme classes"
```

---

## Task 10: Update admin sidebar + layout for responsive + theme toggle

**Files:**
- Modify: `components/admin/admin-sidebar.tsx`
- Modify: `app/(admin)/admin/layout.tsx` (or `app/(admin)/layout.tsx`)

- [ ] **Step 1: Read both files**

- [ ] **Step 2: Update admin sidebar**

Add `ThemeToggle` above the Déconnexion button (same pattern as member sidebar).
Add `hidden lg:flex` to root `<aside>`.

- [ ] **Step 3: Update admin layout**

Add MobileSidebar with the same pattern as the member layout:

```tsx
<header className="flex h-14 items-center gap-3 border-b px-4 lg:hidden">
  <MobileSidebar>
    <AdminSidebar />
  </MobileSidebar>
  <span className="text-lg font-bold">Club M Admin</span>
</header>
```

- [ ] **Step 4: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 5: Commit**

```bash
git add components/admin/admin-sidebar.tsx "app/(admin)/admin/layout.tsx"
git commit -m "feat: add theme toggle and mobile responsive to admin sidebar"
```

---

## Task 11: Delete old business components + cleanup

**Files:**
- Delete: `components/business/business-sidebar.tsx`
- Delete: `components/business/business-navbar.tsx`
- Delete: `components/business/business-layout-shell.tsx`
- Check: `context/sidebar-context.tsx` (delete if no other consumers)

- [ ] **Step 1: Check sidebar-context.tsx consumers**

Search for imports of `sidebar-context` across the codebase. If only `business-layout-shell.tsx` imports it, delete it.

- [ ] **Step 2: Delete files**

```bash
rm components/business/business-sidebar.tsx
rm components/business/business-navbar.tsx
rm components/business/business-layout-shell.tsx
# rm context/sidebar-context.tsx  (if no other consumers)
```

- [ ] **Step 3: Verify no broken imports**

Run: `npx tsc --noEmit --skipLibCheck`

Fix any remaining imports that reference deleted files.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: delete old business sidebar, navbar, and layout shell"
```

---

## Task 12: Responsive fixes — grids and tables

**Files:**
- Modify: business dashboard page (KPIs grid)
- Modify: member dashboard pages (stats grid)
- Modify: admin dashboard (KPIs grid)
- Modify: any table components missing `overflow-x-auto`

- [ ] **Step 1: Audit grid breakpoints**

Read the following pages and check their grid classes:
- `app/(member)/mon-business/page.tsx` (business dashboard KPIs)
- `app/(member)/dashboard/page.tsx` and related dashboard components
- `app/(admin)/admin/dashboard/page.tsx`

- [ ] **Step 2: Fix grid breakpoints**

Ensure all KPI/stat grids use: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`

- [ ] **Step 3: Add overflow-x-auto to tables**

For any table that doesn't already have a scroll wrapper, add:
```tsx
<div className="overflow-x-auto">
  <table>...</table>
</div>
```

Check: admin members, admin orders, admin payments, business orders, business clients tables.

- [ ] **Step 4: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: fix responsive grids and table scroll on mobile"
```

---

## Task 13: Final verification + continuity

- [ ] **Step 1: TypeScript check**

Run: `npx tsc --noEmit --skipLibCheck`

Expected: 0 errors.

- [ ] **Step 2: Visual testing**

Start dev server (`npm run dev`) and verify:
- `/dashboard` — light mode by default, theme toggle works
- `/mon-business` — same sidebar as member, content renders correctly in both themes
- `/admin/dashboard` — theme toggle works, responsive sidebar
- Mobile viewport — hamburger menu opens Sheet with sidebar
- Site vitrine — always light, no toggle visible

- [ ] **Step 3: Update continuity files**

Update `SESSION_LOG.md` and `PROJECT_STATE.md`.

- [ ] **Step 4: Commit**

```bash
git add SESSION_LOG.md PROJECT_STATE.md
git commit -m "docs: update continuity files after design harmonization"
```
