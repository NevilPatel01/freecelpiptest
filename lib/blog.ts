import {
  getAllPublishedPostsDb,
  getPublishedPostBySlugDb,
  markdownToHtml,
} from "./blog-db"
import { DEFAULT_AUTHOR } from "./constants"

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  readingTime: number
  publishedAt: string
  featuredImage?: string
  coverImage?: string
  keywords?: string[]
  author?: string
  updatedAt?: string
}

function dbPostToBlogPost(
  post: {
    slug: string
    title: string
    excerpt: string
    content: string
    featuredImage: string | null
    category: string
    tags: string[]
    readingTime: number
    author: string | null
    publishedAt: Date | null
    updatedAt: Date
  },
  contentHtml: string
): BlogPost {
  const img = post.featuredImage ?? undefined
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: contentHtml,
    category: post.category,
    tags: post.tags,
    readingTime: post.readingTime,
    publishedAt: post.publishedAt?.toISOString() ?? new Date().toISOString(),
    featuredImage: img,
    coverImage: img,
    keywords: post.tags,
    author: post.author ?? DEFAULT_AUTHOR,
    updatedAt: post.updatedAt.toISOString(),
  }
}

export function getBlogPostSlugs(): Promise<string[]> {
  return getAllPublishedPostsDb().then((posts) => posts.map((p) => p.slug))
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const post = await getPublishedPostBySlugDb(slug)
  if (!post) return null
  const contentHtml = await markdownToHtml(post.content)
  return dbPostToBlogPost(post, contentHtml)
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const posts = await getAllPublishedPostsDb()
  const withHtml = await Promise.all(
    posts.map(async (post) => {
      const contentHtml = await markdownToHtml(post.content)
      return dbPostToBlogPost(post, contentHtml)
    })
  )
  return withHtml
}

export function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  return getAllBlogPosts().then((posts) =>
    posts.filter(
      (post) => post.category.toLowerCase() === category.toLowerCase()
    )
  )
}

export function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  return getAllBlogPosts().then((posts) =>
    posts.filter((post) =>
      post.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    )
  )
}
