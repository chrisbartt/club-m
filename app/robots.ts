import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clubm.cd'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/dashboard/',
        '/mon-business/',
        '/profil/',
        '/kyc/',
        '/achats/',
        '/tickets/',
        '/notifications/',
        '/upgrade/',
        '/checkout/',
        '/login/',
        '/register/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
