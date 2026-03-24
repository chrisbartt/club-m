import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { CURRENCY_SYMBOLS } from '@/lib/constants'
import type { Product } from '@/lib/generated/prisma/client'

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  PHYSICAL: 'Produit',
  SERVICE: 'Service',
  DIGITAL: 'Digital',
}

interface MiniBoutiqueProps {
  products: Product[]
}

export function MiniBoutique({ products }: MiniBoutiqueProps) {
  if (products.length === 0) return null

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Produits & services</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const symbol = CURRENCY_SYMBOLS[product.currency] ?? '$'
          const image = product.images[0]

          return (
            <div key={product.id} className="rounded-lg border p-3 space-y-2">
              {image ? (
                <div className="relative aspect-square w-full overflow-hidden rounded-md">
                  <Image
                    src={image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="flex aspect-square items-center justify-center rounded-md bg-muted">
                  <span className="text-2xl font-bold text-muted-foreground/40">
                    {product.name[0]?.toUpperCase()}
                  </span>
                </div>
              )}

              <div className="space-y-1">
                <p className="font-medium leading-tight">{product.name}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">
                    {symbol}{Number(product.price).toLocaleString('fr-FR')}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {PRODUCT_TYPE_LABELS[product.type] ?? product.type}
                  </Badge>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
