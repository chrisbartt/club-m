'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function MemberError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[MemberError]', error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-md">
        <h2 className="text-xl font-bold">Erreur dans l&apos;espace membre</h2>
        <p className="text-muted-foreground text-sm">
          Un probleme est survenu. Veuillez reessayer ou retourner au tableau de bord.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
          >
            Reessayer
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 px-5 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Tableau de bord
          </Link>
        </div>
      </div>
    </div>
  )
}
