import { db } from '@/lib/db'

export async function getCategories() {
  return db.category.findMany({
    orderBy: { name: 'asc' },
  })
}

export async function getActiveCategories() {
  return db.category.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  })
}

export async function getCategoriesWithProductCount() {
  return db.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } },
  })
}
