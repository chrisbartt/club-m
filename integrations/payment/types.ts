export interface CreatePaymentParams {
  amount: number
  currency: 'USD' | 'CDF' | 'EUR'
  description: string
  metadata?: Record<string, string>
  returnUrl: string
  cancelUrl: string
}

export interface PaymentResult {
  providerRef: string
  redirectUrl: string
  status: 'pending' | 'success' | 'failed'
}

export interface WebhookEvent {
  providerRef: string
  status: 'success' | 'failed' | 'refunded'
  amount: number
  currency: string
  metadata?: Record<string, string>
}

export interface RefundResult {
  providerRef: string
  status: 'success' | 'failed'
}

export interface PaymentProvider {
  createPayment(params: CreatePaymentParams): Promise<PaymentResult>
  verifyWebhook(payload: unknown, signature: string): Promise<WebhookEvent>
  getPaymentStatus(providerRef: string): Promise<'pending' | 'success' | 'failed'>
  requestRefund(providerRef: string, amount?: number): Promise<RefundResult>
}
