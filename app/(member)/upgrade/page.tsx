import Link from 'next/link'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getMemberProfile } from '@/domains/members/profile-queries'
import { getActiveUpgradeRequest } from '@/domains/upgrade/queries'
import { TIER_LABELS } from '@/lib/constants'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UpgradeCard } from '@/components/member/upgrade-card'
import type { MemberTier } from '@/lib/generated/prisma/client'

const PLANS = [
  {
    tier: 'PREMIUM' as const,
    price: '29',
    currency: 'USD',
    period: 'mois',
    features: [
      'Tout ce que fait une Free',
      'Espace membre enrichi',
      'Presentation de votre activite',
      'Visibilite et networking',
      'Reservation evenements',
    ],
  },
  {
    tier: 'BUSINESS' as const,
    price: '59',
    currency: 'USD',
    period: 'mois',
    features: [
      'Tout ce que fait une Premium',
      'Fiche business avancee',
      'Vente de produits / services',
      'Systeme de paiement active',
      'Outils business complets',
    ],
  },
]

const STATUS_LABELS: Record<string, string> = {
  KYC_PENDING: 'En attente de verification KYC',
  READY_FOR_PAYMENT: 'Pret pour le paiement',
  PAYMENT_PENDING: 'Paiement en cours de traitement',
}

const STATUS_NEXT_STEP: Record<string, { label: string; href: string }> = {
  KYC_PENDING: { label: 'Soumettre mes documents', href: '/kyc' },
  READY_FOR_PAYMENT: { label: 'Proceder au paiement', href: '/upgrade/payment' },
}

export default async function UpgradePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const profile = await getMemberProfile(session.user.id)
  if (!profile) redirect('/')

  const activeUpgrade = await getActiveUpgradeRequest(profile.id)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mise a niveau</h1>

      {activeUpgrade ? (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
          <CardHeader>
            <CardTitle className="text-lg">
              Demande en cours : {TIER_LABELS[activeUpgrade.toTier as MemberTier] ?? activeUpgrade.toTier}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Statut : {STATUS_LABELS[activeUpgrade.status] ?? activeUpgrade.status}
            </p>

            {STATUS_NEXT_STEP[activeUpgrade.status] && (
              <Button asChild size="sm">
                <Link href={STATUS_NEXT_STEP[activeUpgrade.status].href}>
                  {STATUS_NEXT_STEP[activeUpgrade.status].label}
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {PLANS.map((plan) => (
            <UpgradeCard
              key={plan.tier}
              plan={plan}
              currentTier={profile.tier}
              isVerified={profile.verificationStatus === 'VERIFIED'}
            />
          ))}
        </div>
      )}
    </div>
  )
}
