import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { getProfileByMemberId } from '@/domains/directory/queries'
import { getCouponsForBusiness } from '@/domains/coupons/queries'
import { Plus, Tag } from 'lucide-react'
import { CouponToggleButton } from './coupon-toggle-button'

export const metadata = {
  title: 'Coupons | Club M',
}

function getCouponStatus(coupon: {
  isActive: boolean
  expiresAt: Date | null
  maxUses: number | null
  usedCount: number
}): { label: string; color: string } {
  if (!coupon.isActive) {
    return { label: 'Inactif', color: 'bg-gray-500/10 text-gray-400' }
  }
  if (coupon.expiresAt && new Date() > coupon.expiresAt) {
    return { label: 'Expire', color: 'bg-amber-500/10 text-amber-400' }
  }
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return { label: 'Epuise', color: 'bg-red-500/10 text-red-400' }
  }
  return { label: 'Actif', color: 'bg-emerald-500/10 text-emerald-400' }
}

export default async function CouponsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { member: true },
  })

  if (!user?.member) redirect('/')

  const profile = await getProfileByMemberId(user.member.id)

  if (!profile || profile.profileType !== 'STORE') {
    redirect('/mon-business')
  }

  const coupons = await getCouponsForBusiness(profile.id)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Coupons</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerez vos codes promotionnels
          </p>
        </div>
        <Link
          href="/mon-business/coupons/nouveau"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-foreground shadow-lg shadow-purple-500/20 transition-all hover:bg-primary/90 hover:shadow-purple-500/30"
        >
          <Plus className="h-4 w-4" />
          Nouveau coupon
        </Link>
      </div>

      {/* List */}
      {coupons.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16">
          <Tag className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="mb-1 text-lg font-semibold text-foreground">
            Aucun coupon
          </p>
          <p className="mb-4 text-sm text-muted-foreground">
            Creez votre premier code promo pour attirer des clients.
          </p>
          <Link
            href="/mon-business/coupons/nouveau"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-foreground shadow-lg shadow-purple-500/20 transition-all hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Nouveau coupon
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Code</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Valeur</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Utilisations</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Statut</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => {
                  const status = getCouponStatus(coupon)
                  const currencySymbols: Record<string, string> = { USD: '$', CDF: 'FC', EUR: '\u20ac' }
                  const valueDisplay =
                    coupon.type === 'PERCENTAGE'
                      ? `${Number(coupon.value)}%`
                      : `${Number(coupon.value).toLocaleString('fr-FR')} ${coupon.currency ? currencySymbols[coupon.currency] ?? coupon.currency : ''}`

                  return (
                    <tr key={coupon.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3">
                        <span className="font-mono font-semibold text-foreground">
                          {coupon.code}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {coupon.type === 'PERCENTAGE' ? 'Pourcentage' : 'Montant fixe'}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {valueDisplay}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {coupon.usedCount}
                        {coupon.maxUses ? ` / ${coupon.maxUses}` : ''}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <CouponToggleButton
                          couponId={coupon.id}
                          isActive={coupon.isActive}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
