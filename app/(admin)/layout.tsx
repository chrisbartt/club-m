import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { MobileSidebar } from '@/components/shared/mobile-sidebar'
import { getKycCount } from '@/domains/kyc/queries'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { adminAccount: true },
  })

  if (!user?.adminAccount) {
    redirect('/dashboard')
  }

  const pendingKycCount = await getKycCount()

  return (
    <div className="flex h-screen">
      <AdminSidebar pendingKycCount={pendingKycCount} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-3 border-b px-4 lg:hidden">
          <MobileSidebar>
            <AdminSidebar pendingKycCount={pendingKycCount} />
          </MobileSidebar>
          <span className="text-lg font-bold">Club M Admin</span>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
