import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

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

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  )
}
