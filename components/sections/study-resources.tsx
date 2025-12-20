"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRef } from "react"
import { useInView } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, CheckCircle2, ArrowRight, FileText, Target, Lightbulb, Clock, Award, Hash } from "lucide-react"
import { sectionHeader, slideUp } from "@/lib/animations"

const sidebarItems = [
  { id: "get-started", title: "Get Started", icon: BookOpen },
  { id: "prerequisites", title: "Prerequisites", icon: Target },
  { id: "understanding-celpip", title: "Understanding CELPIP", icon: FileText },
  { id: "test-format", title: "Test Format", icon: FileText },
  { id: "study-guides", title: "Study Guides", icon: BookOpen },
  { id: "quick-tips", title: "Quick Tips", icon: Lightbulb },
  { id: "study-plan", title: "Study Plan", icon: Clock },
]

const getStartedSteps = [
  {
    title: "Understanding CELPIP",
    description: "Learn what the CELPIP test is, its format, and how it's scored.",
    icon: BookOpen,
    href: "#understanding-celpip",
  },
  {
    title: "Test Format Overview",
    description: "Get familiar with all four sections: Listening, Reading, Writing, and Speaking.",
    icon: FileText,
    href: "#test-format",
  },
  {
    title: "Prerequisites",
    description: "What you need to know before starting your CELPIP preparation journey.",
    icon: Target,
    href: "#prerequisites",
  },
  {
    title: "Study Plan",
    description: "Create an effective study schedule based on your test date and current level.",
    icon: Clock,
    href: "#study-plan",
  },
]

const prerequisites = [
  "Basic understanding of English grammar and vocabulary",
  "Ability to read and write in English at an intermediate level",
  "Access to a computer with internet connection for practice tests",
  "Dedication to practice regularly (recommended: 2-3 hours per week minimum)",
  "Understanding of Canadian English accents (for Listening section)",
]

const studyGuides = [
  {
    name: "Complete CELPIP Test Guide",
    icon: FileText,
    description: "Comprehensive guide covering all test sections, scoring, and test day tips",
  },
  {
    name: "Writing Task Templates",
    icon: BookOpen,
    description: "Email and essay templates with examples and scoring criteria",
  },
  {
    name: "Speaking Task Strategies",
    icon: Lightbulb,
    description: "Tips and frameworks for all 8 speaking tasks with practice prompts",
  },
  {
    name: "Time Management Guide",
    icon: Clock,
    description: "Strategies to manage time effectively during each section of the test",
  },
]

const quickTips = [
  "Practice regularly with sample questions and exercises",
  "Focus on your weakest section but don't neglect others",
  "Time yourself during practice to build speed and stamina",
  "Review your mistakes and learn from them systematically",
  "Use authentic Canadian English resources for listening practice",
  "Take full-length mock tests before your actual test date",
]

