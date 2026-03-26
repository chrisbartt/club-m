'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Plus } from 'lucide-react'

export interface Variant {
  label: string
  sku: string
  price: string
  stock: string
}

interface VariantManagerProps {
  variants: Variant[]
  onChange: (variants: Variant[]) => void
}

function emptyVariant(): Variant {
  return { label: '', sku: '', price: '', stock: '0' }
}

export function VariantManager({ variants, onChange }: VariantManagerProps) {
  function updateVariant(index: number, field: keyof Variant, value: string) {
    const updated = variants.map((v, i) =>
      i === index ? { ...v, [field]: value } : v
    )
    onChange(updated)
  }

  function addVariant() {
    onChange([...variants, emptyVariant()])
  }

  function removeVariant(index: number) {
    onChange(variants.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm text-muted-foreground">Variantes</Label>
      {variants.map((variant, index) => (
        <div
          key={index}
          className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 p-3"
        >
          <div className="grid flex-1 gap-2 sm:grid-cols-4">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Nom *</label>
              <Input
                value={variant.label}
                onChange={(e) => updateVariant(index, 'label', e.target.value)}
                placeholder="Ex: Taille M, Rouge"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">SKU</label>
              <Input
                value={variant.sku}
                onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                placeholder="Optionnel"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Prix</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={variant.price}
                onChange={(e) => updateVariant(index, 'price', e.target.value)}
                placeholder="Prix de base"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Stock *</label>
              <Input
                type="number"
                min="0"
                step="1"
                value={variant.stock}
                onChange={(e) => updateVariant(index, 'stock', e.target.value)}
                required
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => removeVariant(index)}
            className="mt-6 shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label="Supprimer la variante"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addVariant}
        className="gap-1.5"
      >
        <Plus className="h-4 w-4" />
        Ajouter une variante
      </Button>
    </div>
  )
}
