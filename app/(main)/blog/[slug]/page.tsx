import { notFound } from "next/navigation"
import { getBlogPostBySlug, getAllBlogPosts, getBlogPostSlugs } from "@/lib/blog"
import { BlogPostView } from "@/components/blog/blog-post-view"
import { absoluteSitePath, DEFAULT_AUTHOR, APP_NAME } from "@/lib/constants"

export const dynamic = "force-static"
export const dynamicParams = false

export async function generateStaticParams() {
  try {
    // Sync API (fs); do not await — see `getBlogPostSlugs` in `lib/blog.ts`
    const slugs = getBlogPostSlugs()
    return slugs.map((slug) => ({ slug }))
  } catch (error) {
    console.error("[blog] generateStaticParams: failed to read blog slugs:", error)
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  const keywords = post.keywords || post.tags || []
  const origin = absoluteSitePath("/").replace(/\/$/, "")
  const coverImage =
    post.coverImage || post.featuredImage || `${origin}/images/blog/default-cover.jpg`

  return {
    title: `${post.title} | ${APP_NAME} Blog`,
    description: post.excerpt,
    keywords: keywords.join(', '),
    authors: [{ name: post.author || DEFAULT_AUTHOR }], // post.author from DB or constant
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author || DEFAULT_AUTHOR],
      tags: keywords,
      images: [
        {
          url: coverImage.startsWith("http")
            ? coverImage
            : `${origin}${coverImage.startsWith("/") ? coverImage : `/${coverImage}`}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      siteName: APP_NAME,
      url: absoluteSitePath(`/blog/${post.slug}`),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [
        coverImage.startsWith("http")
          ? coverImage
          : `${origin}${coverImage.startsWith("/") ? coverImage : `/${coverImage}`}`,
      ],
    },
    alternates: {
      canonical: absoluteSitePath(`/blog/${post.slug}`),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const allPosts = await getAllBlogPosts()
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug && (p.category === post.category || p.tags.some((tag) => post.tags.includes(tag))))
    .slice(0, 3)

  return <BlogPostView post={post} relatedPosts={relatedPosts} />
}

