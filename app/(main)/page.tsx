import type { Metadata } from "next"
import { HeroSection } from "@/components/sections/hero-section"
import { ValueProposition } from "@/components/sections/value-proposition"
import { AboutContent } from "@/components/sections/about-content"
import { OrganizationSchema } from "@/components/seo/organization-schema"
import { FeaturedBlog } from "@/components/sections/featured-blog"
import { getAllBlogPosts } from "@/lib/blog"

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
}

export const dynamic = "force-static"

export default async function HomePage() {
  // force-static: featured posts are whatever `content/blog` resolves at build; redeploy to refresh.
  let posts: Awaited<ReturnType<typeof getAllBlogPosts>> = []
  try {
    posts = await getAllBlogPosts()
  } catch (error) {
    console.error("[blog] HomePage: failed to load posts:", error)
  }
  return (
    <>
      <OrganizationSchema />
      <div className="flex flex-col">
        <HeroSection />
        <ValueProposition />
        <AboutContent />
        <FeaturedBlog posts={posts} />
      </div>
    </>
  )
}

