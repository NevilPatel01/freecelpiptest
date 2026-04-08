import { remark } from "remark"
import remarkGfm from "remark-gfm"
import html from "remark-html"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { DEFAULT_AUTHOR } from "@/lib/constants"

const postsDirectory = path.join(process.cwd(), "content/blog")

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

function getSlugFiles(): string[] {
  if (!fs.existsSync(postsDirectory)) return []
  return fs
    .readdirSync(postsDirectory)
    .filter(
      (file) =>
        (file.endsWith(".md") || file.endsWith(".mdx")) &&
        !file.toLowerCase().includes("readme")
    )
}

/** Synchronous: uses `fs.readdirSync` only — safe to call from `generateStaticParams` without `await`. */
export function getBlogPostSlugs(): string[] {
  return getSlugFiles().map((file) => file.replace(/\.(md|mdx)$/i, ""))
}

async function markdownToHtml(markdown: string): Promise<string> {
  const processed = await remark().use(remarkGfm).use(html).process(markdown)
  return processed.toString()
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  let fullPath = path.join(postsDirectory, `${slug}.mdx`)
  if (!fs.existsSync(fullPath)) {
    fullPath = path.join(postsDirectory, `${slug}.md`)
  }
  if (!fs.existsSync(fullPath)) return null

  const raw = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(raw)
  const contentHtml = await markdownToHtml(content)
  const wordCount = content.split(/\s+/).filter(Boolean).length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))
  const keywords = data.keywords ?? data.tags ?? []
  const publishedAt = data.publishedAt || data.date || new Date().toISOString()
  const img = data.coverImage || data.featuredImage

  return {
    slug,
    title: data.title || "",
    excerpt: data.excerpt || "",
    content: contentHtml,
    category: data.category || "General",
    tags: Array.isArray(data.tags) ? data.tags : [],
    readingTime,
    publishedAt:
      typeof publishedAt === "string"
        ? publishedAt
        : new Date(publishedAt).toISOString(),
    featuredImage: img,
    coverImage: img,
    keywords: Array.isArray(keywords) ? keywords : [String(keywords)],
    author: data.author || DEFAULT_AUTHOR,
    updatedAt: data.updatedAt,
  }
}

/**
 * All posts from `content/blog` (MD/MDX). Safe for static export / CI:
 * - Missing or empty `content/blog` → []
 * - One bad file does not fail the whole build; it is skipped and logged.
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const slugs = getBlogPostSlugs()
    const settled = await Promise.allSettled(
      slugs.map((slug) => getBlogPostBySlug(slug)),
    )
    const posts: BlogPost[] = []
    for (let i = 0; i < settled.length; i++) {
      const slug = slugs[i]
      const r = settled[i]
      if (r.status === "fulfilled" && r.value) {
        posts.push(r.value)
      } else if (r.status === "rejected") {
        console.error(`[blog] Skipping "${slug}":`, r.reason)
      }
    }
    return posts.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
  } catch (e) {
    console.error("[blog] getAllBlogPosts failed:", e)
    return []
  }
}

export function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  return getAllBlogPosts().then((posts) =>
    posts.filter((p) => p.category.toLowerCase() === category.toLowerCase())
  )
}

export function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  return getAllBlogPosts().then((posts) =>
    posts.filter((p) =>
      p.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    )
  )
}
