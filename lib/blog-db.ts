import { prisma } from "./prisma"
import { remark } from "remark"
import remarkGfm from "remark-gfm"
import html from "remark-html"

export interface BlogPostDb {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featuredImage: string | null
  category: string
  tags: string[]
  readingTime: number
  author: string | null
  published: boolean
  publishedAt: Date | null
  views: number
  createdAt: Date
  updatedAt: Date
}

/** Convert markdown to HTML for display */
export async function markdownToHtml(markdown: string): Promise<string> {
  const processed = await remark().use(remarkGfm).use(html).process(markdown)
  return processed.toString()
}

/** Compute reading time (words / 200 per minute) */
export function computeReadingTime(content: string): number {
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / 200))
}

/** Get all published posts from DB, sorted by publishedAt desc */
export async function getAllPublishedPostsDb(): Promise<BlogPostDb[]> {
  const posts = await prisma.blogPost.findMany({
    where: { published: true, publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
  })
  return posts as BlogPostDb[]
}

/** Get one published post by slug from DB */
export async function getPublishedPostBySlugDb(slug: string): Promise<BlogPostDb | null> {
  const post = await prisma.blogPost.findFirst({
    where: { slug, published: true, publishedAt: { not: null } },
  })
  return post as BlogPostDb | null
}

/** Get all posts from DB (including drafts) for admin */
export async function getAllPostsAdminDb() {
  return prisma.blogPost.findMany({
    orderBy: [{ published: "desc" }, { updatedAt: "desc" }],
  })
}

/** Get one post by id (admin) or by slug (public) */
export async function getPostByIdDb(id: string) {
  return prisma.blogPost.findUnique({ where: { id } })
}

export async function getPostBySlugDb(slug: string) {
  return prisma.blogPost.findUnique({ where: { slug } })
}

export { prisma }
