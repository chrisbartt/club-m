import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { getProfileByMemberId } from '@/domains/directory/queries'
import { getProductsByBusiness } from '@/domains/business/queries'
import { ToggleActiveButton } from '@/components/directory/toggle-active-button'
import { CURRENCY_SYMBOLS } from '@/lib/constants'
import {
  Pencil,
  Plus,
  ShoppingBag,
  Package,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  BarChart3,
} from 'lucide-react'
import type { Currency } from '@/lib/generated/prisma/client'

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  PHYSICAL: { label: 'Produit', color: 'bg-blue-500/10 text-blue-400' },
  SERVICE: { label: 'Service', color: 'bg-purple-500/10 text-purple-400' },
  DIGITAL: { label: 'Digital', color: 'bg-orange-500/10 text-orange-400' },
}

export const metadata = {
  title: 'Produits | Club M',
}

export default async function ProduitsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { member: true },
  })

  if (!user?.member) redirect('/')

  const profile = await getProfileByMemberId(user.member.id)

  if (!profile || profile.profileType !== 'STORE') {
    redirect('/mon-business')
  }

  const products = await getProductsByBusiness(profile.id)

  // Fetch order items for performance stats
  const orderItems = await db.orderItem.findMany({
    where: {
      product: { businessId: profile.id },
      order: { status: { in: ['COMPLETED', 'DELIVERED', 'PAID', 'SHIPPED'] } },
    },
    select: { productId: true, quantity: true, unitPrice: true },
  })

  // Aggregate by productId
  const productStats = new Map<string, { totalSold: number; totalRevenue: number }>()
  for (const item of orderItems) {
    const existing = productStats.get(item.productId) ?? { totalSold: 0, totalRevenue: 0 }
    existing.totalSold += item.quantity
    existing.totalRevenue += item.quantity * Number(item.unitPrice)
    productStats.set(item.productId, existing)
  }

  // Compute aggregate stats
  const totalProducts = products.length
  const activeProducts = products.filter((p) => p.isActive).length
  const outOfStock = products.filter(
    (p) => p.type === 'PHYSICAL' && (p.stock === null || p.stock === 0)
  ).length
  const totalRevenue = Array.from(productStats.values()).reduce(
    (sum, s) => sum + s.totalRevenue,
    0
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Produits</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerez votre catalogue
          </p>
        </div>
        <Link
          href="/mon-business/produits/nouveau"
          className="inline-flex items-center gap-2 rounded-xl bg-[#8b5cf6] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:bg-[#7c3aed] hover:shadow-purple-500/30"
        >
          <Plus className="h-4 w-4" />
          Ajouter un produit
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-white/[0.06] bg-[#1a1a24] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Package className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total produits</p>
              <p className="text-xl font-bold text-white">{totalProducts}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#1a1a24] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Produits actifs</p>
              <p className="text-xl font-bold text-white">{activeProducts}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#1a1a24] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">En rupture</p>
              <p className="text-xl font-bold text-white">{outOfStock}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-[#1a1a24] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <DollarSign className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Revenu total</p>
              <p className="text-xl font-bold text-white">
                {totalRevenue.toLocaleString('fr-FR')} $
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-[#1a1a24] py-16">
          <ShoppingBag className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="mb-1 text-lg font-semibold text-white">
            Aucun produit
          </p>
          <p className="mb-4 text-sm text-muted-foreground">
            Ajoutez votre premier produit pour commencer a vendre.
          </p>
          <Link
            href="/mon-business/produits/nouveau"
            className="inline-flex items-center gap-2 rounded-xl bg-[#8b5cf6] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:bg-[#7c3aed]"
          >
            <Plus className="h-4 w-4" />
            Ajouter un produit
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const firstImage = product.images[0]
            const symbol =
              CURRENCY_SYMBOLS[product.currency as Currency] ??
              product.currency
            const priceDisplay = `${Number(product.price).toLocaleString('fr-FR')} ${symbol}`
            const stats = productStats.get(product.id) ?? {
              totalSold: 0,
              totalRevenue: 0,
            }
            const typeInfo = TYPE_LABELS[product.type] ?? {
              label: product.type,
              color: 'bg-white/[0.06] text-muted-foreground',
            }

            // Stock color
            let stockColor = 'text-muted-foreground'
            let stockBg = ''
            if (product.type === 'PHYSICAL') {
              if (product.stock !== null && product.stock > 5) {
                stockColor = 'text-emerald-400'
                stockBg = 'bg-emerald-500/10'
              } else if (product.stock !== null && product.stock >= 1) {
                stockColor = 'text-amber-400'
                stockBg = 'bg-amber-500/10'
              } else {
                stockColor = 'text-red-400'
                stockBg = 'bg-red-500/10'
              }
            }

            return (
              <div
                key={product.id}
                className={`group overflow-hidden rounded-xl border border-white/[0.06] bg-[#1a1a24] transition-all hover:border-white/[0.12] hover:shadow-lg hover:shadow-black/20 ${
                  !product.isActive ? 'opacity-60' : ''
                }`}
              >
                {/* Image */}
                {firstImage ? (
                  <div className="relative h-40 w-full overflow-hidden">
                    <Image
                      src={firstImage}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a24]/60 to-transparent" />
                  </div>
                ) : (
                  <div className="flex h-40 items-center justify-center bg-gradient-to-br from-[#8b5cf6]/10 via-[#1a1a24] to-[#3b82f6]/10">
                    <span className="text-4xl font-bold text-white/10">
                      {product.name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="space-y-3 p-4">
                  {/* Name + Type badge */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-tight text-white">
                      {product.name}
                    </h3>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${typeInfo.color}`}
                    >
                      {typeInfo.label}
                    </span>
                  </div>

                  {/* Price */}
                  <p className="text-lg font-bold text-white">
                    {priceDisplay}
                  </p>

                  {/* Stock + Active badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    {product.type === 'PHYSICAL' && (
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${stockColor} ${stockBg}`}
                      >
                        {product.stock !== null && product.stock > 0
                          ? `${product.stock} en stock`
                          : 'Rupture de stock'}
                      </span>
                    )}
                    {product.isActive ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
                        Actif
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-0.5 text-[11px] font-medium text-red-400">
                        Inactif
                      </span>
                    )}
                  </div>

                  {/* Performance stats */}
                  <div className="flex items-center gap-4 border-t border-white/[0.06] pt-3">
                    <div className="flex items-center gap-1.5">
                      <BarChart3 className="h-3.5 w-3.5 text-muted-foreground/60" />
                      <span className="text-xs text-muted-foreground">
                        Ventes:{' '}
                        <span className="font-medium text-white">
                          {stats.totalSold}
                        </span>
                      </span>
                    </div>
                    <div className="h-3 w-px bg-white/[0.06]" />
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-muted-foreground/60" />
                      <span className="text-xs text-muted-foreground">
                        Revenu:{' '}
                        <span className="font-medium text-white">
                          {stats.totalRevenue.toLocaleString('fr-FR')} $
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 border-t border-white/[0.06] pt-3">
                    <ToggleActiveButton
                      productId={product.id}
                      isActive={product.isActive}
                    />
                    <Link
                      href={`/mon-business/produits/${product.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-transparent px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-white"
                    >
                      <Pencil className="h-3 w-3" />
                      Modifier
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
