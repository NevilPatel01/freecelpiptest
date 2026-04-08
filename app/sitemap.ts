import { MetadataRoute } from "next"
import { absoluteSitePath } from "@/lib/constants"
import { getAllBlogPosts, getBlogPostSlugs } from "@/lib/blog"

export const dynamic = "force-static"

function blogSitemapEntries(): MetadataRoute.Sitemap {
  const postsSync = (() => {
    try {
      return getBlogPostSlugs()
    } catch {
      return []
    }
  })()

  return postsSync.map((slug) => ({
    url: absoluteSitePath(`/blog/${slug}`),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let blogUrls: MetadataRoute.Sitemap = []
  try {
    const posts = await getAllBlogPosts()
    if (posts.length > 0) {
      blogUrls = posts.map((post) => ({
        url: absoluteSitePath(`/blog/${post.slug}`),
        lastModified: post.updatedAt
          ? new Date(post.updatedAt)
          : new Date(post.publishedAt),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }))
    } else {
      blogUrls = blogSitemapEntries()
    }
  } catch (error) {
    console.error("[sitemap] Failed to load posts; falling back to slug list:", error)
    blogUrls = blogSitemapEntries()
  }

  return [
    {
      url: absoluteSitePath("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteSitePath("/practice"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteSitePath("/practice/listening"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteSitePath("/practice/reading"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteSitePath("/practice/writing"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteSitePath("/practice/speaking"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteSitePath("/mock-tests"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteSitePath("/blog"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...blogUrls,
    {
      url: absoluteSitePath("/getting-started"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteSitePath("/about-celpip"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteSitePath("/resources"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: absoluteSitePath("/contact"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteSitePath("/privacy"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteSitePath("/terms"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]
}
