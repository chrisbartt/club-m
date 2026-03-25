import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { getProfileByMemberId } from '@/domains/directory/queries'
import { getProductsByBusiness } from '@/domains/business/queries'
import { ToggleActiveButton } from '@/components/directory/toggle-active-button'
import { CURRENCY_SYMBOLS } from '@/lib/constants'
import { Pencil, Plus, ShoppingBag } from 'lucide-react'
import type { Currency } from '@/lib/generated/prisma/client'

const TYPE_LABELS: Record<string, string> = {
  PHYSICAL: 'Produit',
  SERVICE: 'Service',
  DIGITAL: 'Digital',
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Produits</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerez votre catalogue de produits et services
          </p>
        </div>
        <Link
          href="/mon-business/produits/nouveau"
          className="inline-flex items-center gap-2 rounded-lg bg-[#8b5cf6] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#7c3aed]"
        >
          <Plus className="h-4 w-4" />
          Ajouter un produit
        </Link>
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
            className="inline-flex items-center gap-2 rounded-lg bg-[#8b5cf6] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#7c3aed]"
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

            return (
              <div
                key={product.id}
                className={`group overflow-hidden rounded-xl border border-white/[0.06] bg-[#1a1a24] transition-colors hover:border-white/[0.1] ${
                  !product.isActive ? 'opacity-60' : ''
                }`}
              >
                {/* Image */}
                {firstImage ? (
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={firstImage}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center bg-white/[0.02]">
                    <span className="text-3xl font-bold text-muted-foreground/20">
                      {product.name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-tight text-white">
                      {product.name}
                    </h3>
                    <span className="shrink-0 rounded-full bg-white/[0.06] px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {TYPE_LABELS[product.type] ?? product.type}
                    </span>
                  </div>

                  <p className="text-lg font-bold text-white">
                    {priceDisplay}
                  </p>

                  <div className="flex items-center gap-2">
                    {product.type === 'PHYSICAL' && (
                      <span className="text-xs text-muted-foreground">
                        {product.stock !== null && product.stock > 0
                          ? `${product.stock} en stock`
                          : 'Rupture de stock'}
                      </span>
                    )}
                    {product.isActive ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                        Actif
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-500/10 px-2 py-0.5 text-[11px] font-medium text-red-400">
                        Inactif
                      </span>
                    )}
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
