import type {
  BusinessProfile,
  Category,
  Member,
  Product,
} from '@/lib/generated/prisma/client'

export type ProfileWithMember = BusinessProfile & {
  member: Pick<Member, 'id' | 'firstName' | 'lastName' | 'avatar' | 'tier' | 'verificationStatus'>
}

export type ProfileWithProducts = BusinessProfile & {
  member: Pick<Member, 'id' | 'firstName' | 'lastName' | 'avatar' | 'tier' | 'verificationStatus'>
  products: (Product & { category?: Pick<Category, 'id' | 'name' | 'slug'> | null })[]
}

export type PublicProfileListItem = Pick<
  BusinessProfile,
  'id' | 'businessName' | 'slug' | 'description' | 'category' | 'coverImage' | 'profileType'
> & {
  member: Pick<Member, 'firstName' | 'lastName' | 'avatar'>
  _count: { products: number }
}
