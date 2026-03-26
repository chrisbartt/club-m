import type { Product, BusinessProfile, Category, ProductVariant } from '@/lib/generated/prisma/client'

export type ProductWithBusiness = Product & {
  business: Pick<BusinessProfile, 'id' | 'memberId' | 'slug' | 'businessName'>
  category?: Pick<Category, 'id' | 'name' | 'slug'> | null
  variants?: ProductVariant[]
}

export type ProductListItem = Pick<
  Product,
  'id' | 'name' | 'description' | 'price' | 'currency' | 'images' | 'type' | 'categoryId' | 'isActive' | 'stock' | 'createdAt'
>
