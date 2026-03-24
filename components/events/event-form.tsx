'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import type { EventAccessLevel, PricingRole, Currency } from '@/lib/generated/prisma/client'

type PriceRow = {
  targetRole: PricingRole
  price: number
  currency: Currency
}

export type EventFormValues = {
  title: string
  description: string
  location: string
  startDate: string
  endDate: string
  capacity: number
  coverImage?: string
  accessLevel: EventAccessLevel
  waitlistEnabled: boolean
  prices: PriceRow[]
}

interface EventFormProps {
  defaultValues?: Partial<EventFormValues>
  onSubmit: (data: EventFormValues) => Promise<{ success: boolean; error?: string }>
}

const PRICING_ROLES: { value: PricingRole; label: string }[] = [
  { value: 'PUBLIC', label: 'Public' },
  { value: 'FREE', label: 'Free' },
  { value: 'PREMIUM', label: 'Premium' },
  { value: 'BUSINESS', label: 'Business' },
]

const ACCESS_LEVELS: { value: EventAccessLevel; label: string }[] = [
  { value: 'PUBLIC', label: 'Public' },
  { value: 'MEMBERS_ONLY', label: 'Membres uniquement' },
  { value: 'PREMIUM_ONLY', label: 'Premium uniquement' },
  { value: 'BUSINESS_ONLY', label: 'Business uniquement' },
]

const CURRENCIES: Currency[] = ['USD', 'CDF', 'EUR']

const DEFAULT_PRICES: PriceRow[] = PRICING_ROLES.map((r) => ({
  targetRole: r.value,
  price: 0,
  currency: 'USD' as Currency,
}))

export function EventForm({ defaultValues, onSubmit }: EventFormProps) {
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState(defaultValues?.title ?? '')
  const [description, setDescription] = useState(defaultValues?.description ?? '')
  const [location, setLocation] = useState(defaultValues?.location ?? '')
  const [startDate, setStartDate] = useState(defaultValues?.startDate ?? '')
  const [endDate, setEndDate] = useState(defaultValues?.endDate ?? '')
  const [capacity, setCapacity] = useState(defaultValues?.capacity ?? 50)
  const [coverImage, setCoverImage] = useState(defaultValues?.coverImage ?? '')
  const [accessLevel, setAccessLevel] = useState<EventAccessLevel>(
    defaultValues?.accessLevel ?? 'PUBLIC'
  )
  const [waitlistEnabled, setWaitlistEnabled] = useState(
    defaultValues?.waitlistEnabled ?? false
  )
  const [prices, setPrices] = useState<PriceRow[]>(
    defaultValues?.prices ?? DEFAULT_PRICES
  )

  function updatePrice(index: number, field: 'price' | 'currency', value: number | string) {
    setPrices((prev) =>
      prev.map((p, i) =>
        i === index
          ? { ...p, [field]: field === 'price' ? Number(value) : value }
          : p
      )
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await onSubmit({
        title,
        description,
        location,
        startDate,
        endDate,
        capacity,
        coverImage: coverImage || undefined,
        accessLevel,
        waitlistEnabled,
        prices,
      })

      if (result.success) {
        toast.success('Evenement enregistre avec succes')
      } else {
        toast.error(result.error ?? 'Une erreur est survenue')
      }
    } catch {
      toast.error('Une erreur inattendue est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General info */}
      <Card>
        <CardHeader>
          <CardTitle>Informations generales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de l'evenement"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Decrivez l'evenement..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lieu</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Lieu de l'evenement"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de debut</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacite</Label>
              <Input
                id="capacity"
                type="number"
                min={1}
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value, 10) || 1)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coverImage">Image de couverture (URL)</Label>
              <Input
                id="coverImage"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Niveau d&apos;acces</Label>
              <Select
                value={accessLevel}
                onValueChange={(v) => setAccessLevel(v as EventAccessLevel)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACCESS_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <Switch
                id="waitlist"
                checked={waitlistEnabled}
                onCheckedChange={setWaitlistEnabled}
              />
              <Label htmlFor="waitlist">Activer la liste d&apos;attente</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Tarification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {prices.map((row, index) => {
              const roleLabel =
                PRICING_ROLES.find((r) => r.value === row.targetRole)?.label ?? row.targetRole
              return (
                <div key={row.targetRole} className="flex items-center gap-3">
                  <span className="w-24 text-sm font-medium">{roleLabel}</span>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={row.price}
                    onChange={(e) => updatePrice(index, 'price', e.target.value)}
                    className="w-32"
                  />
                  <Select
                    value={row.currency}
                    onValueChange={(v) => updatePrice(index, 'currency', v)}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  )
}
