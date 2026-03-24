import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { MemberSidebar } from '@/components/member/member-sidebar'

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

  return (
    <div className="flex h-screen">
      <MemberSidebar memberTier={user.member.tier} verificationStatus={user.member.verificationStatus} />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  )
}
