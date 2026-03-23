export interface SendEmailParams {
  to: string
  subject: string
  html: string
  from?: string
}

export interface EmailResult {
  id: string
  status: 'sent' | 'failed'
}

export interface EmailProvider {
  send(params: SendEmailParams): Promise<EmailResult>
}
