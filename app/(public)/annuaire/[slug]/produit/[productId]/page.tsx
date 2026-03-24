import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getProductById } from '@/domains/business/queries'
import { PurchaseButton } from '@/components/orders/purchase-button'
import { Badge } from '@/components/ui/badge'
import { CURRENCY_SYMBOLS } from '@/lib/constants'
import { ArrowLeft, Package, Zap, Download } from 'lucide-react'
import type { Currency } from '@/lib/generated/prisma/client'

const PRODUCT_TYPE_LABELS: Record<string, { label: string; icon: typeof Package }> = {
  PHYSICAL: { label: 'Produit physique', icon: Package },
  SERVICE: { label: 'Service', icon: Zap },
  DIGITAL: { label: 'Digital', icon: Download },
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string; productId: string }>
}) {
  const { slug, productId } = await params
  const product = await getProductById(productId)

  if (!product || !product.isActive) {
    redirect(`/annuaire/${slug}`)
  }

  if (product.business.slug !== slug) {
    redirect(`/annuaire/${slug}`)
  }

  const session = await auth()
  const isLoggedIn = !!session?.user?.id

  const symbol = CURRENCY_SYMBOLS[product.currency as Currency] ?? '$'
  const price = Number(product.price)
  const typeInfo = PRODUCT_TYPE_LABELS[product.type] ?? PRODUCT_TYPE_LABELS.PHYSICAL
  const TypeIcon = typeInfo.icon

  const isOutOfStock =
    product.type === 'PHYSICAL' && product.stock !== null && product.stock <= 0

  const currentUrl = `/annuaire/${slug}/produit/${productId}`

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link
        href={`/annuaire/${slug}`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour a la fiche
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Images */}
        <div className="space-y-3">
          {product.images.length > 0 ? (
            <>
              <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1, 5).map((img, i) => (
                    <div
                      key={i}
                      className="relative aspect-square overflow-hidden rounded-md"
                    >
                      <Image
                        src={img}
                        alt={`${product.name} ${i + 2}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 25vw, 12vw"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-xl bg-muted">
              <span className="text-5xl font-bold text-muted-foreground/40">
                {product.name[0]?.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <TypeIcon className="h-3 w-3" />
                {typeInfo.label}
              </Badge>
              {product.category && (
                <Badge variant="secondary">{product.category}</Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-3xl font-semibold text-primary">
              {symbol}{price.toLocaleString('fr-FR')}
            </p>
          </div>

          <div className="prose prose-sm max-w-none text-muted-foreground">
            <p className="whitespace-pre-wrap leading-relaxed">{product.description}</p>
          </div>

          {/* Stock info */}
          {product.type === 'PHYSICAL' && product.stock !== null && (
            <div className="text-sm">
              {isOutOfStock ? (
                <span className="font-medium text-destructive">Rupture de stock</span>
              ) : (
                <span className="text-muted-foreground">
                  {product.stock} en stock
                </span>
              )}
            </div>
          )}

          {/* Purchase section */}
          <div className="rounded-lg border p-4 space-y-4">
            {isLoggedIn ? (
              <PurchaseButton
                productId={product.id}
                price={price}
                currency={product.currency}
                disabled={isOutOfStock}
                disabledReason={isOutOfStock ? 'Rupture de stock' : undefined}
              />
            ) : (
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Connectez-vous pour acheter ce produit
                </p>
                <Link
                  href={`/login?callbackUrl=${encodeURIComponent(currentUrl)}`}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Se connecter
                </Link>
              </div>
            )}
          </div>

          {/* Seller info */}
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground mb-1">Vendu par</p>
            <Link
              href={`/annuaire/${slug}`}
              className="font-medium text-primary hover:underline"
            >
              {product.business.businessName}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
