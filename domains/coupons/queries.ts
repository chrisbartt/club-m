import { db } from '@/lib/db'

export async function getCouponsForBusiness(businessId: string) {
  return db.coupon.findMany({
    where: { businessId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function validateCoupon(
  code: string,
  businessId: string,
  cartTotal: number,
  cartCurrency: string
) {
  const coupon = await db.coupon.findUnique({
    where: {
      businessId_code: { businessId, code: code.trim().toUpperCase() },
    },
  })

  if (!coupon)
    return { valid: false as const, error: 'Code promo introuvable' }
  if (!coupon.isActive)
    return { valid: false as const, error: "Ce code promo n'est plus actif" }
  if (coupon.startsAt && new Date() < coupon.startsAt)
    return {
      valid: false as const,
      error: "Ce code promo n'est pas encore valide",
    }
  if (coupon.expiresAt && new Date() > coupon.expiresAt)
    return { valid: false as const, error: 'Ce code promo a expire' }
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses)
    return {
      valid: false as const,
      error: "Ce code promo a atteint sa limite d'utilisation",
    }
  if (
    coupon.type === 'FIXED_AMOUNT' &&
    coupon.currency &&
    coupon.currency !== cartCurrency
  )
    return {
      valid: false as const,
      error: "Ce code promo n'est pas valide pour cette devise",
    }
  if (coupon.minOrderAmount && cartTotal < Number(coupon.minOrderAmount))
    return {
      valid: false as const,
      error: `Montant minimum requis : ${Number(coupon.minOrderAmount)} ${cartCurrency}`,
    }

  // Calculate discount
  let discount: number
  if (coupon.type === 'PERCENTAGE') {
    discount = Math.min(cartTotal, (cartTotal * Number(coupon.value)) / 100)
  } else {
    discount = Math.min(cartTotal, Number(coupon.value))
  }

  return { valid: true as const, coupon, discount }
}
