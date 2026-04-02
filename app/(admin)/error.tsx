'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[AdminError]', error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-md">
        <h2 className="text-xl font-bold">Erreur dans l&apos;espace admin</h2>
        <p className="text-muted-foreground text-sm">
          Un probleme est survenu. Veuillez reessayer ou retourner au dashboard admin.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Reessayer
          </button>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 px-5 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Dashboard admin
          </Link>
        </div>
      </div>
    </div>
  )
}
