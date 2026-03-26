'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { toggleCoupon } from '@/domains/coupons/actions'
import { Button } from '@/components/ui/button'

interface CouponToggleButtonProps {
  couponId: string
  isActive: boolean
}

export function CouponToggleButton({ couponId, isActive }: CouponToggleButtonProps) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function handleToggle() {
    setPending(true)
    const result = await toggleCoupon(couponId)
    setPending(false)

    if (result.success) {
      toast.success(result.data.isActive ? 'Coupon active' : 'Coupon desactive')
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={handleToggle}
      className="text-xs"
    >
      {pending ? '...' : isActive ? 'Desactiver' : 'Activer'}
    </Button>
  )
}
