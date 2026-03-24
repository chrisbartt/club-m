import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { getProfileByMemberId } from '@/domains/directory/queries'
import { getProductsByBusiness } from '@/domains/business/queries'
import { ProductCard } from '@/components/directory/product-card'
import { ToggleActiveButton } from '@/components/directory/toggle-active-button'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Mes produits | Club M',
}

export default async function ProduitsPage() {
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

  const products = await getProductsByBusiness(profile.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mes produits</h1>
          <p className="text-sm text-muted-foreground">
            {products.length} produit{products.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button asChild>
          <Link href="/mon-business/produits/nouveau">Ajouter un produit</Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="mb-2 text-lg font-semibold">Aucun produit</p>
          <p className="mb-4 text-sm text-muted-foreground">
            Ajoutez votre premier produit pour commencer a vendre.
          </p>
          <Button asChild>
            <Link href="/mon-business/produits/nouveau">Ajouter un produit</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="space-y-2">
              <ProductCard product={product} />
              <div className="flex items-center gap-2">
                <ToggleActiveButton
                  productId={product.id}
                  isActive={product.isActive}
                />
                <Button asChild variant="outline" size="sm">
                  <Link href={`/mon-business/produits/${product.id}`}>Modifier</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
