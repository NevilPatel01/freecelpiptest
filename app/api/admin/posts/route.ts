import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"
import { computeReadingTime } from "@/lib/blog-db"

export async function GET() {
  try {
    const session = await auth()
    if (!session || !isAdmin(session.user?.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const posts = await prisma.blogPost.findMany({
      orderBy: [{ updatedAt: "desc" }],
    })
    return NextResponse.json({ posts })
  } catch (err) {
    console.error("Error fetching posts:", err)
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session || !isAdmin(session.user?.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      tags,
      featuredImage,
      published,
      author,
    } = body

    if (!title || !slug || typeof content !== "string") {
      return NextResponse.json(
        { error: "title, slug, and content are required" },
        { status: 400 }
      )
    }

    const existing = await prisma.blogPost.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 400 }
      )
    }

    const tagArray = Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) : []
    const isPublished = Boolean(published)
    const readingTime = computeReadingTime(content)

    const post = await prisma.blogPost.create({
      data: {
        title: String(title).trim(),
        slug: String(slug).trim().toLowerCase().replace(/\s+/g, "-"),
        excerpt: (excerpt ?? "").trim() || title,
        content: content.trim(),
        category: (category ?? "General").trim(),
        tags: tagArray,
        featuredImage: featuredImage?.trim() || null,
        readingTime,
        author: (author ?? session.user?.name ?? session.user?.email ?? "FreeCELPIPTest").trim() || null,
        authorId: session.user?.id ?? null,
        published: isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    })

    return NextResponse.json({ post })
  } catch (err) {
    console.error("Error creating post:", err)
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    )
  }
}
