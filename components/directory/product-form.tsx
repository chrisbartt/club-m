'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createProduct, updateProduct } from '@/domains/business/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  const [imagesStr, setImagesStr] = useState(defaultValues?.images?.join(', ') ?? '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    const images = imagesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

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
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'Nouveau produit' : 'Modifier le produit'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom du produit"
              required
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name[0]}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Decrivez votre produit"
              required
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description[0]}</p>
            )}
          </div>

          {/* Price + Currency */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="price">Prix</Label>
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
                <p className="text-sm text-red-600">{errors.price[0]}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label>Devise</Label>
              <Select value={currency} onValueChange={(val) => setCurrency(val as Currency)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="CDF">CDF (FC)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Type */}
          <div className="space-y-1">
            <Label>Type</Label>
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
          <div className="space-y-1">
            <Label htmlFor="category">Categorie (optionnel)</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ex: Beaute, Mode, Alimentation"
            />
          </div>

          {/* Stock (only for PHYSICAL) */}
          {type === 'PHYSICAL' && (
            <div className="space-y-1">
              <Label htmlFor="stock">Stock</Label>
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
                <p className="text-sm text-red-600">{errors.stock[0]}</p>
              )}
            </div>
          )}

          {/* Images */}
          <div className="space-y-1">
            <Label htmlFor="images">Images (URLs separees par des virgules)</Label>
            <Textarea
              id="images"
              value={imagesStr}
              onChange={(e) => setImagesStr(e.target.value)}
              placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
              rows={2}
            />
            {errors.images && (
              <p className="text-sm text-red-600">{errors.images[0]}</p>
            )}
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending
              ? 'En cours...'
              : mode === 'create'
                ? 'Creer le produit'
                : 'Enregistrer les modifications'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
