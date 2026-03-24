import { z } from 'zod'

export const createUpgradeSchema = z.object({
  targetTier: z.enum(['PREMIUM', 'BUSINESS'], {
    error: 'Tier cible invalide',
  }),
})