export function StudyResources() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeSection, setActiveSection] = useState("get-started")

  useEffect(() => {
    const handleScroll = () => {
      const sections = sidebarItems.map(item => item.id)
      const scrollPosition = window.scrollY + 100

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i])
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i])
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Navigation */}
      <aside className="hidden lg:block w-64 border-r border-border/50 bg-background/50 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <nav className="p-4 space-y-1">
          <div className="mb-4">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">Documentation</h2>
          </div>
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span>{item.title}</span>
              </a>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl container-padding py-10 md:py-14 scroll-smooth">
          {/* Header */}
          <motion.div
            className="mb-10"
            initial={sectionHeader.initial}
            animate={sectionHeader.animate}
            transition={sectionHeader.transition}
          >
            <h1 className="heading-2 mb-3 text-gradient-primary">CELPIP Study Resources</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Everything you need to prepare for your CELPIP test. Start here and follow the guide.
            </p>
          </motion.div>

          {/* Get Started Section */}
          <section id="get-started" className="mb-12 scroll-mt-20">
            <motion.div
              ref={ref}
              initial={slideUp.initial}
              animate={isInView ? slideUp.animate : slideUp.initial}
              transition={slideUp.transition}
              className="mb-6"
            >
              <h2 className="heading-3 mb-2 text-foreground flex items-center gap-2">
                <Hash className="h-5 w-5 text-muted-foreground" />
                Get Started
              </h2>
              <p className="text-muted-foreground mb-6">Follow these steps to begin your CELPIP preparation journey.</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getStartedSteps.map((step, index) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={step.title}
                    initial={slideUp.initial}
                    animate={isInView ? slideUp.animate : slideUp.initial}
                    transition={{ ...slideUp.transition, delay: index * 0.1 }}
                  >
                    <Card className="card-hover h-full card-elevated">
                      <CardHeader className="pb-3">
                        <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center mb-3 shadow-md">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-base font-semibold mb-1.5">{step.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <CardDescription className="text-sm leading-relaxed mb-3">{step.description}</CardDescription>
                        <Button variant="ghost" size="sm" className="w-full whitespace-nowrap" asChild>
                          <Link href={step.href} className="flex items-center justify-center">
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
          </section>

          {/* Prerequisites Section */}
          <section id="prerequisites" className="mb-12 scroll-mt-20">
            <motion.div
              initial={slideUp.initial}
              animate={isInView ? slideUp.animate : slideUp.initial}
              transition={{ ...slideUp.transition, delay: 0.2 }}
            >
              <h2 className="heading-3 mb-2 text-foreground flex items-center gap-2">
                <Hash className="h-5 w-5 text-muted-foreground" />
                Prerequisites
              </h2>
              <p className="text-muted-foreground mb-4">Before you begin, make sure you meet these basic requirements.</p>
              <Card className="card-modern card-elevated">
                <CardContent className="p-4">
                  <ul className="space-y-2.5">
                    {prerequisites.map((prereq, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm leading-relaxed">{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </section>

          {/* Understanding CELPIP Section */}
          <section id="understanding-celpip" className="mb-12 scroll-mt-20">
            <motion.div
              initial={slideUp.initial}
              animate={isInView ? slideUp.animate : slideUp.initial}
              transition={{ ...slideUp.transition, delay: 0.3 }}
            >
              <h2 className="heading-3 mb-2 text-foreground flex items-center gap-2">
                <Hash className="h-5 w-5 text-muted-foreground" />
                Understanding CELPIP
              </h2>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-sm leading-relaxed mb-4">
                  The Canadian English Language Proficiency Index Program (CELPIP) is an English language test designed for Canadian immigration and citizenship purposes. It assesses your English language skills in four areas: Listening, Reading, Writing, and Speaking.
                </p>
                <p className="text-sm leading-relaxed mb-4">
                  CELPIP uses a scale from 1 to 12 for each section, which corresponds to the Canadian Language Benchmark (CLB) levels. Each section is scored independently, and immigration programs typically require minimum scores in each section rather than an overall average.
                </p>
                <div className="bg-muted/50 rounded-lg p-4 mt-4 border border-border/50">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Important Disclaimer</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    This website is NOT affiliated with or endorsed by CELPIP. We are an independent study resource providing free practice materials and study guides.
                  </p>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Test Format Section */}
          <section id="test-format" className="mb-12 scroll-mt-20">
            <motion.div
              initial={slideUp.initial}
              animate={isInView ? slideUp.animate : slideUp.initial}
              transition={{ ...slideUp.transition, delay: 0.4 }}
            >
              <h2 className="heading-3 mb-4 text-foreground flex items-center gap-2">
                <Hash className="h-5 w-5 text-muted-foreground" />
                Test Format
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "Listening", duration: "47-55 minutes", tasks: "6 parts" },
                  { name: "Reading", duration: "55-60 minutes", tasks: "4 parts" },
                  { name: "Writing", duration: "53-60 minutes", tasks: "2 tasks" },
                  { name: "Speaking", duration: "15-20 minutes", tasks: "8 tasks" },
                ].map((section, index) => (
                  <Card key={section.name} className="card-hover card-elevated">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold mb-2">{section.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-semibold">{section.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Award className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">Tasks:</span>
                        <span className="font-semibold">{section.tasks}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </section>

          {/* Study Guides Section */}
          <section id="study-guides" className="mb-12 scroll-mt-20">
            <motion.div
              initial={slideUp.initial}
              animate={isInView ? slideUp.animate : slideUp.initial}
              transition={{ ...slideUp.transition, delay: 0.5 }}
            >
              <h2 className="heading-3 mb-4 text-foreground flex items-center gap-2">
                <Hash className="h-5 w-5 text-muted-foreground" />
                Study Guides
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {studyGuides.map((guide, index) => {
                  const Icon = guide.icon
                  return (
                    <Card key={guide.name} className="card-hover card-elevated">
                      <CardHeader className="pb-3">
                        <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center mb-3 shadow-md">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-sm font-semibold mb-1.5">{guide.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <CardDescription className="text-xs leading-relaxed">{guide.description}</CardDescription>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </motion.div>
          </section>

          {/* Quick Tips Section */}
          <section id="quick-tips" className="mb-12 scroll-mt-20">
            <motion.div
              initial={slideUp.initial}
              animate={isInView ? slideUp.animate : slideUp.initial}
              transition={{ ...slideUp.transition, delay: 0.6 }}
            >
              <h2 className="heading-3 mb-4 text-foreground flex items-center gap-2">
                <Hash className="h-5 w-5 text-muted-foreground" />
                Quick Tips
              </h2>
              <Card className="card-modern card-elevated">
                <CardContent className="p-4">
                  <ul className="space-y-2.5">
                    {quickTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </section>

          {/* Study Plan Section */}
          <section id="study-plan" className="mb-12 scroll-mt-20">
            <motion.div
              initial={slideUp.initial}
              animate={isInView ? slideUp.animate : slideUp.initial}
              transition={{ ...slideUp.transition, delay: 0.7 }}
            >
              <h2 className="heading-3 mb-4 text-foreground flex items-center gap-2">
                <Hash className="h-5 w-5 text-muted-foreground" />
                Recommended Study Plan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { week: "Week 1-2", task: "Familiarize yourself with test format and take initial practice test" },
                  { week: "Week 3-4", task: "Focus on weakest section with targeted practice" },
                  { week: "Week 5-6", task: "Practice all sections and review study materials" },
                  { week: "Week 7-8", task: "Take full mock tests and refine strategies" },
                ].map((item, index) => (
                  <Card key={item.week} className="card-hover card-elevated">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold mb-1.5">{item.week}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-sm leading-relaxed">{item.task}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </section>
        </div>
      </main>

      {/* Right Sidebar - Table of Contents (Desktop only) */}
      <aside className="hidden xl:block w-64 border-l border-border/50 bg-background/50 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <nav className="p-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">On this page</h3>
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setActiveSection(item.id)}
                  className={`block text-sm py-1.5 px-2 rounded-md transition-colors ${
                    activeSection === item.id
                      ? "text-primary font-medium bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  )
}
