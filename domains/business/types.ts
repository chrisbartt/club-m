import type { Product, BusinessProfile, Category } from '@/lib/generated/prisma/client'

export type ProductWithBusiness = Product & {
  business: Pick<BusinessProfile, 'id' | 'memberId' | 'slug' | 'businessName'>
  category?: Pick<Category, 'id' | 'name' | 'slug'> | null
}

export type ProductListItem = Pick<
  Product,
  'id' | 'name' | 'description' | 'price' | 'currency' | 'images' | 'type' | 'categoryId' | 'isActive' | 'stock' | 'createdAt'
>
