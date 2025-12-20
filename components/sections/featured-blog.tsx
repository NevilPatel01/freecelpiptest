"use client"

import { motion } from "framer-motion"
import { useRef } from "react"
import { useInView } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock } from "lucide-react"
import { cardItem } from "@/lib/animations"

// Placeholder blog posts - will be replaced with actual data from markdown files
const featuredPosts = [
  {
    slug: "top-10-celpip-listening-tips",
    title: "Top 10 CELPIP Listening Tips for Success",
    excerpt: "Master the listening section with these proven strategies and techniques.",
    category: "Listening Tips",
    readingTime: 5,
  },
  {
    slug: "celpip-writing-task-1-guide",
    title: "Complete Guide to CELPIP Writing Task 1",
    excerpt: "Learn how to structure and write effective emails for the CELPIP writing test.",
    category: "Writing Tips",
    readingTime: 8,
  },
  {
    slug: "improve-celpip-speaking-score",
    title: "How to Improve Your CELPIP Speaking Score",
    excerpt: "Practical tips and practice strategies to boost your speaking performance.",
    category: "Speaking Tips",
    readingTime: 6,
  },
]

export function FeaturedBlog() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="section-padding bg-muted/30">
      <div className="container mx-auto container-padding">
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="heading-2 mb-2 text-gradient-primary">Latest Study Tips</h2>
            <p className="text-lg text-muted-foreground">
              Expert advice to help you excel on your CELPIP test.
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex whitespace-nowrap" asChild>
            <Link href="/blog" className="flex items-center">
              <span>View All</span>
              <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredPosts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={cardItem(index).initial}
              animate={isInView ? cardItem(index).animate : cardItem(index).initial}
              transition={cardItem(index).transition}
            >
              <Card className="card-hover h-full flex flex-col card-elevated">
                <CardHeader className="pb-3">
                  <div className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold gradient-primary text-white mb-2.5 shadow-sm">
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
                  <div className="flex items-center justify-between pt-3 border-t">
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

