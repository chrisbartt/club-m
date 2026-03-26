# Categories + Product Variants — Spec

**Date:** 2026-03-26
**Status:** Approved
**Scope:** Chantiers #15 (catégories/collections) et #14 (variantes produit) du NEXT_STEPS.md

---

## Goal

Add formal product categories managed by admin, and single-axis product variants (size OR color) with individual pricing and stock tracking.

## Decisions

- Category model managed by admin only. Sellers choose from a list (no free text).
- Single-axis variants (one attribute per product — size OR color, not both).
- Each variant can have its own price (null = use product base price) and its own stock (Int, never null, 0 = out of stock).
- OrderItem has FK to ProductVariant + snapshot fields for traceability.
- Products without variants work exactly as before (no regression).
- Variant labels are normalized (trim + uppercase) before save to prevent logical duplicates.
- Variants have a position field for display order.

## Data Models

### Category (new)

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

### ProductVariant (new)

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

### Changes to Product

- Replace `category String?` with `categoryId String?` + FK to Category
- Add relation `variants ProductVariant[]`
- Keep `price` and `stock` as defaults for products without variants

### Changes to OrderItem

- Add `variantId String?` FK → ProductVariant
- Add `variantLabel String?` (snapshot of variant label at time of order)
- Existing `unitPrice` already serves as price snapshot

## Stock Behavior

| Product Type | Stock Source | Decrement Target |
|-------------|-------------|-----------------|
| No variants | `product.stock` (Int?, null = unlimited) | `product.stock` |
| With variants | `variant.stock` (Int, 0 = out of stock) | `variant.stock` |

- `product.stock` is ignored when variants exist
- `variant.isActive: false` → not shown in selector, not purchasable

## Label Normalization

Before saving a variant label: `label.trim().toUpperCase()`
- "  m " → "M"
- "rouge" → "ROUGE"
- Prevents logical duplicates ("M" vs "m" vs " M ")

## Category Management

### Admin
- CRUD categories at `/admin/categories`
- Fields: name, slug (auto-generated from name), isActive
- Toggle isActive to hide/show categories without deletion

### Seller Product Form
- Category field changes from free-text `<Input>` to `<Select>` populated by active categories
- Only active categories shown in dropdown

### Marketplace Filters
- Category filter populated from Category table (not distinct product values)
- Only categories that have at least 1 active product are shown

### Migration
- Existing `product.category` string values are migrated to Category records
- Products are linked to matching Category by name

## Variant Management

### Seller Product Form
- New section "Variantes" below the existing fields
- Toggle: "Ce produit a des variantes" (checkbox)
- If enabled: list of variants with fields: label, price (optional), stock, position
- Add/remove variants inline
- If disabled: standard price + stock fields (current behavior)

### Public Product Page
- If product has active variants: show variant selector (buttons or dropdown)
- Selected variant updates displayed price and stock badge
- "Ajouter au panier" requires variant selection
- If no variants: current behavior unchanged

### Cart & Checkout
- CartItem stores: productId, variantId (if applicable), variantLabel (snapshot)
- Cart displays variant label next to product name (ex: "Robe Africaine — Taille M")
- Price = variant.price ?? product.price

### Order Processing
- OrderItem stores: productId, variantId, variantLabel, unitPrice (all snapshots)
- Stock decrement targets variant.stock when variantId is present
- purchaseProduct and createCartOrder updated to handle variants

## Store Catalog

- Add category tabs/filter in StoreCatalog component
- Products grouped or filterable by category within a boutique
- "Tous" tab shows all products (default)

## Pages

### New pages
- `app/(admin)/admin/categories/page.tsx` — CRUD categories

### Modified pages
- `components/directory/product-form.tsx` — category select + variants section
- `app/(site)/boutique/[slug]/produit/[productId]/page.tsx` — variant selector
- `components/boutique/store-catalog.tsx` — category filter tabs
- `app/(site)/marketplace/page.tsx` — category filter from Category table
- `components/marketplace/marketplace-filters.tsx` — updated category source
- `domains/orders/actions.ts` — variant-aware stock decrement
- `domains/marketplace/queries.ts` — updated category queries

## Out of Scope

- Category images, descriptions, or icons
- Sub-categories / hierarchy
- Multi-axis variants (size × color combinations)
- Variant images (use product images)
- SKU auto-generation (sku is manual/optional)
- Bulk variant creation
