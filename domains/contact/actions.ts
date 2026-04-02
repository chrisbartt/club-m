'use server'

import { z } from 'zod'
import { getEmailProvider } from '@/integrations/email'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

const contactSchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  email: z.string().email('Email invalide'),
  subject: z.string().min(1, 'Sujet requis'),
  message: z.string().min(10, 'Message trop court'),
})

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

type ActionResult = { success: true } | { success: false; error: string }

export async function submitContactForm(input: unknown): Promise<ActionResult> {
  const ip = await getClientIp()
  const rl = rateLimit(`contact:${ip}`, 3, 60 * 60 * 1000)
  if (!rl.success) {
    return { success: false, error: 'Trop de messages envoyes. Reessayez dans une heure.' }
  }

  const parsed = contactSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'Veuillez remplir tous les champs correctement.' }
  }

  const { name, email, subject, message } = parsed.data

  try {
    const emailProvider = getEmailProvider()
    await emailProvider.send({
      to: 'contact@clubm.cd',
      subject: `[Contact] ${escapeHtml(subject)} — ${escapeHtml(name)}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Sujet:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
      `,
    })
  } catch {
    console.log('[Contact] Form submitted:', { name, email, subject })
  }

  return { success: true }
}
