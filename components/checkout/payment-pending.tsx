'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Smartphone, AlertCircle, RefreshCcw } from 'lucide-react'

interface PaymentPendingProps {
  transactionId: string
  orderId: string
  provider: string
  onFailed: () => void
}

const POLL_INTERVAL = 3000 // 3 seconds
const TIMEOUT = 5 * 60 * 1000 // 5 minutes

const PROVIDER_LABELS: Record<string, string> = {
  MPESA: 'M-Pesa',
  AIRTEL: 'Airtel Money',
  ORANGE: 'Orange Money',
}

export function PaymentPending({
  transactionId,
  orderId,
  provider,
  onFailed,
}: PaymentPendingProps) {
  const router = useRouter()
  const [elapsed, setElapsed] = useState(0)
  const [timedOut, setTimedOut] = useState(false)

  const pollStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/payments/status/${transactionId}`)
      if (!res.ok) return

      const data = await res.json()

      if (data.status === 'success') {
        router.push(`/confirmation/${orderId}`)
      } else if (data.status === 'failed') {
        onFailed()
      }
    } catch {
      // Network error — keep polling
    }
  }, [transactionId, orderId, router, onFailed])

  useEffect(() => {
    const startTime = Date.now()

    const interval = setInterval(() => {
      const now = Date.now()
      setElapsed(now - startTime)

      if (now - startTime > TIMEOUT) {
        setTimedOut(true)
        clearInterval(interval)
        return
      }

      pollStatus()
    }, POLL_INTERVAL)

    // Initial poll
    pollStatus()

    return () => clearInterval(interval)
  }, [pollStatus])

  const providerLabel = PROVIDER_LABELS[provider] ?? provider
  const remainingSeconds = Math.max(0, Math.ceil((TIMEOUT - elapsed) / 1000))
  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = remainingSeconds % 60

  if (timedOut) {
    return (
      <div className="text-center py-12 px-4">
        <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-orange-500" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">
          Delai d&apos;attente depasse
        </h2>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Nous n&apos;avons pas recu la confirmation de votre paiement.
          Si vous avez confirme sur votre telephone, le paiement sera traite automatiquement.
        </p>
        <button
          onClick={() => {
            setTimedOut(false)
            setElapsed(0)
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
          Reessayer
        </button>
      </div>
    )
  }

  return (
    <div className="text-center py-12 px-4">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 animate-pulse">
        <Smartphone className="w-10 h-10 text-primary" />
      </div>

      <h2 className="text-xl font-bold text-foreground mb-2">
        Confirmez sur votre telephone
      </h2>

      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        Un message {providerLabel} a ete envoye sur votre telephone.
        Entrez votre code PIN pour confirmer le paiement.
      </p>

      <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-4">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>En attente de confirmation...</span>
      </div>

      <p className="text-xs text-gray-300">
        Temps restant : {minutes}:{seconds.toString().padStart(2, '0')}
      </p>
    </div>
  )
}
