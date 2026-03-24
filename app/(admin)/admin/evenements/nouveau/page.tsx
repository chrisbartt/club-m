'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { EventForm, type EventFormValues } from '@/components/events/event-form'
import { createEvent } from '@/domains/events/actions'

export default function NouvelEvenementPage() {
  const router = useRouter()

  async function handleSubmit(data: EventFormValues) {
    const result = await createEvent(data)
    if (result.success) {
      router.push('/admin/evenements')
    }
    return result
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/evenements"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux evenements
      </Link>

      <div>
        <h1 className="text-2xl font-bold">Nouvel evenement</h1>
        <p className="text-muted-foreground">Remplissez les informations pour creer un evenement</p>
      </div>

      <EventForm onSubmit={handleSubmit} />
    </div>
  )
}
