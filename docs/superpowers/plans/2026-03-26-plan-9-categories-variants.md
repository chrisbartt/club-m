# Categories + Product Variants — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add formal admin-managed product categories and single-axis product variants (size/color) with per-variant pricing and stock.

**Architecture:** 2 new Prisma models (Category, ProductVariant), migrate existing string categories to Category records, update product form with category select + variant management, update cart/checkout/order flow to handle variants, add admin category CRUD page.

**Tech Stack:** Next.js 16, Prisma 7, Zod 4, Tailwind CSS 4, shadcn/ui

**Spec:** `docs/superpowers/specs/2026-03-26-categories-variants-design.md`

---

## File Structure

### New files
```
domains/categories/queries.ts           — getCategories, getActiveCategories, getCategoryBySlug
domains/categories/actions.ts           — createCategory, updateCategory, toggleCategory
domains/categories/validators.ts        — Zod schemas
app/(admin)/admin/categories/page.tsx   — Admin category CRUD page
components/admin/category-form.tsx      — Create/edit category form (client)
components/orders/variant-selector.tsx  — Variant picker for product page (client)
components/directory/variant-manager.tsx — Variant CRUD in product form (client)
```

### Modified files
```
prisma/schema.prisma                    — Add Category, ProductVariant models, update Product, OrderItem
domains/business/validators.ts          — Update product schemas for categoryId + variants
domains/business/actions.ts             — Update createProduct/updateProduct for categoryId + variants
domains/marketplace/queries.ts          — Update category queries to use Category table
domains/orders/actions.ts               — Variant-aware stock decrement + OrderItem variant fields
components/directory/product-form.tsx   — Category select + variants section
components/boutique/store-catalog.tsx   — Category filter tabs
components/marketplace/marketplace-filters.tsx — Category from Category table
app/(site)/boutique/[slug]/produit/[productId]/page.tsx — Variant selector
context/cart-context.tsx                — Add variant fields to CartItem
components/admin/admin-sidebar.tsx      — Add Categories link
```

---

## Task 1: Prisma schema — Category + ProductVariant models

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add Category model**

Add before the Product model:

```prisma
model Category {
  id        String    @id @default(cuid())
  name      String    @unique
  slug      String    @unique
  isActive  Boolean   @default(true)
  createdAt DateTime  @default(now())

  products  Product[]
}
```

- [ ] **Step 2: Update Product model**

Replace `category String?` with:
```prisma
  categoryId  String?
  category    Category?  @relation(fields: [categoryId], references: [id])
```

Add relation:
```prisma
  variants    ProductVariant[]
```

- [ ] **Step 3: Add ProductVariant model**

Add after Product model:

```prisma
model ProductVariant {
  id        String   @id @default(cuid())
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  label     String
  sku       String?
  price     Decimal?
  stock     Int      @default(0)
  isActive  Boolean  @default(true)
  position  Int      @default(0)
  createdAt DateTime @default(now())

  orderItems OrderItem[]

  @@unique([productId, label])
  @@index([productId, isActive])
}
```

- [ ] **Step 4: Update OrderItem model**

Add to OrderItem:
```prisma
  variantId    String?
  variant      ProductVariant? @relation(fields: [variantId], references: [id])
  variantLabel String?
```

- [ ] **Step 5: Run migration**

Run: `npx prisma db push`

Then: `npx prisma generate`

- [ ] **Step 6: Commit**

```bash
git add prisma/
git commit -m "feat: add Category and ProductVariant models, update Product and OrderItem

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Migrate existing categories to Category table

**Files:**
- No new files — run a migration script

- [ ] **Step 1: Create and run seed script for categories**

Create a one-time script or add to the existing seed. Extract distinct non-null `product.category` values, create Category records for each, then update products to link via categoryId.

Run in a Node script or via `npx prisma db execute`:

```typescript
// Can be done in seed.ts or a standalone script
const products = await db.product.findMany({
  where: { category: { not: null } },
  select: { id: true, category: true },
  distinct: ['category'],
})

for (const p of products) {
  if (!p.category) continue
  const slug = p.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const cat = await db.category.upsert({
    where: { name: p.category },
    update: {},
    create: { name: p.category, slug },
  })
  await db.product.updateMany({
    where: { category: p.category },
    data: { categoryId: cat.id },
  })
}
```

This can be added as a temporary migration block in `prisma/seed.ts` or run as a standalone script. After running, verify categories exist.

- [ ] **Step 2: Verify migration**

Check that products have categoryId set and Category records exist.

- [ ] **Step 3: Commit**

```bash
git add prisma/seed.ts
git commit -m "feat: migrate existing product categories to Category table

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Categories domain (queries, actions, validators)

