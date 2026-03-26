'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createProduct, updateProduct } from '@/domains/business/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CloudinaryUpload } from '@/components/shared/cloudinary-upload'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Currency, ProductType } from '@/lib/generated/prisma/client'

interface ProductFormProps {
  mode: 'create' | 'edit'
  businessId?: string
  defaultValues?: {
    id: string
    name: string
    description: string
    price: number
    currency: Currency
    type: ProductType
    category: string | null
    stock: number | null
    images: string[]
  }
}

export function ProductForm({ mode, businessId, defaultValues }: ProductFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const [name, setName] = useState(defaultValues?.name ?? '')
  const [description, setDescription] = useState(defaultValues?.description ?? '')
  const [price, setPrice] = useState(defaultValues?.price?.toString() ?? '')
  const [currency, setCurrency] = useState<Currency>(defaultValues?.currency ?? 'USD')
  const [type, setType] = useState<ProductType>(defaultValues?.type ?? 'PHYSICAL')
  const [category, setCategory] = useState(defaultValues?.category ?? '')
  const [stock, setStock] = useState(defaultValues?.stock?.toString() ?? '')
  const [images, setImages] = useState<string[]>(defaultValues?.images ?? [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    const input = {
      ...(mode === 'edit' && defaultValues ? { id: defaultValues.id } : {}),
      name,
      description,
      price: parseFloat(price) || 0,
      currency,
      type,
      category: category || undefined,
      stock: type === 'PHYSICAL' ? (parseInt(stock, 10) || 0) : undefined,
      images,
    }

    startTransition(async () => {
      const result =
        mode === 'create'
          ? await createProduct(input)
          : await updateProduct(input)

      if (result.success) {
        toast.success(mode === 'create' ? 'Produit cree' : 'Produit mis a jour')
        router.push('/mon-business/produits')
        router.refresh()
      } else {
        if (result.details) {
          setErrors(result.details)
        }
        toast.error(result.error === 'INVALID_INPUT' ? 'Verifiez les champs' : result.error)
      }
    })
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#1a1a24]">
      <div className="border-b border-white/[0.06] px-6 py-4">
        <h2 className="text-lg font-semibold text-white">
          {mode === 'create' ? 'Nouveau produit' : 'Modifier le produit'}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {mode === 'create'
            ? 'Remplissez les informations de votre produit'
            : 'Modifiez les informations ci-dessous'}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5 p-6">
        {/* Name */}
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm text-muted-foreground">
            Nom
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom du produit"
            required
            className="border-white/[0.06] bg-white/[0.03] text-white placeholder:text-muted-foreground/50 focus-visible:border-[#8b5cf6]/50 focus-visible:ring-[#8b5cf6]/20"
          />
          {errors.name && (
            <p className="text-sm text-red-400">{errors.name[0]}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label htmlFor="description" className="text-sm text-muted-foreground">
            Description
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Decrivez votre produit"
            required
            className="border-white/[0.06] bg-white/[0.03] text-white placeholder:text-muted-foreground/50 focus-visible:border-[#8b5cf6]/50 focus-visible:ring-[#8b5cf6]/20"
          />
          {errors.description && (
            <p className="text-sm text-red-400">{errors.description[0]}</p>
          )}
        </div>

        {/* Price + Currency */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="price" className="text-sm text-muted-foreground">
              Prix
            </Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              required
              className="border-white/[0.06] bg-white/[0.03] text-white placeholder:text-muted-foreground/50 focus-visible:border-[#8b5cf6]/50 focus-visible:ring-[#8b5cf6]/20"
            />
            {errors.price && (
              <p className="text-sm text-red-400">{errors.price[0]}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">Devise</Label>
            <Select value={currency} onValueChange={(val) => setCurrency(val as Currency)}>
              <SelectTrigger className="border-white/[0.06] bg-white/[0.03] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-white/[0.06] bg-[#1a1a24]">
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="CDF">CDF (FC)</SelectItem>
                <SelectItem value="EUR">EUR (&euro;)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Type */}
        <div className="space-y-1.5">
          <Label className="text-sm text-muted-foreground">Type</Label>
          <Select value={type} onValueChange={(val) => setType(val as ProductType)}>
            <SelectTrigger className="border-white/[0.06] bg-white/[0.03] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-white/[0.06] bg-[#1a1a24]">
              <SelectItem value="PHYSICAL">Produit physique</SelectItem>
              <SelectItem value="SERVICE">Service</SelectItem>
              <SelectItem value="DIGITAL">Digital</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <Label htmlFor="category" className="text-sm text-muted-foreground">
            Categorie (optionnel)
          </Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Ex: Beaute, Mode, Alimentation"
            className="border-white/[0.06] bg-white/[0.03] text-white placeholder:text-muted-foreground/50 focus-visible:border-[#8b5cf6]/50 focus-visible:ring-[#8b5cf6]/20"
          />
        </div>

        {/* Stock (only for PHYSICAL) */}
        {type === 'PHYSICAL' && (
          <div className="space-y-1.5">
            <Label htmlFor="stock" className="text-sm text-muted-foreground">
              Stock
            </Label>
            <Input
              id="stock"
              type="number"
              min="0"
              step="1"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="0"
              className="border-white/[0.06] bg-white/[0.03] text-white placeholder:text-muted-foreground/50 focus-visible:border-[#8b5cf6]/50 focus-visible:ring-[#8b5cf6]/20"
            />
            {errors.stock && (
              <p className="text-sm text-red-400">{errors.stock[0]}</p>
            )}
          </div>
        )}

        {/* Images */}
        <div className="space-y-1.5">
          <Label className="text-sm text-muted-foreground">Images</Label>
          <CloudinaryUpload
            folder="products"
            multiple
            onUpload={setImages}
            currentImages={images}
          />
          {errors.images && (
            <p className="text-sm text-red-400">{errors.images[0]}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[#8b5cf6] py-2.5 font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:bg-[#7c3aed] hover:shadow-purple-500/30 disabled:opacity-50"
        >
          {isPending
            ? 'En cours...'
            : mode === 'create'
              ? 'Creer le produit'
              : 'Enregistrer les modifications'}
        </Button>
      </form>
    </div>
  )
}
