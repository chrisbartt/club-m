'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createCoupon, updateCoupon } from '@/domains/coupons/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface CouponFormProps {
  mode: 'create' | 'edit'
  defaultValues?: {
    id: string
    code: string
    type: 'PERCENTAGE' | 'FIXED_AMOUNT'
    value: number
    currency?: string | null
    minOrderAmount?: number | null
    maxUses?: number | null
    startsAt?: string | null
    expiresAt?: string | null
  }
  onSuccess?: () => void
}

export function CouponForm({ mode, defaultValues, onSuccess }: CouponFormProps) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const [code, setCode] = useState(defaultValues?.code ?? '')
  const [type, setType] = useState<'PERCENTAGE' | 'FIXED_AMOUNT'>(
    defaultValues?.type ?? 'PERCENTAGE'
  )
  const [value, setValue] = useState(defaultValues?.value?.toString() ?? '')
  const [currency, setCurrency] = useState(defaultValues?.currency ?? 'USD')
  const [minOrderAmount, setMinOrderAmount] = useState(
    defaultValues?.minOrderAmount?.toString() ?? ''
  )
  const [maxUses, setMaxUses] = useState(defaultValues?.maxUses?.toString() ?? '')
  const [startsAt, setStartsAt] = useState(
    defaultValues?.startsAt ? defaultValues.startsAt.slice(0, 10) : ''
  )
  const [expiresAt, setExpiresAt] = useState(
    defaultValues?.expiresAt ? defaultValues.expiresAt.slice(0, 10) : ''
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    setErrors({})

    const payload: Record<string, unknown> = {
      code: code.toUpperCase(),
      type,
      value: parseFloat(value),
      ...(type === 'FIXED_AMOUNT' ? { currency } : {}),
      ...(minOrderAmount ? { minOrderAmount: parseFloat(minOrderAmount) } : {}),
      ...(maxUses ? { maxUses: parseInt(maxUses, 10) } : {}),
      ...(startsAt ? { startsAt } : {}),
      ...(expiresAt ? { expiresAt } : {}),
    }

    if (mode === 'edit' && defaultValues?.id) {
      payload.id = defaultValues.id
    }

    const result =
      mode === 'create' ? await createCoupon(payload) : await updateCoupon(payload)

    setPending(false)

    if (result.success) {
      toast.success(mode === 'create' ? 'Coupon cree avec succes' : 'Coupon mis a jour')
      onSuccess?.()
      router.push('/mon-business/coupons')
      router.refresh()
    } else {
      if (result.details) {
        setErrors(result.details)
      }
      toast.error(result.error === 'INVALID_INPUT' ? 'Veuillez corriger les erreurs' : result.error)
    }
  }

  const currencySymbols: Record<string, string> = { USD: '$', CDF: 'FC', EUR: '\u20ac' }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Code */}
      <div className="space-y-2">
        <Label htmlFor="code">Code</Label>
        <Input
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="EX: PROMO20"
          maxLength={20}
        />
        {errors.code && (
          <p className="text-sm text-red-500">{errors.code[0]}</p>
        )}
      </div>

      {/* Type */}
      <div className="space-y-2">
        <Label>Type</Label>
        <Select value={type} onValueChange={(v) => setType(v as 'PERCENTAGE' | 'FIXED_AMOUNT')}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PERCENTAGE">Pourcentage</SelectItem>
            <SelectItem value="FIXED_AMOUNT">Montant fixe</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Value */}
      <div className="space-y-2">
        <Label htmlFor="value">
          Valeur {type === 'PERCENTAGE' ? '(%)' : `(${currencySymbols[currency] ?? currency})`}
        </Label>
        <Input
          id="value"
          type="number"
          step="0.01"
          min="0.01"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={type === 'PERCENTAGE' ? 'Ex: 10' : 'Ex: 5000'}
        />
        {errors.value && (
          <p className="text-sm text-red-500">{errors.value[0]}</p>
        )}
      </div>

      {/* Currency (only for FIXED_AMOUNT) */}
      {type === 'FIXED_AMOUNT' && (
        <div className="space-y-2">
          <Label>Devise</Label>
          <Select value={currency} onValueChange={setCurrency}>
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
      )}

      {/* Min order amount */}
      <div className="space-y-2">
        <Label htmlFor="minOrderAmount">Montant minimum (optionnel)</Label>
        <Input
          id="minOrderAmount"
          type="number"
          step="0.01"
          min="0"
          value={minOrderAmount}
          onChange={(e) => setMinOrderAmount(e.target.value)}
          placeholder="Ex: 10000"
        />
        {errors.minOrderAmount && (
          <p className="text-sm text-red-500">{errors.minOrderAmount[0]}</p>
        )}
      </div>

      {/* Max uses */}
      <div className="space-y-2">
        <Label htmlFor="maxUses">Nombre max d&apos;utilisations (optionnel)</Label>
        <Input
          id="maxUses"
          type="number"
          step="1"
          min="1"
          value={maxUses}
          onChange={(e) => setMaxUses(e.target.value)}
          placeholder="Ex: 100"
        />
        {errors.maxUses && (
          <p className="text-sm text-red-500">{errors.maxUses[0]}</p>
        )}
      </div>

      {/* Dates */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startsAt">Date de debut (optionnel)</Label>
          <Input
            id="startsAt"
            type="date"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expiresAt">Date d&apos;expiration (optionnel)</Label>
          <Input
            id="expiresAt"
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        </div>
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending
          ? 'Enregistrement...'
          : mode === 'create'
            ? 'Creer le coupon'
            : 'Mettre a jour'}
      </Button>
    </form>
  )
}
