/**
 * One-time script: import existing MDX blog posts from content/blog into the database.
 * Run: npx tsx scripts/seed-blog-from-mdx.ts
 * (Or: npm run db:seed-blog)
 */

import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { prisma } from "../lib/prisma"
import { computeReadingTime } from "../lib/blog-db"
import { DEFAULT_AUTHOR } from "../lib/constants"

const CONTENT_DIR = path.join(process.cwd(), "content/blog")

function getSlugFromFilename(filename: string): string {
  return filename.replace(/\.(mdx|md)$/i, "").trim()
}

async function seed() {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.log("No content/blog directory found. Exiting.")
    process.exit(0)
  }

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => /\.(mdx|md)$/i.test(f) && !f.toLowerCase().includes("readme"))
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
    const featuredImage = data.coverImage || data.featuredImage || null
    const publishedAtStr = data.publishedAt || data.date
    const publishedAt = publishedAtStr ? new Date(publishedAtStr) : new Date()
    const readingTime = computeReadingTime(content)

    const existing = await prisma.blogPost.findUnique({ where: { slug } })
    if (existing) {
      console.log(`  Skip (exists): ${slug}`)
      continue
    }

    await prisma.blogPost.create({
      data: {
        title,
        slug,
        content: content.trim(),
        excerpt,
        featuredImage,
        category,
        tags,
        readingTime,
        author: DEFAULT_AUTHOR,
        published: true,
        publishedAt,
      },
    })
    console.log(`  Imported: ${slug}`)
  }

  console.log("Done.")
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
