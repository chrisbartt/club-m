import { Suspense } from 'react'
import { Users, Crown, Briefcase, Clock, UserCheck } from 'lucide-react'
import { getAdminMembersList, getAdminMembersStats } from '@/domains/members/admin-queries'
import { MembersTable } from '@/components/admin/members-table'
import { Card, CardContent } from '@/components/ui/card'
import type { MemberTier, VerificationStatus } from '@/lib/generated/prisma/client'

interface Props {
  searchParams: Promise<{
    tier?: string
    verification?: string
    search?: string
    page?: string
  }>
}

export default async function AdminMembresPage({ searchParams }: Props) {
  const params = await searchParams

  const [stats, result] = await Promise.all([
    getAdminMembersStats(),
    getAdminMembersList({
      tier: params.tier as MemberTier | undefined,
      verificationStatus: params.verification as VerificationStatus | undefined,
      search: params.search,
      page: params.page ? parseInt(params.page, 10) : 1,
    }),
  ])

  const statCards = [
    {
      label: 'Total membres',
      value: stats.totalMembers,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      label: 'Free',
      value: stats.byTier.FREE,
      icon: UserCheck,
      color: 'text-gray-600',
    },
    {
      label: 'Premium',
      value: stats.byTier.PREMIUM,
      icon: Crown,
      color: 'text-amber-600',
    },
    {
      label: 'Business',
      value: stats.byTier.BUSINESS,
      icon: Briefcase,
      color: 'text-purple-600',
    },
    {
      label: 'KYC en attente',
      value: stats.pendingKycCount,
      icon: Clock,
      color: 'text-yellow-600',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Membres</h1>
        <p className="text-muted-foreground">
          Gestion des membres de Club M
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className={`rounded-md bg-muted p-2 ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Members Table */}
      <Suspense fallback={<div className="text-muted-foreground">Chargement...</div>}>
        <MembersTable
          members={result.members}
          total={result.total}
          page={result.page}
          pageSize={result.pageSize}
        />
      </Suspense>
    </div>
  )
}
