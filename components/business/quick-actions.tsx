import Link from 'next/link'
import { Plus, Package, Download, Bell } from 'lucide-react'

interface QuickActionsProps {
  alertsCount: number
}

export function QuickActions({ alertsCount }: QuickActionsProps) {
  const buttonBase =
    'inline-flex items-center gap-2 rounded-lg border border-white/[0.06] px-4 py-2 text-sm font-medium text-white/70 transition-colors'

  return (
    <div className="flex flex-wrap gap-3">
      <button
        className={`${buttonBase} cursor-not-allowed opacity-50`}
        disabled
      >
        <Plus size={16} />
        Nouvelle commande
      </button>

      <Link
        href="/mon-business/produits/nouveau"
        className={`${buttonBase} bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20`}
      >
        <Package size={16} />
        Ajouter produit
      </Link>

      <button
        className={`${buttonBase} cursor-not-allowed opacity-50`}
        disabled
      >
        <Download size={16} />
        Exporter CSV
      </button>

      <button
        className={`${buttonBase} relative cursor-not-allowed opacity-50`}
        disabled
      >
        <Bell size={16} />
        Alertes
        {alertsCount > 0 && (
          <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
            {alertsCount}
          </span>
        )}
      </button>
    </div>
  )
}
