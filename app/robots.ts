import { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/constants'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/admin/'],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  }
}