**Files:**
- Create: `domains/categories/validators.ts`
- Create: `domains/categories/queries.ts`
- Create: `domains/categories/actions.ts`

- [ ] **Step 1: Create validators**

```typescript
import { z } from 'zod/v4'

export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
})

export const updateCategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
})
```

Note: Check the exact Zod 4 import pattern used in the project (may be `zod` or `zod/v4`). Read an existing validator file to confirm.

- [ ] **Step 2: Create queries**

```typescript
import { db } from '@/lib/db'

export async function getCategories() {
  return db.category.findMany({
    orderBy: { name: 'asc' },
  })
}

export async function getActiveCategories() {
  return db.category.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  })
}

export async function getCategoriesWithProductCount() {
  return db.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } },
  })
}
```

- [ ] **Step 3: Create actions**

Server actions with 'use server' directive:

- `createCategory(input)` — requireAdmin, validate, generate slug from name (lowercase, replace spaces with hyphens), create category
- `updateCategory(input)` — requireAdmin, validate, regenerate slug, update
- `toggleCategory(categoryId)` — requireAdmin, toggle isActive

Slug generation: `name.toLowerCase().replace(/[^a-z0-9àâäéèêëïîôùûüç]+/g, '-').replace(/(^-|-$)/g, '')`

All follow project pattern: `{ success: true, data } | { success: false, error }`

- [ ] **Step 4: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 5: Commit**

```bash
git add domains/categories/
git commit -m "feat: add categories domain with queries, actions, validators

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Admin categories page

**Files:**
- Create: `components/admin/category-form.tsx`
- Create: `app/(admin)/admin/categories/page.tsx`
- Modify: `components/admin/admin-sidebar.tsx`

- [ ] **Step 1: Create CategoryForm client component**

Simple form with name input. On submit calls createCategory or updateCategory. Supports create and edit modes.

- [ ] **Step 2: Create admin categories page**

Server component:
- requireAdmin()
- Fetch categories with product count via getCategoriesWithProductCount()
- Render list with: name, slug, product count, active toggle, edit button
- CategoryForm at top for creating new categories
- Each row has a toggle button (calls toggleCategory) and inline edit

- [ ] **Step 3: Add Categories link to admin sidebar**

In `components/admin/admin-sidebar.tsx`, add after Annuaire (before Produits):

```typescript
{ href: '/admin/categories', label: 'Categories', icon: Tag },
```

Add `Tag` to lucide-react import.

- [ ] **Step 4: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 5: Commit**

```bash
git add components/admin/category-form.tsx "app/(admin)/admin/categories/page.tsx" components/admin/admin-sidebar.tsx
git commit -m "feat: add admin categories CRUD page

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Update product form — category select + variant manager

**Files:**
- Modify: `domains/business/validators.ts`
- Modify: `domains/business/actions.ts`
- Create: `components/directory/variant-manager.tsx`
- Modify: `components/directory/product-form.tsx`

- [ ] **Step 1: Update product validators**

In `domains/business/validators.ts`:

Update `createProductSchema`:
- Replace `category: z.string().optional()` with `categoryId: z.string().optional()`
- Add `variants` field:
```typescript
variants: z.array(z.object({
  label: z.string().min(1).max(50),
  sku: z.string().max(50).optional(),
  price: z.number().min(0).optional(),
  stock: z.number().int().min(0),
  position: z.number().int().min(0).optional(),
})).optional(),
```

Same for updateProductSchema.

- [ ] **Step 2: Update product actions**

In `domains/business/actions.ts`:

**createProduct:** After creating the product, if `variants` array is provided, create each variant with `label.trim().toUpperCase()` normalization:

```typescript
if (data.variants && data.variants.length > 0) {
  await Promise.all(
    data.variants.map((v, i) =>
      db.productVariant.create({
        data: {
          productId: product.id,
          label: v.label.trim().toUpperCase(),
          sku: v.sku || null,
          price: v.price ?? null,
          stock: v.stock,
          position: v.position ?? i,
        },
      })
    )
  )
}
```

**updateProduct:** Delete existing variants and recreate (simplest approach for MVP):

```typescript
if (data.variants !== undefined) {
  await db.productVariant.deleteMany({ where: { productId: id } })
  if (data.variants.length > 0) {
    await Promise.all(
      data.variants.map((v, i) =>
        db.productVariant.create({
          data: {
            productId: id,
            label: v.label.trim().toUpperCase(),
            sku: v.sku || null,
            price: v.price ?? null,
            stock: v.stock,
            position: v.position ?? i,
          },
        })
      )
    )
  }
}
```

Also change `category: data.category` to `categoryId: data.categoryId` in the product create/update data.

- [ ] **Step 3: Create VariantManager client component**

`components/directory/variant-manager.tsx`:

Props: `variants`, `onChange` callback.

