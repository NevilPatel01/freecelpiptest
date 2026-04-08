import { Suspense } from "react"
import { getAllBlogPosts } from "@/lib/blog"
import { BlogListing } from "@/components/blog/blog-listing"
import { BlogListingSkeleton } from "@/components/blog/blog-listing-skeleton"

export const metadata = {
  title: "CELPIP Study Tips & Blog | FreeCELPIPTest",
  description: "Expert CELPIP study tips, strategies, and guides for all test sections. Learn from proven techniques to improve your score.",
  alternates: {
    canonical: "/blog",
  },
}

export default async function BlogPage() {
  // `try` only guards the listing payload; the route HTML is still emitted at build (may be empty list).
  let posts: Awaited<ReturnType<typeof getAllBlogPosts>> = []
  try {
    posts = await getAllBlogPosts()
  } catch (error) {
    console.error("[blog] BlogPage: failed to load posts:", error)
  }

  return (
    <Suspense fallback={<BlogListingSkeleton />}>
      <BlogListing posts={posts} />
    </Suspense>
  )
}

