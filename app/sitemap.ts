import type { MetadataRoute } from 'next'
import { db } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clubm.cd'

  const staticPages = [
    '', '/marketplace', '/evenements', '/annuaires', '/contact',
    '/a-propos', '/devenir-membre', '/cgu', '/confidentialite', '/mentions-legales',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
  }))

  const products = await db.product.findMany({
    where: { isActive: true, business: { isApproved: true, profileType: 'STORE' } },
    select: { id: true, updatedAt: true, business: { select: { slug: true } } },
  })
  const productPages = products.map((p) => ({
    url: `${baseUrl}/boutique/${p.business.slug}/produit/${p.id}`,
    lastModified: p.updatedAt,
    changeFrequency: 'daily' as const,
  }))

  const boutiques = await db.businessProfile.findMany({
    where: { isApproved: true, profileType: 'STORE' },
    select: { slug: true, updatedAt: true },
  })
  const boutiquePages = boutiques.map((b) => ({
    url: `${baseUrl}/boutique/${b.slug}`,
    lastModified: b.updatedAt,
    changeFrequency: 'daily' as const,
  }))

  const events = await db.event.findMany({
    where: { startDate: { gte: new Date() } },
    select: { id: true, updatedAt: true },
  })
  const eventPages = events.map((e) => ({
    url: `${baseUrl}/evenements/${e.id}`,
    lastModified: e.updatedAt,
    changeFrequency: 'weekly' as const,
  }))

  return [...staticPages, ...productPages, ...boutiquePages, ...eventPages]
}