UI: List of variant rows with inputs for label, price (optional), stock, position. Add/remove buttons. Each row is editable inline.

- [ ] **Step 4: Update product form**

In `components/directory/product-form.tsx`:

Read the file first. Then:

1. Replace the free-text category Input with a Select populated by active categories. The form needs to receive `categories` as a prop (fetched by the parent page).
2. Add a "Ce produit a des variantes" checkbox
3. When checked, show VariantManager component
4. When unchecked, show standard stock field (existing behavior)
5. Update form submission to include `categoryId` instead of `category` and `variants` array

- [ ] **Step 5: Update product pages to pass categories**

The pages that render ProductForm need to fetch and pass active categories:
- `app/(member)/mon-business/produits/nouveau/page.tsx`
- `app/(member)/mon-business/produits/[id]/page.tsx`

Add: `const categories = await getActiveCategories()` and pass as prop.

Also, for the edit page, fetch existing variants and pass as `defaultValues.variants`.

- [ ] **Step 6: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 7: Commit**

```bash
git add domains/business/validators.ts domains/business/actions.ts components/directory/variant-manager.tsx components/directory/product-form.tsx "app/(member)/mon-business/produits/"
git commit -m "feat: update product form with category select and variant manager

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Update marketplace queries and filters for Category table

**Files:**
- Modify: `domains/marketplace/queries.ts`
- Modify: `components/marketplace/marketplace-filters.tsx`
- Modify: `app/(site)/marketplace/page.tsx`

- [ ] **Step 1: Update marketplace queries**

In `domains/marketplace/queries.ts`:

**getProductCategories** — replace the distinct query with a Category table query:
```typescript
export async function getProductCategories() {
  const categories = await db.category.findMany({
    where: {
      isActive: true,
      products: { some: { isActive: true, business: approvedStoreBusiness } },
    },
    orderBy: { name: 'asc' },
    select: { id: true, name: true, slug: true },
  })
  return categories
}
```

**getMarketplaceProducts** — update the category filter:
Replace `where.category = filters.category` with `where.categoryId = filters.category` (where filters.category is now the category ID).

OR better: filter by category slug for cleaner URLs:
```typescript
if (filters?.category) {
  where.category = { slug: filters.category }
}
```

This depends on how the filter passes the value. Read the current implementation to decide.

- [ ] **Step 2: Update marketplace filters component**

In `components/marketplace/marketplace-filters.tsx`:

The categories prop changes from `string[]` to `{ id: string, name: string, slug: string }[]`.

Update the select to use slug as value and name as display:
```tsx
{categories.map((cat) => (
  <option key={cat.slug} value={cat.slug}>
    {cat.name}
  </option>
))}
```

- [ ] **Step 3: Update marketplace page**

In `app/(site)/marketplace/page.tsx`:

If needed, update how categories are passed to the filters component (should now be objects instead of strings).

- [ ] **Step 4: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 5: Commit**

```bash
git add domains/marketplace/queries.ts components/marketplace/marketplace-filters.tsx "app/(site)/marketplace/page.tsx"
git commit -m "feat: update marketplace to use Category table for filtering

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Store catalog — category filter tabs

**Files:**
- Modify: `components/boutique/store-catalog.tsx`

- [ ] **Step 1: Read the file**

Read `components/boutique/store-catalog.tsx`.

- [ ] **Step 2: Add category filter tabs**

Currently the catalog has tabs for "Tous", "Produits", "Services". Add category-based filtering within the products view.

Add a row of category pills/buttons below the main tabs. Extract unique categories from the products array. When a category is selected, filter the displayed products.

The products passed to the component already have `categoryId` and `category` relation. If the parent page includes the category relation, use `product.category?.name`. Otherwise, work with categoryId and pass category data separately.

- [ ] **Step 3: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 4: Commit**

```bash
git add components/boutique/store-catalog.tsx
git commit -m "feat: add category filter to store catalog

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: Cart context — add variant support

**Files:**
- Modify: `context/cart-context.tsx`

- [ ] **Step 1: Read the file**

- [ ] **Step 2: Update CartItem interface**

Add variant fields:
```typescript
interface CartItem {
  productId: string
  productName: string
  productImage: string | null
  price: number           // effective price (variant price or product price)
  currency: string
  quantity: number
  type: 'PHYSICAL' | 'DIGITAL'
  stock: number | null
  variantId: string | null      // NEW
  variantLabel: string | null   // NEW (ex: "TAILLE M")
}
```

- [ ] **Step 3: Update addItem logic**

The cart is mono-boutique. A product with variants should be identified by `productId + variantId` (not just productId), so different variants of the same product can be added separately.

Update the duplicate check in addItem:
```typescript
const existing = prev.items.find(
  (i) => i.productId === item.productId && i.variantId === (item.variantId ?? null)
)
```

Same for removeItem and updateQuantity — use both productId and variantId for identification.

- [ ] **Step 4: Update localStorage serialization**

Make sure new fields are included in save/load (they should be automatically since the state object is serialized as JSON).

- [ ] **Step 5: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 6: Commit**

```bash
git add context/cart-context.tsx
git commit -m "feat: add variant support to cart context

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: Variant selector on public product page

