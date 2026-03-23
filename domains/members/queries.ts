import { db } from '@/lib/db'

export async function getUserByEmail(email: string) {
  return db.user.findUnique({
    where: { email },
    include: { member: true, customer: true, adminAccount: true },
  })
}

export async function getMemberByUserId(userId: string) {
  return db.member.findUnique({
    where: { userId },
  })
}

export async function getCustomerByUserId(userId: string) {
  return db.customer.findUnique({
    where: { userId },
  })
}
