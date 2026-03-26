'use client'

import { cn } from '@/lib/utils'

interface Variant {
  id: string
  label: string
  price: number | null
  stock: number
  isActive: boolean
}

interface VariantSelectorProps {
  variants: Variant[]
  basePrice: number
  currency: string
  selectedVariantId: string | null
  onSelect: (variantId: string) => void
}

export function VariantSelector({
  variants,
  basePrice,
  currency,
  selectedVariantId,
  onSelect,
}: VariantSelectorProps) {
  const activeVariants = variants.filter((v) => v.isActive)

  if (activeVariants.length === 0) return null

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Choisir une option</p>
      <div className="flex flex-wrap gap-2">
        {activeVariants.map((variant) => {
          const isSelected = selectedVariantId === variant.id
          const isOutOfStock = variant.stock === 0
          const displayPrice = variant.price ?? basePrice

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => !isOutOfStock && onSelect(variant.id)}
              disabled={isOutOfStock}
              className={cn(
                'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                isSelected
                  ? 'border-primary bg-primary/10 text-primary'
                  : isOutOfStock
                    ? 'border-muted bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                    : 'border-border hover:border-primary/50'
              )}
            >
              <span>{variant.label}</span>
              {variant.price !== null && variant.price !== basePrice && (
                <span className="ml-1 text-xs text-muted-foreground">
                  ({displayPrice} {currency})
                </span>
              )}
              {isOutOfStock && (
                <span className="ml-1 text-xs text-destructive">Rupture</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