**Files:**
- Create: `components/orders/variant-selector.tsx`
- Modify: `app/(site)/boutique/[slug]/produit/[productId]/page.tsx`

- [ ] **Step 1: Create VariantSelector client component**

Props:
```typescript
interface VariantSelectorProps {
  variants: {
    id: string
    label: string
    price: number | null  // null = use product base price
    stock: number
    isActive: boolean
  }[]
  basePrice: number
  currency: string
  selectedVariantId: string | null
  onSelect: (variantId: string) => void
}
```

UI: Row of buttons (one per active variant). Selected variant highlighted. Shows price if different from base. Shows stock status. Disabled if stock === 0.

- [ ] **Step 2: Update product detail page**

Read the page first. Then:

1. Fetch product with variants included: `include: { variants: { where: { isActive: true }, orderBy: { position: 'asc' } } }`
2. If product has variants, render VariantSelector
3. The "Ajouter au panier" button passes variantId and variantLabel to addItem
4. Displayed price updates based on selected variant
5. If no variants, current behavior unchanged

- [ ] **Step 3: Update the ProductDetailClient component or add-to-cart logic**

The product detail page likely has a client component for the add-to-cart interaction. Read the relevant component and update it to:
- Accept variants as prop
- Manage selected variant state
- Pass variant info to cart addItem

- [ ] **Step 4: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 5: Commit**

```bash
git add components/orders/variant-selector.tsx "app/(site)/boutique/[slug]/produit/[productId]/page.tsx"
git commit -m "feat: add variant selector to product detail page

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: Update order actions for variant-aware stock

**Files:**
- Modify: `domains/orders/actions.ts`

- [ ] **Step 1: Read the file**

Read `domains/orders/actions.ts`, focusing on `purchaseProduct` and `createCartOrder`.

- [ ] **Step 2: Update purchaseProduct**

The function needs to accept `variantId` in its input. When present:
- Fetch the variant, check stock
- Use variant price if set, else product price
- Create OrderItem with variantId and variantLabel
- Decrement variant.stock instead of product.stock

When no variantId: current behavior (decrement product.stock).

Update the input validation to accept optional variantId.

- [ ] **Step 3: Update createCartOrder**

Cart items now include variantId. For each item:
- If variantId: fetch variant, use its price, decrement its stock
- If no variantId: current behavior
- OrderItem creation includes variantId and variantLabel

- [ ] **Step 4: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 5: Commit**

```bash
git add domains/orders/actions.ts
git commit -m "feat: variant-aware stock decrement in order actions

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 11: Display variant info in order pages and cart

**Files:**
- Modify: `app/(site)/panier/page.tsx` — show variant label in cart
- Modify: `app/(member)/achats/[id]/page.tsx` — show variant label in order detail
- Modify: `app/(member)/mon-business/commandes/[id]/page.tsx` — show variant label
- Modify: `app/(site)/checkout/page.tsx` (if exists) — pass variant info

- [ ] **Step 1: Update cart page**

Show variant label next to product name: "Robe Africaine — TAILLE M"

Find where product name is displayed and append variantLabel if present.

- [ ] **Step 2: Update buyer order detail**

OrderItem now has variantLabel. Show it next to product name in the order items list.

- [ ] **Step 3: Update seller order detail**

Same pattern — show variantLabel in order items.

- [ ] **Step 4: Update checkout page**

If a checkout page exists, ensure variant info is passed through to the order creation.

- [ ] **Step 5: Verify TypeScript**

Run: `npx tsc --noEmit --skipLibCheck`

- [ ] **Step 6: Commit**

```bash
git add "app/(site)/panier/page.tsx" "app/(member)/achats/[id]/page.tsx" "app/(member)/mon-business/commandes/[id]/page.tsx"
git commit -m "feat: display variant labels in cart and order detail pages

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 12: Final verification + continuity

- [ ] **Step 1: TypeScript check**

Run: `npx tsc --noEmit --skipLibCheck`

Expected: 0 errors.

- [ ] **Step 2: Update continuity files**

Update `SESSION_LOG.md` and `PROJECT_STATE.md`.

- [ ] **Step 3: Commit**

```bash
git add SESSION_LOG.md PROJECT_STATE.md
git commit -m "docs: update continuity files after categories + variants implementation

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```
