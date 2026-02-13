import { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/'],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  }
}

