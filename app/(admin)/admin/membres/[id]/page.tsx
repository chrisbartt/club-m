import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, CalendarDays } from 'lucide-react'
import { getAdminMemberDetail } from '@/domains/members/admin-queries'
import { KycReview } from '@/components/admin/kyc-review'
import { MemberActions } from '@/components/admin/member-actions'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TIER_LABELS } from '@/lib/constants'
import type { MemberTier, VerificationStatus } from '@/lib/generated/prisma/client'

interface Props {
  params: Promise<{ id: string }>
}

const TIER_COLORS: Record<MemberTier, string> = {
  FREE: 'bg-gray-100 text-gray-700 border-gray-200',
  PREMIUM: 'bg-amber-50 text-amber-700 border-amber-200',
  BUSINESS: 'bg-purple-50 text-purple-700 border-purple-200',
}

const VERIFICATION_LABELS: Record<VerificationStatus, string> = {
  DECLARED: 'Non verifie',
  PENDING_VERIFICATION: 'En attente',
  VERIFIED: 'Verifie',
  REJECTED: 'Rejete',
}

const VERIFICATION_COLORS: Record<VerificationStatus, string> = {
  DECLARED: 'bg-gray-100 text-gray-600 border-gray-200',
  PENDING_VERIFICATION: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  VERIFIED: 'bg-green-50 text-green-700 border-green-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
}

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Actif',
  SUSPENDED: 'Suspendu',
  BANNED: 'Banni',
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-50 text-green-700 border-green-200',
  SUSPENDED: 'bg-red-50 text-red-700 border-red-200',
  BANNED: 'bg-gray-100 text-gray-700 border-gray-200',
}

export default async function AdminMemberDetailPage({ params }: Props) {
  const { id } = await params
  const member = await getAdminMemberDetail(id)

  if (!member) {
    redirect('/admin/membres')
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/admin/membres"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour a la liste
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">
            {member.firstName} {member.lastName}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={TIER_COLORS[member.tier]}>
              {TIER_LABELS[member.tier]}
            </Badge>
            <Badge variant="outline" className={VERIFICATION_COLORS[member.verificationStatus]}>
              {VERIFICATION_LABELS[member.verificationStatus]}
            </Badge>
            <Badge variant="outline" className={STATUS_COLORS[member.status] ?? ''}>
              {STATUS_LABELS[member.status] ?? member.status}
            </Badge>
          </div>
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              {member.user.email}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              Inscrit le {new Date(member.user.createdAt).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>

        {/* Actions */}
        <MemberActions
          memberId={member.id}
          memberStatus={member.status}
          memberTier={member.tier}
        />
      </div>

      {/* KYC History */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Verifications KYC</h2>
        {member.kycVerifications.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune verification KYC soumise.</p>
        ) : (
          <div className="space-y-4">
            {member.kycVerifications.map((kyc, index) => (
              <KycReview
                key={kyc.id}
                kyc={kyc}
                disabled={index !== 0 || kyc.status !== 'PENDING'}
              />
            ))}
          </div>
        )}
      </section>

      {/* Subscriptions */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Abonnements</h2>
        {member.subscriptions.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun abonnement.</p>
        ) : (
          <div className="space-y-2">
            {member.subscriptions.map((sub) => (
              <Card key={sub.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{TIER_LABELS[sub.tier]}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(sub.startDate).toLocaleDateString('fr-FR')}
                      {` — ${new Date(sub.endDate).toLocaleDateString('fr-FR')}`}
                    </p>
                  </div>
                  <Badge variant="outline">{sub.status}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Upgrade Requests */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Demandes de mise a niveau</h2>
        {member.upgradeRequests.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune demande.</p>
        ) : (
          <div className="space-y-2">
            {member.upgradeRequests.map((req) => (
              <Card key={req.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">
                      {req.fromTier} → {req.toTier}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(req.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <Badge variant="outline">{req.status}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
