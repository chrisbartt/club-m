import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getMemberProfile, getMemberStats } from '@/domains/members/profile-queries'
import { DashboardFree } from '@/components/member/dashboard-free'
import { DashboardPremium } from '@/components/member/dashboard-premium'
import { DashboardBusiness } from '@/components/member/dashboard-business'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const profile = await getMemberProfile(session.user.id)
  if (!profile) redirect('/')

  const stats = await getMemberStats(profile.id)

  switch (profile.tier) {
    case 'BUSINESS':
      return <DashboardBusiness profile={profile} stats={stats} />
    case 'PREMIUM':
      return <DashboardPremium profile={profile} stats={stats} />
    default:
      return <DashboardFree profile={profile} stats={stats} />
  }
}
