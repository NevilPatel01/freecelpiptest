import { remark } from 'remark'
import html from 'remark-html'
import remarkGfm from 'remark-gfm'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/blog')

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

export function getBlogPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }
  return fs.readdirSync(postsDirectory)
    .filter((file) => 
      (file.endsWith('.md') || file.endsWith('.mdx')) && 
      !file.toLowerCase().includes('readme')
    )
    .map((file) => file.replace(/\.(md|mdx)$/, ''))
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  // Try .mdx first, then .md
  let fullPath = path.join(postsDirectory, `${slug}.mdx`)
  if (!fs.existsSync(fullPath)) {
    fullPath = path.join(postsDirectory, `${slug}.md`)
  }
  
  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const processedContent = await remark()
    .use(remarkGfm)
    .use(html)
    .process(content)
  
  const contentHtml = processedContent.toString()

  // Calculate reading time (average 200 words per minute)
  const wordCount = content.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 200)

  // Extract keywords from tags if keywords not explicitly provided
  const keywords = data.keywords || data.tags || []
  
  // Handle both 'date' and 'publishedAt' for compatibility
  const publishedAt = data.publishedAt || data.date || new Date().toISOString()

  return {
    slug,
    title: data.title || '',
    excerpt: data.excerpt || '',
    content: contentHtml,
    category: data.category || 'General',
    tags: data.tags || [],
    readingTime,
    publishedAt,
    featuredImage: data.featuredImage || data.coverImage,
    coverImage: data.coverImage || data.featuredImage,
    keywords: Array.isArray(keywords) ? keywords : [keywords],
    author: data.author || 'FreeCELPIPTest',
    updatedAt: data.updatedAt,
  }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const slugs = getBlogPostSlugs()
  const posts = await Promise.all(
    slugs.map((slug) => getBlogPostBySlug(slug))
  )
  
  return posts
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })
}

export function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  return getAllBlogPosts().then(posts => 
    posts.filter(post => post.category.toLowerCase() === category.toLowerCase())
  )
}

export function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  return getAllBlogPosts().then(posts => 
    posts.filter(post => post.tags.some(t => t.toLowerCase() === tag.toLowerCase()))
  )
}

