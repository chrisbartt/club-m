import Link from 'next/link'
import { AlertTriangle, Package, ArrowRight } from 'lucide-react'

interface AlertsSidebarProps {
  pendingOrders: number
  lowStockProducts: { id: string; name: string; stock: number | null }[]
  topProducts: { name: string; count: number; revenue: number }[]
}

function formatCurrency(amount: number) {
  return amount.toLocaleString('fr-FR') + ' $US'
}

export function AlertsSidebar({
  pendingOrders,
  lowStockProducts,
  topProducts,
}: AlertsSidebarProps) {
  return (
    <div className="space-y-4">
      {/* Pending orders alert */}
      {pendingOrders > 0 && (
        <div className="rounded-xl border border-amber-500/20 bg-[#1a1a24] p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Commandes en attente
              </p>
              <p className="mt-1 text-[12px] text-muted-foreground">
                <span className="font-medium text-amber-400">
                  {pendingOrders}
                </span>{' '}
                commande{pendingOrders > 1 ? 's' : ''} en attente de traitement
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Low stock alert */}
      {lowStockProducts.length > 0 && (
        <div className="rounded-xl border border-orange-500/20 bg-[#1a1a24] p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500/10">
              <Package className="h-4 w-4 text-orange-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white">Stock faible</p>
              <p className="mt-1 text-[12px] text-muted-foreground">
                <span className="font-medium text-orange-400">
                  {lowStockProducts.length}
                </span>{' '}
                produit{lowStockProducts.length > 1 ? 's' : ''} en stock faible
              </p>
              <ul className="mt-3 space-y-2">
                {lowStockProducts.map((product) => (
                  <li
                    key={product.id}
                    className="flex items-center justify-between text-[12px]"
                  >
                    <span className="truncate pr-2 text-white/80">
                      {product.name}
                    </span>
                    <span className="shrink-0 rounded-full border border-orange-500/20 bg-orange-500/10 px-2 py-0.5 text-[11px] font-medium text-orange-400">
                      {product.stock} restant{(product.stock ?? 0) > 1 ? 's' : ''}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/mon-business/produits"
                className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-orange-400 transition-colors hover:text-orange-300"
              >
                Gérer le stock
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Top products */}
      <div className="rounded-xl border border-white/[0.06] bg-[#1a1a24] p-5">
        <h3 className="text-sm font-semibold text-white">Top produits</h3>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          Par chiffre d&apos;affaires
        </p>
        {topProducts.length === 0 ? (
          <p className="mt-4 text-[12px] text-muted-foreground">
            Aucune vente pour le moment
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {topProducts.map((product, index) => (
              <li key={index} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-[11px] font-bold text-purple-400">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-white">
                    {product.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {product.count} vendu{product.count > 1 ? 's' : ''} &middot;{' '}
                    {formatCurrency(product.revenue)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
