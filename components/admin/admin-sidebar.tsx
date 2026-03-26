'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  Users,
  Calendar,
  BookOpen,
  Package,
  ShoppingCart,
  CreditCard,
  FileText,
  LogOut,
  ShieldCheck,
  Star,
  Tag,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/shared/theme-toggle'

const links = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/membres', label: 'Membres', icon: Users },
  { href: '/admin/kyc', label: 'KYC', icon: ShieldCheck },
  { href: '/admin/evenements', label: 'Evenements', icon: Calendar },
  { href: '/admin/annuaire', label: 'Annuaire', icon: BookOpen },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/produits', label: 'Produits', icon: Package },
  { href: '/admin/commandes', label: 'Commandes', icon: ShoppingCart },
  { href: '/admin/paiements', label: 'Paiements', icon: CreditCard },
  { href: '/admin/avis', label: 'Avis', icon: Star },
  { href: '/admin/litiges', label: 'Litiges', icon: AlertTriangle },
  { href: '/admin/journal', label: 'Journal', icon: FileText },
]

interface AdminSidebarProps {
  pendingKycCount?: number
}

export function AdminSidebar({ pendingKycCount }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden h-full w-64 flex-col border-r bg-background lg:flex">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/admin/dashboard" className="text-xl font-bold tracking-tight">
          Club M <span className="text-xs text-muted-foreground">Admin</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
              {link.href === '/admin/kyc' && pendingKycCount && pendingKycCount > 0 ? (
                <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                  {pendingKycCount}
                </span>
              ) : null}
            </Link>
          )
        })}
      </nav>
      <div className="border-t p-4 space-y-1">
        <ThemeToggle />
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <LogOut className="h-4 w-4" />
          Deconnexion
        </Button>
      </div>
    </aside>
  )
}
