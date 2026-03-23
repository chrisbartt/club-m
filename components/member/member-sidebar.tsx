'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  User,
  Calendar,
  BookOpen,
  Ticket,
  ShoppingBag,
  Briefcase,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface MemberSidebarProps {
  memberTier: string
}

const baseLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/profil', label: 'Profil', icon: User },
  { href: '/evenements', label: 'Evenements', icon: Calendar },
  { href: '/annuaire', label: 'Annuaire', icon: BookOpen },
  { href: '/tickets', label: 'Mes tickets', icon: Ticket },
  { href: '/achats', label: 'Mes achats', icon: ShoppingBag },
]

export function MemberSidebar({ memberTier }: MemberSidebarProps) {
  const pathname = usePathname()

  const links = memberTier === 'BUSINESS'
    ? [...baseLinks, { href: '/mon-business', label: 'Mon business', icon: Briefcase }]
    : baseLinks

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="text-xl font-bold tracking-tight">
          Club M
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
            </Link>
          )
        })}
      </nav>
      <div className="border-t p-4">
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
