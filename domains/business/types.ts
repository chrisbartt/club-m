import type { Product, BusinessProfile } from '@/lib/generated/prisma/client'

export type ProductWithBusiness = Product & {
  business: Pick<BusinessProfile, 'id' | 'memberId' | 'slug' | 'businessName'>
}

export type ProductListItem = Pick<
  Product,
  'id' | 'name' | 'description' | 'price' | 'currency' | 'images' | 'type' | 'category' | 'isActive' | 'stock' | 'createdAt'
>
