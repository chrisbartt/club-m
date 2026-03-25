interface ConfirmationCodeDisplayProps {
  code: string
  expiresAt: string
  status: string
}

export function ConfirmationCodeDisplay({ code, expiresAt, status }: ConfirmationCodeDisplayProps) {
  if (status === 'DELIVERED' || status === 'COMPLETED') {
    return (
      <div className="rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 p-6 text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <svg
            className="h-6 w-6 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-semibold text-green-700 dark:text-green-400">
            Livraison confirmee
          </p>
        </div>
      </div>
    )
  }

  if (status === 'PAID' || status === 'SHIPPED') {
    const isExpired = new Date(expiresAt) < new Date()
    const expiryDate = new Date(expiresAt).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-primary/5 border border-primary/20 p-6 text-center space-y-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Code de confirmation
          </p>
          <p className="text-4xl font-bold font-mono tracking-[0.4em] text-center">
            {code}
          </p>
          <p className="text-sm text-muted-foreground">
            Donnez ce code a la livreuse pour confirmer la reception
          </p>
          <p className="text-xs text-muted-foreground">
            Expire le {expiryDate}
          </p>
          {isExpired && (
            <div className="rounded-md bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 p-2">
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                Code expire
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}
