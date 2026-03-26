'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createProduct, updateProduct } from '@/domains/business/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { CloudinaryUpload } from '@/components/shared/cloudinary-upload'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { VariantManager, type Variant } from './variant-manager'
import type { Currency, ProductType } from '@/lib/generated/prisma/client'

interface ProductFormProps {
  mode: 'create' | 'edit'
  businessId?: string
  categories: { id: string; name: string }[]
  defaultValues?: {
    id: string
    name: string
    description: string
    price: number
    currency: Currency
    type: ProductType
    categoryId: string | null
    stock: number | null
    images: string[]
    variants?: Variant[]
  }
}

export function ProductForm({ mode, businessId, categories, defaultValues }: ProductFormProps) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const [name, setName] = useState(defaultValues?.name ?? '')
  const [description, setDescription] = useState(defaultValues?.description ?? '')
  const [price, setPrice] = useState(defaultValues?.price?.toString() ?? '')
  const [currency, setCurrency] = useState<Currency>(defaultValues?.currency ?? 'USD')
  const [type, setType] = useState<ProductType>(defaultValues?.type ?? 'PHYSICAL')
  const [categoryId, setCategoryId] = useState(defaultValues?.categoryId ?? '')
  const [stock, setStock] = useState(defaultValues?.stock?.toString() ?? '')
  const [images, setImages] = useState<string[]>(defaultValues?.images ?? [])

  const [hasVariants, setHasVariants] = useState(
    (defaultValues?.variants && defaultValues.variants.length > 0) ?? false
  )
  const [variants, setVariants] = useState<Variant[]>(
    defaultValues?.variants ?? []
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    setPending(true)

    const variantsPayload = hasVariants && variants.length > 0
      ? variants.map((v, i) => ({
          label: v.label,
          sku: v.sku || undefined,
          price: v.price ? parseFloat(v.price) : undefined,
          stock: parseInt(v.stock, 10) || 0,
          position: i,
        }))
      : undefined

    const input = {
      ...(mode === 'edit' && defaultValues ? { id: defaultValues.id } : {}),
      name,
      description,
      price: parseFloat(price) || 0,
      currency,
      type,
      categoryId: categoryId || undefined,
      stock: type === 'PHYSICAL' && !hasVariants ? (parseInt(stock, 10) || 0) : undefined,
      images,
      variants: hasVariants ? variantsPayload ?? [] : undefined,
    }

    const result = await (mode === 'create'
      ? createProduct(input)
      : updateProduct(input))

    if (result.success) {
      toast.success(mode === 'create' ? 'Produit cree' : 'Produit mis a jour')
      router.push('/mon-business/produits')
    } else {
      if (result.details) {
        setErrors(result.details)
      }
      toast.error(result.error === 'INVALID_INPUT' ? 'Verifiez les champs' : result.error)
      setPending(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold text-card-foreground">
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
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name[0]}</p>
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
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description[0]}</p>
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
            />
            {errors.price && (
              <p className="text-sm text-destructive">{errors.price[0]}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">Devise</Label>
            <Select value={currency} onValueChange={(val) => setCurrency(val as Currency)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PHYSICAL">Produit physique</SelectItem>
              <SelectItem value="SERVICE">Service</SelectItem>
              <SelectItem value="DIGITAL">Digital</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <Label className="text-sm text-muted-foreground">
            Categorie (optionnel)
          </Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir une categorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Variants toggle */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="hasVariants"
            checked={hasVariants}
            onCheckedChange={(checked) => {
              setHasVariants(checked === true)
              if (checked && variants.length === 0) {
                setVariants([{ label: '', sku: '', price: '', stock: '0' }])
              }
            }}
          />
          <Label htmlFor="hasVariants" className="text-sm text-foreground cursor-pointer">
            Ce produit a des variantes
          </Label>
        </div>

        {/* Variants or Stock */}
        {hasVariants ? (
          <VariantManager variants={variants} onChange={setVariants} />
        ) : (
          type === 'PHYSICAL' && (
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
              />
              {errors.stock && (
                <p className="text-sm text-destructive">{errors.stock[0]}</p>
              )}
            </div>
          )
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
            <p className="text-sm text-destructive">{errors.images[0]}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-primary py-2.5 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {pending
            ? 'En cours...'
            : mode === 'create'
              ? 'Creer le produit'
              : 'Enregistrer les modifications'}
        </Button>
      </form>
    </div>
  )
}
