import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { MemberSidebar } from '@/components/member/member-sidebar'
import { EmailVerificationBanner } from '@/components/shared/email-verification-banner'
import { getUnreadCount } from '@/domains/notifications/queries'

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
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

  const unreadNotificationCount = await getUnreadCount(user.id)

  // /mon-business routes have their own layout (business sidebar + navbar)
  // so we skip the member sidebar wrapper for those routes
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? ''
  const isBusinessRoute = pathname.startsWith('/mon-business')

  if (isBusinessRoute) {
    return (
      <>
        <EmailVerificationBanner
          emailVerified={user.emailVerified}
          createdAt={user.createdAt.toISOString()}
          userEmail={user.email}
        />
        {children}
      </>
    )
  }

  return (
    <div className="flex h-screen">
      <MemberSidebar memberTier={user.member.tier} verificationStatus={user.member.verificationStatus} unreadNotificationCount={unreadNotificationCount} />
      <main className="flex-1 overflow-y-auto p-6">
        <EmailVerificationBanner
          emailVerified={user.emailVerified}
          createdAt={user.createdAt.toISOString()}
          userEmail={user.email}
        />
        {children}
      </main>
    </div>
  )
}
