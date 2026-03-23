import type { EmailProvider } from './types'
import { ResendEmailProvider } from './resend'

export function getEmailProvider(): EmailProvider {
  return new ResendEmailProvider()
}

export type { EmailProvider, SendEmailParams, EmailResult } from './types'
