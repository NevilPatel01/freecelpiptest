import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"
import { computeReadingTime } from "@/lib/blog-db"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || !isAdmin(session.user?.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const post = await prisma.blogPost.findUnique({ where: { id } })
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }
    return NextResponse.json({ post })
  } catch (err) {
    console.error("Error fetching post:", err)
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || !isAdmin(session.user?.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
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

    const existing = await prisma.blogPost.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const newSlug = slug !== undefined ? String(slug).trim().toLowerCase().replace(/\s+/g, "-") : existing.slug
    if (newSlug !== existing.slug) {
      const slugTaken = await prisma.blogPost.findUnique({ where: { slug: newSlug } })
      if (slugTaken) {
        return NextResponse.json(
          { error: "Another post already uses this slug" },
          { status: 400 }
        )
      }
    }

    const tagArray = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
        ? tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : existing.tags
    const contentStr = typeof content === "string" ? content : existing.content
    const readingTime = computeReadingTime(contentStr)
    const isPublished = published !== undefined ? Boolean(published) : existing.published
    const publishedAt =
      isPublished && !existing.publishedAt
        ? new Date()
        : isPublished
          ? existing.publishedAt
          : null

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: String(title).trim() }),
        ...(slug !== undefined && { slug: newSlug }),
        ...(excerpt !== undefined && { excerpt: String(excerpt).trim() }),
        ...(content !== undefined && { content: String(content).trim() }),
        ...(category !== undefined && { category: String(category).trim() }),
        ...(tags !== undefined && { tags: tagArray }),
        ...(featuredImage !== undefined && { featuredImage: featuredImage?.trim() || null }),
        ...(author !== undefined && { author: author?.trim() || null }),
        readingTime,
        published: isPublished,
        publishedAt,
      },
    })

    return NextResponse.json({ post })
  } catch (err) {
    console.error("Error updating post:", err)
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || !isAdmin(session.user?.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    await prisma.blogPost.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Error deleting post:", err)
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    )
  }
}
