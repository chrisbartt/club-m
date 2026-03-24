import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { CURRENCY_SYMBOLS } from '@/lib/constants'
import type { Product } from '@/lib/generated/prisma/client'

const TYPE_LABELS: Record<string, string> = {
  PHYSICAL: 'Produit',
  SERVICE: 'Service',
  DIGITAL: 'Digital',
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const firstImage = product.images[0]
  const symbol = CURRENCY_SYMBOLS[product.currency] ?? product.currency
  const priceDisplay = `${Number(product.price).toLocaleString('fr-FR')} ${symbol}`

  return (
    <Card className={`overflow-hidden ${!product.isActive ? 'opacity-60' : ''}`}>
      {firstImage ? (
        <div className="relative aspect-square w-full">
          <Image
            src={firstImage}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
      ) : (
        <div className="flex aspect-square items-center justify-center bg-muted">
          <span className="text-2xl font-bold text-muted-foreground/40">
            {product.name.slice(0, 2).toUpperCase()}
          </span>
        </div>
      )}

      <CardContent className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight">{product.name}</h3>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {TYPE_LABELS[product.type] ?? product.type}
          </Badge>
        </div>

        <p className="text-lg font-bold">{priceDisplay}</p>

        {product.type === 'PHYSICAL' && (
          <p className="text-sm text-muted-foreground">
            {product.stock !== null && product.stock > 0
              ? `${product.stock} en stock`
              : 'Rupture'}
          </p>
        )}

        {!product.isActive && (
          <Badge variant="outline" className="text-xs">
            Inactif
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}
