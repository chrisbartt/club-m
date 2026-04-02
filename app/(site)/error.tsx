'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[SiteError]', error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-md">
        <h2 className="text-xl font-bold">Oups, une erreur est survenue</h2>
        <p className="text-muted-foreground text-sm">
          Veuillez reessayer ou retourner a la page d&apos;accueil.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-md bg-[#a55b46] px-5 py-2 text-sm font-medium text-white hover:bg-[#8a4a38] transition-colors"
          >
            Reessayer
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 px-5 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
