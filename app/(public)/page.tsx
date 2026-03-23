import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-8 px-4 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Club M</h1>
        <p className="mx-auto max-w-lg text-lg text-muted-foreground">
          La communaute des femmes entrepreneures a Kinshasa. Rejoignez un reseau de femmes
          ambitieuses qui transforment le paysage entrepreneurial.
        </p>
      </div>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/register">Rejoindre Club M</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/login">Se connecter</Link>
        </Button>
      </div>
    </div>
  )
}
