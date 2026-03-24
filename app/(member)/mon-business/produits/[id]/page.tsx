import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { getProductById } from '@/domains/business/queries'
import { ProductForm } from '@/components/directory/product-form'

export const metadata = {
  title: 'Modifier produit | Club M',
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { member: true },
  })

  if (!user?.member) redirect('/')

  const product = await getProductById(id)

  if (!product) {
    redirect('/mon-business/produits')
  }

  // Check ownership
  if (product.business.memberId !== user.member.id) {
    redirect('/mon-business/produits')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Modifier le produit</h1>
      <ProductForm
        mode="edit"
        defaultValues={{
          id: product.id,
          name: product.name,
          description: product.description,
          price: Number(product.price),
          currency: product.currency,
          type: product.type,
          category: product.category,
          stock: product.stock,
          images: product.images,
        }}
      />
    </div>
  )
}
