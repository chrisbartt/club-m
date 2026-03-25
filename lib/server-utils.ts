import { randomBytes, createHash } from 'crypto'
import { TOKEN_LENGTH } from './constants'

export function generateSecureToken(length: number = TOKEN_LENGTH): string {
  return randomBytes(length).toString('hex').slice(0, length)
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export function formatOrderNumber(orderId: string): string {
  return `CM-${orderId.slice(0, 8).toUpperCase()}`
}
