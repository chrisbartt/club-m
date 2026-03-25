import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { getProfileByMemberId } from '@/domains/directory/queries'
import { ProductForm } from '@/components/directory/product-form'
import { ArrowLeft } from 'lucide-react'

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
      <div>
        <Link
          href="/mon-business/produits"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux produits
        </Link>
        <h1 className="text-2xl font-bold text-white">Nouveau produit</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ajoutez un nouveau produit a votre catalogue
        </p>
      </div>
      <ProductForm mode="create" businessId={profile.id} />
    </div>
  )
}
