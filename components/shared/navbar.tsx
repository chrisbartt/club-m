import Link from 'next/link'
import { auth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { MobileNav } from './mobile-nav'

const NAV_LINKS = [
  { href: '/a-propos', label: 'A propos' },
  { href: '/devenir-membre', label: 'Offres' },
  { href: '/evenements', label: 'Evenements' },
  { href: '/annuaire', label: 'Annuaire' },
  { href: '/contact', label: 'Contact' },
]

export async function Navbar() {
  const session = await auth()
  const isLoggedIn = !!session

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight">
          Club M
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Button key={link.href} asChild variant="ghost" size="sm">
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn ? (
            <Button asChild size="sm">
              <Link href="/dashboard">Mon espace</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Connexion</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Rejoindre Club M</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <MobileNav isLoggedIn={isLoggedIn} links={NAV_LINKS} />
        </div>
      </div>
    </header>
  )
}
