import type { User, Member, Customer } from '@/lib/generated/prisma/client'

export type UserWithMember = User & { member: Member }
export type UserWithCustomer = User & { customer: Customer }

export type RegisterMemberInput = {
  email: string
  password: string
  firstName: string
  lastName: string
  certifyWoman: boolean
  acceptTerms: boolean
}

export type RegisterCustomerInput = {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

export type LoginInput = {
  email: string
  password: string
}
