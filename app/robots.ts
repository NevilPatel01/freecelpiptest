import { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/constants'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/admin/"],
      },
      // Explicitly allow common AI retrieval/indexing crawlers on public content.
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "Google-Extended",
          "ClaudeBot",
          "PerplexityBot",
          "CCBot",
        ],
        allow: ["/", "/blog/", "/resources/", "/practice/"],
        disallow: ["/dashboard/", "/admin/"],
      },
    ],
    host: getSiteUrl(),
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  }
}

