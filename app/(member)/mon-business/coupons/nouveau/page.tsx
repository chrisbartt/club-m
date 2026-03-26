import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CouponForm } from '@/components/business/coupon-form'

export const metadata = {
  title: 'Nouveau coupon | Club M',
}

export default function NouveauCouponPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <Link
          href="/mon-business/coupons"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux coupons
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-foreground">Nouveau coupon</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Creez un code promotionnel pour votre boutique.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <CouponForm mode="create" />
      </div>
    </div>
  )
}
