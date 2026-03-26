/**
 * Import MDX/MD posts from content/blog into Appwrite (blog collection).
 * Requires: NEXT_PUBLIC_APPWRITE_* and APPWRITE_API_KEY (same as static build).
 *
 * Run: npm run seed:blog
 */

import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { Client, Databases, ID, Query } from "node-appwrite"
import { DEFAULT_AUTHOR } from "../lib/constants"

const CONTENT_DIR = path.join(process.cwd(), "content/blog")

function computeReadingTime(content: string): number {
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / 200))
}

function requireEnv(): {
  endpoint: string
  projectId: string
  databaseId: string
  blogPosts: string
  apiKey: string
} {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? ""
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? ""
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? ""
  const blogPosts = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BLOG_POSTS ?? ""
  const apiKey = process.env.APPWRITE_API_KEY ?? ""
  if (!endpoint || !projectId || !databaseId || !blogPosts || !apiKey) {
    console.error(
      "Missing env: NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID, NEXT_PUBLIC_APPWRITE_DATABASE_ID, NEXT_PUBLIC_APPWRITE_COLLECTION_BLOG_POSTS, APPWRITE_API_KEY"
    )
    process.exit(1)
  }
  return { endpoint, projectId, databaseId, blogPosts, apiKey }
}

function getSlugFromFilename(filename: string): string {
  return filename.replace(/\.(mdx|md)$/i, "").trim()
}

async function seed() {
  const { endpoint, projectId, databaseId, blogPosts, apiKey } = requireEnv()

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey)
  const db = new Databases(client)

  if (!fs.existsSync(CONTENT_DIR)) {
    console.log("No content/blog directory found. Exiting.")
    process.exit(0)
  }

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => /\.(mdx|md)$/i.test(f) && !f.toLowerCase().includes("readme"))
  if (files.length === 0) {
    console.log("No .mdx or .md files in content/blog. Exiting.")
    process.exit(0)
  }

  console.log(`Found ${files.length} post(s) in content/blog. Importing...`)

  for (const file of files) {
    const slug = getSlugFromFilename(file)
    const fullPath = path.join(CONTENT_DIR, file)
    const raw = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(raw)

    const title = data.title || slug
    const excerpt = data.excerpt || title
    const category = data.category || "General"
    const tags = Array.isArray(data.tags) ? data.tags : []
    const featuredImage = String(data.coverImage || data.featuredImage || "").trim()
    const publishedAtStr = data.publishedAt || data.date
    const publishedAtIso = publishedAtStr
      ? new Date(publishedAtStr).toISOString()
      : new Date().toISOString()
    const readingTime = computeReadingTime(content)
    const author = String(data.author || DEFAULT_AUTHOR).trim()

    const existing = await db.listDocuments(databaseId, blogPosts, [
      Query.equal("slug", slug),
      Query.limit(1),
    ])
    if (existing.documents.length > 0) {
      console.log(`  Skip (exists): ${slug}`)
      continue
    }

    await db.createDocument(databaseId, blogPosts, ID.unique(), {
      title,
      slug,
      content: content.trim(),
      excerpt,
      category,
      tags,
      featuredImage,
      readingTime,
      author,
      published: true,
      publishedAt: publishedAtIso,
      views: 0,
    })
    console.log(`  Imported: ${slug}`)
  }

  console.log("Done.")
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
