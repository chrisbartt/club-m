import type {
  PaymentProvider,
  CreatePaymentParams,
  PaymentResult,
  WebhookEvent,
  RefundResult,
} from './types'
import { PaymentProviderError } from './errors'

// ---------------------------------------------------------------------------
// Token cache — login once, reuse until it expires
// ---------------------------------------------------------------------------

let cachedToken: string | null = null
let tokenExpiresAt = 0

function getApiUrl(): string {
  return process.env.ARAKA_API_URL || 'https://araka-api-uat.azurewebsites.net'
}

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken

  const email = process.env.ARAKA_EMAIL
  const password = process.env.ARAKA_PASSWORD
  if (!email || !password) {
    throw new PaymentProviderError('PROVIDER_UNAVAILABLE')
  }

  const res = await fetch(`${getApiUrl()}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailAddress: email, password }),
  })

  if (!res.ok) {
    console.error('[ARAKA] Login failed:', res.status, await res.text().catch(() => ''))
    throw new PaymentProviderError('PROVIDER_ERROR')
  }

  const data = await res.json() as { token: string }
  cachedToken = data.token
  // Cache for 55 minutes (tokens typically last 1 hour)
  tokenExpiresAt = Date.now() + 55 * 60 * 1000

  return cachedToken
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export class ArakaProvider implements PaymentProvider {
  /**
   * Create a payment via ARAKA paymentrequest.
   * This triggers a USSD push to the customer's phone.
   * Returns providerRef (transactionId) and a redirect URL (not used for USSD flow).
   */
  async createPayment(params: CreatePaymentParams): Promise<PaymentResult> {
    const token = await getToken()
    const paymentPageId = process.env.ARAKA_PAYMENT_PAGE_ID

    if (!paymentPageId) {
      throw new PaymentProviderError('PROVIDER_UNAVAILABLE')
    }

    // Extract mobile money details from metadata
    const provider = params.metadata?.provider ?? 'MPESA'
    const walletId = params.metadata?.walletId
    if (!walletId) {
      throw new PaymentProviderError('INVALID_AMOUNT')
    }

    const body = {
      order: {
        paymentPageId,
        customerFullName: params.metadata?.customerName ?? '',
        customerPhoneNumber: walletId,
        customerEmailAddress: params.metadata?.customerEmail ?? '',
        transactionReference: params.metadata?.orderId ?? `CLM-${Date.now()}`,
        amount: params.amount,
        currency: params.currency,
        redirectURL: params.returnUrl,
      },
      paymentChannel: {
        channel: 'MOBILEMONEY',
        provider, // MPESA, AIRTEL, ORANGE
        walletID: walletId,
      },
    }

    const res = await fetch(`${getApiUrl()}/api/pay/paymentrequest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const errorText = await res.text().catch(() => '')
      console.error('[ARAKA] Payment request failed:', res.status, errorText)

      if (res.status === 400 || res.status === 403) {
        throw new PaymentProviderError('PAYMENT_DECLINED')
      }
      throw new PaymentProviderError('PROVIDER_ERROR')
    }

    const data = await res.json() as {
      transactionId: string
      originatingTransactionId: string
      statusCode: string
      statusDescription: string
    }

    // statusCode 202 = ACCEPTED (payment initiated, waiting for customer confirmation)
    const status = data.statusCode === '200' ? 'success'
      : data.statusCode === '202' ? 'pending'
      : 'failed'

    if (status === 'failed') {
      throw new PaymentProviderError('PAYMENT_DECLINED')
    }

    return {
      providerRef: data.transactionId,
      redirectUrl: '', // No redirect for USSD-based flow
      status,
    }
  }

  /**
   * Verify a callback/redirect from ARAKA.
   * ARAKA sends POST to redirectURL with { systemReference, transactionStatus }.
   */
  async verifyWebhook(payload: unknown): Promise<WebhookEvent> {
    const data = payload as {
      systemReference?: string
      transactionStatus?: string
      amount?: number
      currency?: string
    }

    if (!data.systemReference || !data.transactionStatus) {
      throw new PaymentProviderError('PROVIDER_ERROR')
    }

    const statusMap: Record<string, 'success' | 'failed' | 'refunded'> = {
      SUCCESS: 'success',
      APPROVED: 'success',
      DECLINED: 'failed',
      FAILED: 'failed',
    }

    return {
      providerRef: data.systemReference,
      status: statusMap[data.transactionStatus] ?? 'failed',
      amount: data.amount ?? 0,
      currency: data.currency ?? 'USD',
    }
  }

  /**
   * Poll ARAKA for transaction status.
   */
  async getPaymentStatus(providerRef: string): Promise<'pending' | 'success' | 'failed'> {
    const token = await getToken()

    const res = await fetch(
      `${getApiUrl()}/api/reporting/transactionstatus/${providerRef}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )

    if (!res.ok) {
      if (res.status === 404) return 'pending' // Transaction not yet processed
      console.error('[ARAKA] Status check failed:', res.status)
      throw new PaymentProviderError('PROVIDER_ERROR')
    }

    const data = await res.json() as {
      statusDescription: string
      statusCode: string
    }

    if (data.statusDescription === 'APPROVED' || data.statusDescription === 'SUCCESS') {
      return 'success'
    }
    if (data.statusDescription === 'DECLINED' || data.statusDescription === 'FAILED') {
      return 'failed'
    }
    return 'pending'
  }

  /**
   * Request refund via ARAKA Send Mobile Money (disbursement).
   */
  async requestRefund(providerRef: string, amount?: number): Promise<RefundResult> {
    // Refund requires the original transaction details — fetch them first
    const token = await getToken()

    // For now, refunds are not automated — mark as pending for manual processing
    console.warn(`[ARAKA] Refund requested for ${providerRef}, amount: ${amount}. Manual processing required.`)

    return {
      providerRef: `refund-${providerRef}`,
      status: 'failed', // Manual refunds not yet automated
    }
  }
}
