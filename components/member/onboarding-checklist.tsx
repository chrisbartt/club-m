'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Check, Circle, X, Mail, User, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface OnboardingChecklistProps {
  emailVerified: boolean
  hasPhone: boolean
  hasBio: boolean
  verificationStatus: string
}

const DISMISSED_KEY = 'onboarding-dismissed'

export function OnboardingChecklist({
  emailVerified,
  hasPhone,
  hasBio,
  verificationStatus,
}: OnboardingChecklistProps) {
  const [dismissed, setDismissed] = useState(true) // start hidden to avoid flash

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISSED_KEY) === 'true')
  }, [])

  const profileComplete = hasPhone && hasBio
  const kycSubmitted = verificationStatus !== 'DECLARED'
  const allDone = emailVerified && profileComplete && kycSubmitted

  if (dismissed || allDone) return null

  const steps = [
    {
      label: 'Verifier votre email',
      done: emailVerified,
      href: '/profil',
      icon: Mail,
    },
    {
      label: 'Completer votre profil',
      description: 'Ajoutez votre telephone et bio',
      done: profileComplete,
      href: '/profil',
      icon: User,
    },
    {
      label: 'Soumettre votre KYC',
      description: 'Verifiez votre identite',
      done: kycSubmitted,
      href: '/kyc',
      icon: ShieldCheck,
    },
  ]

  const completedCount = [emailVerified, profileComplete, kycSubmitted].filter(Boolean).length
  const totalCheckable = 3

  function handleDismiss() {
    localStorage.setItem(DISMISSED_KEY, 'true')
    setDismissed(true)
  }

  return (
    <div className="mb-6 rounded-lg border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            {allDone ? 'Bienvenue dans Club M !' : 'Commencez ici'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {completedCount}/{totalCheckable} etapes completees
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleDismiss} title="Masquer">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress bar */}
      <div className="mb-5 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${(completedCount / totalCheckable) * 100}%` }}
        />
      </div>

      <div className="space-y-3">
        {steps.map((step) => {
          const Icon = step.icon
          const isDone = 'done' in step && step.done
          return (
            <div
              key={step.label}
              className={cn(
                'flex items-center gap-3 rounded-md border px-4 py-3',
                isDone && 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950'
              )}
            >
              {isDone ? (
                <Check className="h-5 w-5 shrink-0 text-green-600" />
              ) : (
                <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
              )}
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-medium', isDone && 'line-through text-muted-foreground')}>
                  {step.label}
                </p>
                {'description' in step && step.description && !isDone && (
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                )}
              </div>
              {!isDone && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={step.href}>
                    Completer
                  </Link>
                </Button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
