import type { KycProvider } from './types'
import { ManualKycProvider } from './manual'

export function getKycProvider(): KycProvider {
  const provider = process.env.KYC_PROVIDER ?? 'manual'
  switch (provider) {
    case 'manual':
      return new ManualKycProvider()
    default:
      throw new Error(`Unknown KYC provider: ${provider}`)
  }
}

export type { KycProvider, KycSubmitParams, KycSubmitResult, KycProviderStatus } from './types'
