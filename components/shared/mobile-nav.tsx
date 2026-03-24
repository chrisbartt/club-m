'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

interface MobileNavProps {
  isLoggedIn: boolean
  links: { href: string; label: string }[]
}

export function MobileNav({ isLoggedIn, links }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle className="text-left">Club M</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 mt-6">
          {links.map((link) => (
            <Button
              key={link.href}
              asChild
              variant="ghost"
              className="justify-start"
              onClick={() => setOpen(false)}
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}

          <div className="my-4 border-t" />

          {isLoggedIn ? (
            <Button asChild onClick={() => setOpen(false)}>
              <Link href="/dashboard">Mon espace</Link>
            </Button>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                className="justify-start"
                onClick={() => setOpen(false)}
              >
                <Link href="/login">Connexion</Link>
              </Button>
              <Button asChild onClick={() => setOpen(false)}>
                <Link href="/register">Rejoindre Club M</Link>
              </Button>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
