import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { hasMinTier } from '@/lib/permissions'
import { BusinessLayoutShell } from '@/components/business/business-layout-shell'

export default async function MonBusinessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { member: true },
  })

  if (!user?.member) {
    redirect('/')
  }

  if (user.member.status === 'SUSPENDED') {
    redirect('/login?error=suspended')
  }

  // Business tier required for full business dashboard
  if (!hasMinTier(user.member.tier, 'PREMIUM')) {
    redirect('/dashboard')
  }

  return <BusinessLayoutShell>{children}</BusinessLayoutShell>
}
