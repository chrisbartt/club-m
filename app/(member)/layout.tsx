import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { MemberSidebar } from '@/components/member/member-sidebar'
import { MobileSidebar } from '@/components/shared/mobile-sidebar'
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

  const sidebarProps = {
    memberTier: user.member.tier,
    verificationStatus: user.member.verificationStatus,
    unreadNotificationCount,
  }

  return (
    <div className="flex h-screen">
      <MemberSidebar {...sidebarProps} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-3 border-b px-4 lg:hidden">
          <MobileSidebar>
            <MemberSidebar {...sidebarProps} />
          </MobileSidebar>
          <span className="text-lg font-bold">Club M</span>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <EmailVerificationBanner
            emailVerified={user.emailVerified}
            createdAt={user.createdAt.toISOString()}
            userEmail={user.email}
          />
          {children}
        </main>
      </div>
    </div>
  )
}
