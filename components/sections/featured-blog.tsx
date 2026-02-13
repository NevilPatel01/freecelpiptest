import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock } from "lucide-react"
import type { BlogPost } from "@/lib/blog"

interface FeaturedBlogProps {
  posts: Pick<BlogPost, "slug" | "title" | "excerpt" | "category" | "readingTime">[]
}

export function FeaturedBlog({ posts }: FeaturedBlogProps) {
  if (!posts.length) return null
  return (
    <section className="section-padding bg-muted/30">
      <div className="container mx-auto container-padding">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="heading-2 mb-2 text-gradient-primary">Latest Study Tips</h2>
            <p className="text-base text-muted-foreground">
              Expert advice to help you excel on your CELPIP test.
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex whitespace-nowrap" asChild>
            <Link href="/blog" className="flex items-center">
              <span>View All</span>
              <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {posts.slice(0, 3).map((post) => (
            <Card key={post.slug} className="card-hover h-full flex flex-col card-elevated">
              <CardHeader className="pb-3">
                <div className="inline-block px-2 py-0.5 rounded-md text-xs font-semibold gradient-primary text-white mb-2.5 shadow-sm">
                  {post.category}
                </div>
                <CardTitle className="text-base font-semibold mb-1.5 leading-tight">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-0">
                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{post.readingTime} min</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                    <Link href={`/blog/${post.slug}`} className="flex items-center">
                      Read
                      <ArrowRight className="ml-1.5 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

