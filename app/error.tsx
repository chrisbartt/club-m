'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-md">
        <h2 className="text-2xl font-bold">Une erreur est survenue</h2>
        <p className="text-muted-foreground">
          Nous sommes desoles, quelque chose s&apos;est mal passe. Veuillez reessayer.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          Reessayer
        </button>
      </div>
    </div>
  )
}
