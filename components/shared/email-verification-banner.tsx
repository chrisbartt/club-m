'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { resendVerificationEmail, changeEmailAndResend } from '@/domains/auth/actions'
import { X, Mail, AlertTriangle, Clock } from 'lucide-react'

interface EmailVerificationBannerProps {
  emailVerified: boolean
  createdAt: string
  userEmail: string
}

type Urgency = 'low' | 'medium' | 'high'

function getUrgency(createdAt: string): Urgency {
  const hours = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60)
  if (hours < 24) return 'low'
  if (hours < 48) return 'medium'
  return 'high'
}

const urgencyStyles: Record<Urgency, string> = {
  low: 'bg-amber-50 border-amber-200 text-amber-900',
  medium: 'bg-orange-50 border-orange-300 text-orange-900',
  high: 'bg-red-50 border-red-300 text-red-900',
}

const urgencyMessages: Record<Urgency, string> = {
  low: 'Verifiez votre email pour debloquer toutes les fonctionnalites',
  medium: 'Action requise : verifiez votre email',
  high: 'Action requise : verifiez votre email',
}

const COOLDOWN_MS = 2 * 60 * 1000 // 2 minutes

export function EmailVerificationBanner({
  emailVerified,
  createdAt,
  userEmail,
}: EmailVerificationBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  const [showChangeForm, setShowChangeForm] = useState(false)
  const [resending, setResending] = useState(false)
  const [changingEmail, setChangingEmail] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [cooldownEnd, setCooldownEnd] = useState<number | null>(null)
  const [cooldownLeft, setCooldownLeft] = useState(0)
  const [newEmail, setNewEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [showDialog, setShowDialog] = useState(false)

  const urgency = getUrgency(createdAt)

  // High urgency dialog on first render
  useEffect(() => {
    if (urgency === 'high' && !emailVerified) {
      const key = `email-verification-dismissed-${new Date(createdAt).getTime()}`
      if (!localStorage.getItem(key)) {
        setShowDialog(true)
        localStorage.setItem(key, 'true')
      }
    }
  }, [urgency, emailVerified, createdAt])

  // Restore cooldown from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('email-resend-cooldown')
    if (stored) {
      const end = parseInt(stored, 10)
      if (end > Date.now()) {
        setCooldownEnd(end)
      } else {
        localStorage.removeItem('email-resend-cooldown')
      }
    }
  }, [])

  // Countdown timer
  useEffect(() => {
    if (!cooldownEnd) {
      setCooldownLeft(0)
      return
    }
    const tick = () => {
      const remaining = Math.max(0, cooldownEnd - Date.now())
      setCooldownLeft(remaining)
      if (remaining <= 0) {
        setCooldownEnd(null)
        localStorage.removeItem('email-resend-cooldown')
      }
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [cooldownEnd])

  const startCooldown = useCallback(() => {
    const end = Date.now() + COOLDOWN_MS
    setCooldownEnd(end)
    localStorage.setItem('email-resend-cooldown', end.toString())
  }, [])

  const handleResend = async () => {
    setResending(true)
    setFeedback(null)
    try {
      const result = await resendVerificationEmail()
      if (result.success) {
        setFeedback({ type: 'success', message: result.data.message })
        startCooldown()
      } else {
        setFeedback({ type: 'error', message: result.error })
      }
    } catch {
      setFeedback({ type: 'error', message: 'Une erreur est survenue' })
    } finally {
      setResending(false)
    }
  }

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setChangingEmail(true)
    setFeedback(null)
    try {
      const result = await changeEmailAndResend({ newEmail, currentPassword })
      if (result.success) {
        setFeedback({ type: 'success', message: result.data.message })
        setShowChangeForm(false)
        setNewEmail('')
        setCurrentPassword('')
        startCooldown()
      } else {
        setFeedback({ type: 'error', message: result.error })
      }
    } catch {
      setFeedback({ type: 'error', message: 'Une erreur est survenue' })
    } finally {
      setChangingEmail(false)
    }
  }

  if (emailVerified || dismissed) return null

  const cooldownSeconds = Math.ceil(cooldownLeft / 1000)
  const cooldownMinutes = Math.floor(cooldownSeconds / 60)
  const cooldownSecs = cooldownSeconds % 60

  return (
    <>
      {/* Dismissable dialog for high urgency */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Verification requise
              </h3>
            </div>
            <p className="mb-2 text-gray-700">
              Votre email <span className="font-medium">{userEmail}</span> n&apos;est
              toujours pas verifie.
            </p>
            <p className="mb-6 text-sm text-gray-500">
              Verifiez votre boite de reception ou renvoyez un email de
              verification depuis la banniere ci-dessous.
            </p>
            <Button
              onClick={() => setShowDialog(false)}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Compris
            </Button>
          </div>
        </div>
      )}

      {/* Banner */}
      <div
        className={`sticky top-0 z-40 w-full border-b px-4 py-3 transition-colors duration-300 ${urgencyStyles[urgency]}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" />
              <span className="text-sm font-medium">
                {urgencyMessages[urgency]}
              </span>
            </div>

            <p className="text-xs opacity-80">
              Email actuel : <span className="font-medium">{userEmail}</span>
            </p>

            {feedback && (
              <div
                className={`rounded px-3 py-1.5 text-xs ${
                  feedback.type === 'error'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {feedback.message}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleResend}
                disabled={resending || cooldownLeft > 0}
                className="h-7 text-xs"
              >
                {resending ? (
                  'Envoi...'
                ) : cooldownLeft > 0 ? (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {cooldownMinutes > 0
                      ? `${cooldownMinutes}m${cooldownSecs.toString().padStart(2, '0')}s`
                      : `${cooldownSecs}s`}
                  </span>
                ) : (
                  'Renvoyer'
                )}
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowChangeForm(!showChangeForm)}
                className="h-7 text-xs underline"
              >
                {showChangeForm ? 'Annuler' : 'Modifier mon email'}
              </Button>
            </div>

            {showChangeForm && (
              <form
                onSubmit={handleChangeEmail}
                className="mt-1 flex flex-wrap items-end gap-2"
              >
                <div className="space-y-1">
                  <Label htmlFor="new-email" className="text-xs">
                    Nouvel email
                  </Label>
                  <Input
                    id="new-email"
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="nouveau@email.com"
                    className="h-8 w-52 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="current-password" className="text-xs">
                    Mot de passe actuel
                  </Label>
                  <Input
                    id="current-password"
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-8 w-44 text-xs"
                  />
                </div>
                <Button
                  type="submit"
                  size="sm"
                  disabled={changingEmail}
                  className="h-8 text-xs bg-primary hover:bg-primary/90"
                >
                  {changingEmail ? 'Envoi...' : 'Modifier et renvoyer'}
                </Button>
              </form>
            )}
          </div>

          <button
            onClick={() => setDismissed(true)}
            className="shrink-0 rounded p-1 opacity-60 transition-opacity hover:opacity-100"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  )
}
