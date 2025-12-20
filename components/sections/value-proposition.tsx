"use client"

import { motion } from "framer-motion"
import { useRef } from "react"
import { useInView } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Infinity, BookOpen, Users, TrendingUp } from "lucide-react"
import { sectionHeader, cardItem } from "@/lib/animations"

const valueProps = [
  {
    icon: Infinity,
    title: "Comprehensive Resources",
    description: "Access all practice tests, study guides, and expert strategies to help you succeed on your CELPIP test.",
    stat: "Complete",
    color: "gradient-primary",
    iconColor: "text-primary",
  },
  {
    icon: BookOpen,
    title: "All 4 Test Sections",
    description: "Comprehensive practice for Listening, Reading, Writing, and Speaking sections.",
    stat: "4 Sections",
    color: "gradient-reading",
    iconColor: "text-chart-1",
  },
  {
    icon: TrendingUp,
    title: "Expert Study Guides",
    description: "Proven strategies and tips from CELPIP experts to help you achieve your target score.",
    stat: "Expert Tips",
    color: "gradient-writing",
    iconColor: "text-chart-3",
  },
  {
    icon: Users,
    title: "Trusted by Students",
    description: "Join thousands of students preparing for their CELPIP test with our free resources.",
    stat: "10K+ Users",
    color: "gradient-listening",
    iconColor: "text-chart-2",
  },
]

export function ValueProposition() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="container mx-auto container-padding">
        <motion.div
          className="text-center mb-10"
          initial={sectionHeader.initial}
          animate={isInView ? sectionHeader.animate : sectionHeader.initial}
          transition={sectionHeader.transition}
        >
          <h2 className="heading-2 mb-2 text-gradient-primary">Why Choose FreeCELPIPTest?</h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Everything you need to succeed on your CELPIP test, completely free.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {valueProps.map((prop, index) => {
            const Icon = prop.icon
            return (
              <motion.div
                key={prop.title}
                initial={cardItem(index).initial}
                animate={isInView ? cardItem(index).animate : cardItem(index).initial}
                transition={cardItem(index).transition}
              >
                <Card className="card-hover h-full text-center card-elevated">
                  <CardHeader className="pb-3">
                    <div className={`mx-auto mb-3 h-12 w-12 rounded-lg ${prop.color} flex items-center justify-center shadow-sm`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-gradient-primary mb-1.5">{prop.stat}</CardTitle>
                    <CardDescription className="text-sm font-medium">
                      {prop.title}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground leading-relaxed">{prop.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

