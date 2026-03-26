import "server-only"

import { remark } from "remark"
import remarkGfm from "remark-gfm"
import html from "remark-html"
import {
  serverGetBlogById,
  serverGetPublishedBlogBySlug,
  serverListAllBlogDocs,
  serverListPublishedBlogDocs,
  serverGetBlogDocBySlugAny,
} from "./appwrite/server"

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

export async function markdownToHtml(markdown: string): Promise<string> {
  const processed = await remark().use(remarkGfm).use(html).process(markdown)
  return processed.toString()
}

export function computeReadingTime(content: string): number {
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / 200))
}

export async function getAllPublishedPostsDb(): Promise<BlogPostDb[]> {
  return serverListPublishedBlogDocs()
}

export async function getPublishedPostBySlugDb(
  slug: string
): Promise<BlogPostDb | null> {
  return serverGetPublishedBlogBySlug(slug)
}

export async function getAllPostsAdminDb(): Promise<BlogPostDb[]> {
  return serverListAllBlogDocs()
}

export async function getPostByIdDb(id: string): Promise<BlogPostDb | null> {
  return serverGetBlogById(id)
}

export async function getPostBySlugDb(slug: string): Promise<BlogPostDb | null> {
  return serverGetBlogDocBySlugAny(slug)
}
