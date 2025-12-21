"use client"

import { motion } from "framer-motion"
import { useRef } from "react"
import { useInView } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Headphones, BookOpen, PenTool, Mic, ArrowRight, TrendingUp } from "lucide-react"
import { sectionHeader, cardItem, slideUp } from "@/lib/animations"

const sections = [
  {
    name: "Listening",
    href: "/practice/listening",
    icon: Headphones,
    description: "Practice with audio recordings and improve your listening comprehension skills.",
    gradient: "gradient-listening",
  },
  {
    name: "Reading",
    href: "/practice/reading",
    icon: BookOpen,
    description: "Enhance your reading skills with passages and comprehension questions.",
    gradient: "gradient-reading",
  },
  {
    name: "Writing",
    href: "/practice/writing",
    icon: PenTool,
    description: "Master email and essay writing with guided practice exercises.",
    gradient: "gradient-writing",
  },
  {
    name: "Speaking",
    href: "/practice/speaking",
    icon: Mic,
    description: "Improve your speaking fluency and pronunciation with practice tasks.",
    gradient: "gradient-speaking",
  },
]

export function PracticeTestsLanding() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div className="container mx-auto container-padding py-10 md:py-14">
      <motion.div
        className="text-center mb-10"
        initial={sectionHeader.initial}
        animate={sectionHeader.animate}
        transition={sectionHeader.transition}
      >
        <h1 className="heading-2 mb-3 text-gradient-primary">CELPIP Practice Tests</h1>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Practice all four sections of the CELPIP test with sample questions and exercises to help you prepare.
        </p>
      </motion.div>

      <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {sections.map((section, index) => {
          const Icon = section.icon
          return (
            <motion.div
              key={section.name}
              initial={cardItem(index).initial}
              animate={isInView ? cardItem(index).animate : cardItem(index).initial}
              transition={cardItem(index).transition}
            >
              <Card className="card-hover h-full card-elevated">
                <CardHeader className="pb-3">
                  <div className={`inline-flex h-12 w-12 rounded-xl ${section.gradient} items-center justify-center mb-3 shadow-sm`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold mb-1.5 text-gradient-primary">{section.name}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {section.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-muted-foreground font-medium">Progress</span>
                      <span className="font-semibold text-foreground">0%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${section.gradient} rounded-full transition-all duration-500 progress-bar-width-0`} />
                    </div>
                  </div>
                  <Button className="w-full whitespace-nowrap" asChild>
                    <Link href={section.href} className="flex items-center justify-center">
                      <span>Start Practice</span>
                      <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        initial={slideUp.initial}
        animate={isInView ? slideUp.animate : slideUp.initial}
        transition={{ ...slideUp.transition, delay: 0.4 }}
        className="card-modern rounded-xl p-5 mb-6 border-primary/20"
      >
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-sm">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 text-gradient-primary">Full version launching soon</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              We're working on the complete practice test experience. Sign up to get notified when full practice tests are available!
            </p>
            <Button variant="outline" size="sm">Sign up for updates</Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

