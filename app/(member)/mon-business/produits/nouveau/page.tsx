import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { getProfileByMemberId } from '@/domains/directory/queries'
import { ProductForm } from '@/components/directory/product-form'

export const metadata = {
  title: 'Nouveau produit | Club M',
}

export default async function NouveauProduitPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { member: true },
  })

  if (!user?.member) redirect('/')

  const profile = await getProfileByMemberId(user.member.id)

  if (!profile || profile.profileType !== 'STORE') {
    redirect('/mon-business')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Nouveau produit</h1>
      <ProductForm mode="create" businessId={profile.id} />
    </div>
  )
}
