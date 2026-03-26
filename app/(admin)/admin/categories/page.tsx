import { requireAdmin } from '@/lib/auth-guards'
import { getCategoriesWithProductCount } from '@/domains/categories/queries'
import { CategoryForm } from '@/components/admin/category-form'
import { CategoryActions } from './category-actions'

export default async function AdminCategoriesPage() {
  await requireAdmin()
  const categories = await getCategoriesWithProductCount()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Categories</h1>

      <div className="rounded-lg border p-4">
        <h2 className="mb-3 text-sm font-semibold">Nouvelle categorie</h2>
        <CategoryForm mode="create" />
      </div>

      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left font-medium">Nom</th>
                <th className="px-4 py-3 text-left font-medium">Slug</th>
                <th className="px-4 py-3 text-left font-medium">Produits</th>
                <th className="px-4 py-3 text-left font-medium">Statut</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td className="px-4 py-3 font-medium">{cat.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{cat.slug}</td>
                  <td className="px-4 py-3">{cat._count.products}</td>
                  <td className="px-4 py-3">
                    <span className={cat.isActive ? 'text-green-600' : 'text-muted-foreground'}>
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <CategoryActions category={cat} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
