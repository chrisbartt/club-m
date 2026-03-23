import Link from 'next/link'
import { auth } from '@/lib/auth'
import { Button } from '@/components/ui/button'

export async function Navbar() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Club M
        </Link>
        <nav className="flex items-center gap-4">
          {session ? (
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard">Dashboard</Link>
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
        </nav>
      </div>
    </header>
  )
}
