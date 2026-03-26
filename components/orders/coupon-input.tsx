'use client'

import { useState } from 'react'
import { Loader2, Tag, X } from 'lucide-react'
import { checkCoupon } from '@/domains/coupons/actions'

interface CouponInputProps {
  businessId: string
  cartTotal: number
  cartCurrency: string
  onApply: (couponCode: string, discount: number) => void
  onRemove: () => void
}

export default function CouponInput({
  businessId,
  cartTotal,
  cartCurrency,
  onApply,
  onRemove,
}: CouponInputProps) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [applied, setApplied] = useState<{ code: string; discount: number } | null>(null)

  const handleApply = async () => {
    if (!code.trim()) return
    setError(null)
    setLoading(true)

    try {
      const result = await checkCoupon(code.trim(), businessId, cartTotal, cartCurrency)
      if (result.success) {
        setApplied({ code: result.data.code, discount: result.data.discount })
        onApply(result.data.code, result.data.discount)
      } else {
        setError(result.error)
      }
    } catch {
      setError('Une erreur est survenue. Veuillez reessayer.')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = () => {
    setApplied(null)
    setCode('')
    setError(null)
    onRemove()
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Code promo"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase())
              setError(null)
            }}
            disabled={!!applied || loading}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm text-[#091626] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a55b46]/30 focus:border-[#a55b46] transition-colors disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
        {!applied ? (
          <button
            type="button"
            onClick={handleApply}
            disabled={!code.trim() || loading}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#091626] text-white hover:bg-[#091626]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            Appliquer
          </button>
        ) : (
          <button
            type="button"
            onClick={handleRemove}
            className="px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            Supprimer
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {applied && (
        <p className="text-xs text-green-700 font-medium">
          Code {applied.code} applique — Reduction : {applied.discount.toLocaleString('fr-FR')} {cartCurrency}
        </p>
      )}
    </div>
  )
}
