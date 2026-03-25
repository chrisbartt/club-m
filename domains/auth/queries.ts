import { db } from '@/lib/db'

export async function findValidPasswordResetToken(hashedToken: string) {
  return db.passwordResetToken.findFirst({
    where: {
      token: hashedToken,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  })
}

export async function findValidEmailVerificationToken(hashedToken: string) {
  return db.emailVerificationToken.findFirst({
    where: {
      token: hashedToken,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  })
}

export async function getLastPasswordResetRequest(userId: string) {
  return db.passwordResetToken.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getLastVerificationEmailSent(userId: string) {
  return db.emailVerificationToken.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}
