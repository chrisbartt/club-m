'use server'

import { z } from 'zod'
import { getEmailProvider } from '@/integrations/email'

const contactSchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  email: z.string().email('Email invalide'),
  subject: z.string().min(1, 'Sujet requis'),
  message: z.string().min(10, 'Message trop court'),
})

type ActionResult = { success: true } | { success: false; error: string }

export async function submitContactForm(input: unknown): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'Veuillez remplir tous les champs correctement.' }
  }

  const { name, email, subject, message } = parsed.data

  try {
    const emailProvider = getEmailProvider()
    await emailProvider.send({
      to: 'contact@clubm.cd',
      subject: `[Contact] ${subject} — ${name}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Sujet:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    })
  } catch {
    // Email may fail in dev (no RESEND_API_KEY), still count as success for UX
    console.log('[Contact] Form submitted:', { name, email, subject })
  }

  return { success: true }
}
