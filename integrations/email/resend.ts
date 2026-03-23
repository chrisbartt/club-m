import { Resend } from 'resend'
import type { EmailProvider, SendEmailParams, EmailResult } from './types'

const DEFAULT_FROM = 'Club M <noreply@clubm.cd>'

export class ResendEmailProvider implements EmailProvider {
  private client: Resend

  constructor() {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) throw new Error('RESEND_API_KEY is not set')
    this.client = new Resend(apiKey)
  }

  async send(params: SendEmailParams): Promise<EmailResult> {
    try {
      const { data, error } = await this.client.emails.send({
        from: params.from ?? DEFAULT_FROM,
        to: params.to,
        subject: params.subject,
        html: params.html,
      })

      if (error) {
        console.error('[Email] Send failed:', error)
        return { id: '', status: 'failed' }
      }

      return { id: data?.id ?? '', status: 'sent' }
    } catch (err) {
      console.error('[Email] Send error:', err)
      return { id: '', status: 'failed' }
    }
  }
}
