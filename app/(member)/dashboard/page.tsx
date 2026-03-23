import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

export default async function MemberDashboardPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const member = await db.member.findUnique({
    where: { userId: session.user.id },
  })

  if (!member) {
    redirect('/')
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Bonjour, {member.firstName} !</h1>
      <p className="text-muted-foreground">
        Votre abonnement : <span className="font-medium">{member.tier}</span>
      </p>
      <p className="text-muted-foreground">Tableau de bord en construction.</p>
    </div>
  )
}
