'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  User,
  Calendar,
  BookOpen,
  Tag,
  Ticket,
  ShoppingBag,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Bell,
  Briefcase,
  ArrowUpCircle,
  ShieldCheck,
  PiggyBank,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { VerifiedBadge } from '@/components/member/verified-badge'
import { ThemeToggle } from '@/components/shared/theme-toggle'

interface MemberSidebarProps {
  memberTier: string
  verificationStatus: string
  unreadNotificationCount?: number
}

const baseLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/profil', label: 'Profil', icon: User },
  { href: '/evenements', label: 'Evenements', icon: Calendar },
  { href: '/annuaire', label: 'Annuaire', icon: BookOpen },
  { href: '/tickets', label: 'Mes tickets', icon: Ticket },
  { href: '/achats', label: 'Mes achats', icon: ShoppingBag },
  { href: '/epargne-tontines', label: 'Epargne', icon: PiggyBank },
]

export function MemberSidebar({ memberTier, verificationStatus, unreadNotificationCount = 0 }: MemberSidebarProps) {
  const pathname = usePathname()
  const isVerified = verificationStatus === 'VERIFIED'
  const showUpgrade = memberTier === 'FREE' || memberTier === 'PREMIUM'
  const showKyc = !isVerified

  const links = [
    ...baseLinks,
    { href: '/notifications', label: 'Notifications', icon: Bell },
    ...(memberTier === 'PREMIUM' || memberTier === 'BUSINESS'
      ? [
          { href: '/mon-business', label: 'Mon business', icon: Briefcase },
          { href: '/mon-business/commandes', label: 'Commandes', icon: ShoppingCart },
          { href: '/mon-business/produits', label: 'Produits', icon: Package },
          { href: '/mon-business/clients', label: 'Clients', icon: Users },
          { href: '/mon-business/revenus', label: 'Revenus', icon: BarChart3 },
          { href: '/mon-business/coupons', label: 'Coupons', icon: Tag },
        ]
      : []),
    ...(showUpgrade
      ? [{ href: '/upgrade', label: 'Upgrade', icon: ArrowUpCircle }]
      : []),
    ...(showKyc
      ? [{ href: '/kyc', label: 'Verification', icon: ShieldCheck }]
      : []),
  ]

  return (
    <aside className="hidden h-full w-64 flex-col border-r bg-background lg:flex">
      <div className="flex h-14 items-center justify-between border-b px-4">
        <Link href="/dashboard" className="text-xl font-bold tracking-tight">
          Club M
        </Link>
        {isVerified && <VerifiedBadge />}
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
              {link.href === '/notifications' && unreadNotificationCount > 0 && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                  {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
                </span>
              )}
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
