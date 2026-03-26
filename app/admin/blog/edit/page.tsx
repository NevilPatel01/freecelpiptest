"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Loader2 } from "lucide-react"
import { BlogPostForm, type BlogPostFormData } from "@/components/admin/blog-post-form"
import { cmsGetPostById } from "@/lib/appwrite/cms"

function EditBlogPostPageInner() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [initial, setInitial] = useState<Partial<BlogPostFormData> | undefined>(undefined)

  useEffect(() => {
    if (!id) {
      setError("Missing post id")
      setLoading(false)
      return
    }
    cmsGetPostById(id)
      .then((post) => {
        setInitial({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          tags: post.tags,
          featuredImage: post.featuredImage ?? "",
          published: post.published,
          author: post.author || "FreeCELPIPTest",
        })
        setLoading(false)
      })
      .catch(() => {
        setError("Could not load post")
        setLoading(false)
      })
  }, [id])

  if (!id || error) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/blog" className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back to posts
          </Link>
        </Button>
        <p className="text-sm text-destructive">{error || "Invalid link"}</p>
      </div>
    )
  }

  if (loading || !initial) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin/blog" className="flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" />
          Back to posts
        </Link>
      </Button>
      <BlogPostForm mode="edit" postId={id} initialData={initial} />
    </div>
  )
}

export default function EditBlogPostPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <EditBlogPostPageInner />
    </Suspense>
  )
}
