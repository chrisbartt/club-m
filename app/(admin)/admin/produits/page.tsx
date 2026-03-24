import { Package } from 'lucide-react'
import { db } from '@/lib/db'
import { CURRENCY_SYMBOLS } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const TYPE_LABELS: Record<string, string> = {
  PHYSICAL: 'Physique',
  SERVICE: 'Service',
  DIGITAL: 'Digital',
}

const TYPE_COLORS: Record<string, string> = {
  PHYSICAL: 'bg-blue-50 text-blue-700 border-blue-200',
  SERVICE: 'bg-purple-50 text-purple-700 border-purple-200',
  DIGITAL: 'bg-indigo-50 text-indigo-700 border-indigo-200',
}

export default async function AdminProduitsPage() {
  const products = await db.product.findMany({
    include: {
      business: {
        select: {
          businessName: true,
          member: { select: { firstName: true, lastName: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Moderation Produits</h1>
          <p className="text-muted-foreground">
            {products.length} produit{products.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        <div className="rounded-md bg-muted p-2 text-muted-foreground">
          <Package className="h-6 w-6" />
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom produit</TableHead>
              <TableHead>Business</TableHead>
              <TableHead>Vendeur</TableHead>
              <TableHead className="text-right">Prix</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Actif</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  Aucun produit trouve.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const symbol = CURRENCY_SYMBOLS[product.currency] ?? product.currency

                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.business.businessName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {product.business.member.firstName} {product.business.member.lastName}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {Number(product.price).toLocaleString('fr-FR')} {symbol}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={TYPE_COLORS[product.type] ?? ''}>
                        {TYPE_LABELS[product.type] ?? product.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          product.isActive
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-gray-50 text-gray-500 border-gray-200'
                        }
                      >
                        {product.isActive ? 'Actif' : 'Inactif'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(product.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
