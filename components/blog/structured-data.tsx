import type { BlogPost } from "@/lib/blog"
import { getSiteUrl, APP_NAME } from "@/lib/constants"

interface StructuredDataProps {
  post: BlogPost
}

export function BlogPostStructuredData({ post }: StructuredDataProps) {
  const siteUrl = getSiteUrl()
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage || `${siteUrl}/og-image.jpg`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      "@type": "Organization",
      name: APP_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: APP_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`,
    },
    articleSection: post.category,
    keywords: post.tags.join(", "),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

