import { notFound } from "next/navigation"
import { getBlogPostBySlug, getAllBlogPosts } from "@/lib/blog"
import { BlogPostView } from "@/components/blog/blog-post-view"

export async function generateStaticParams() {
  const posts = await getAllBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
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
  const coverImage = post.coverImage || post.featuredImage || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://freecelpiptest.com'}/images/blog/default-cover.jpg`
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freecelpiptest.com'

  return {
    title: `${post.title} | FreeCELPIPTest Blog`,
    description: post.excerpt,
    keywords: keywords.join(', '),
    authors: [{ name: post.author || 'FreeCELPIPTest' }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author || 'FreeCELPIPTest'],
      tags: keywords,
      images: [
        {
          url: coverImage.startsWith('http') ? coverImage : `${siteUrl}${coverImage}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      siteName: 'FreeCELPIPTest',
      url: `${siteUrl}/blog/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [coverImage.startsWith('http') ? coverImage : `${siteUrl}${coverImage}`],
    },
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`,
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

