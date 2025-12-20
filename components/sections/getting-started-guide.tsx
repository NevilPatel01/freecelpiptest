"use client"

import { motion } from "framer-motion"
import { useRef } from "react"
import { useInView } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight, BookOpen, Target, TrendingUp, Award } from "lucide-react"
import { sectionHeader, cardItem, slideUp } from "@/lib/animations"

const steps = [
  {
    number: 1,
    title: "Understand the Test Format",
    description: "Learn about the four sections: Listening, Reading, Writing, and Speaking. Each section has specific tasks and time limits.",
    icon: BookOpen,
    link: "/about-celpip",
  },
  {
    number: 2,
    title: "Assess Your Current Level",
    description: "Take a practice test to identify your strengths and areas for improvement.",
    icon: Target,
    link: "/practice",
  },
  {
    number: 3,
    title: "Create a Study Plan",
    description: "Set realistic goals and create a study schedule based on your test date and current level.",
    icon: TrendingUp,
    link: "/resources",
  },
  {
    number: 4,
    title: "Practice Regularly",
    description: "Use our free practice tests and study resources to improve your skills consistently.",
    icon: Award,
    link: "/practice",
  },
]

const timeline = [
  { week: "Week 1-2", task: "Familiarize yourself with test format and take initial practice test" },
  { week: "Week 3-4", task: "Focus on weakest section with targeted practice" },
  { week: "Week 5-6", task: "Practice all sections and review study materials" },
  { week: "Week 7-8", task: "Take full mock tests and refine strategies" },
]

export function GettingStartedGuide() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div className="container mx-auto container-padding py-10 md:py-14">
      <motion.div
        className="text-center mb-12 md:mb-16"
        initial={sectionHeader.initial}
        animate={sectionHeader.animate}
        transition={sectionHeader.transition}
      >
        <h1 className="heading-2 mb-4 text-gradient-primary">Getting Started with CELPIP</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Your complete guide to CELPIP test preparation. Follow these steps to start your journey.
        </p>
      </motion.div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <motion.div
              key={step.number}
              ref={index === 0 ? ref : null}
              initial={cardItem(index).initial}
              animate={isInView ? cardItem(index).animate : cardItem(index).initial}
              transition={cardItem(index).transition}
            >
              <Card className="card-hover h-full card-elevated">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="h-12 w-12 rounded-xl gradient-primary text-white flex items-center justify-center font-bold text-base shadow-md">
                      {step.number}
                    </div>
                    <div className="h-10 w-10 rounded-xl gradient-primary/20 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-lg font-semibold mb-2">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm mb-5 leading-relaxed">
                    {step.description}
                  </CardDescription>
                  <Button variant="outline" size="sm" className="whitespace-nowrap" asChild>
                    <Link href={step.link} className="flex items-center">
                      <span>Learn More</span>
                      <ArrowRight className="ml-2 h-3.5 w-3.5 flex-shrink-0" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mb-12"
      >
        <Card className="card-modern card-elevated">
          <CardHeader>
            <CardTitle className="text-xl font-semibold mb-2">8-Week Study Roadmap</CardTitle>
            <CardDescription className="text-sm">
              Recommended study path for optimal preparation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {timeline.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-11 w-11 rounded-xl gradient-primary flex items-center justify-center font-semibold text-xs text-white shadow-md">
                      {item.week}
                    </div>
                    {index < timeline.length - 1 && (
                      <div className="w-0.5 h-full bg-muted mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <p className="font-medium text-sm leading-relaxed">{item.task}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="card-hover card-elevated">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Practice Tests</CardTitle>
            <CardDescription className="text-xs">Start practicing all test sections</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button asChild className="w-full whitespace-nowrap" size="sm">
              <Link href="/practice" className="flex items-center justify-center">
                <span>Start Practice</span>
                <ArrowRight className="ml-2 h-3.5 w-3.5 flex-shrink-0" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="card-hover card-elevated">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Study Resources</CardTitle>
            <CardDescription className="text-xs">Download guides and tips</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button variant="outline" asChild className="w-full" size="sm">
              <Link href="/resources">
                View Resources
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="card-hover card-elevated">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Study Tips</CardTitle>
            <CardDescription className="text-xs">Read expert strategies</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button variant="outline" asChild className="w-full" size="sm">
              <Link href="/blog">
                Read Blog
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

