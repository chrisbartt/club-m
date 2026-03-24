import type {
  Order,
  OrderItem,
  Product,
  Payment,
  Member,
  Customer,
  BusinessProfile,
} from '@/lib/generated/prisma/client'

export type OrderItemWithProduct = OrderItem & {
  product: Pick<Product, 'id' | 'name' | 'images' | 'type'>
}

export type OrderWithItems = Order & {
  items: OrderItemWithProduct[]
  payment: Payment | null
}

export type OrderForBuyer = OrderWithItems & {
  business: Pick<BusinessProfile, 'id' | 'businessName' | 'slug'>
}

export type OrderForSeller = OrderWithItems & {
  member: Pick<Member, 'id' | 'firstName' | 'lastName'> | null
  customer: Pick<Customer, 'id' | 'firstName' | 'lastName'> | null
}
