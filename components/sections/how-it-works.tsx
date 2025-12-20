"use client"

import { motion } from "framer-motion"
import { useRef } from "react"
import { useInView } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, BookOpen, Target, Award } from "lucide-react"
import { sectionHeader, cardItem } from "@/lib/animations"

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Sign Up Free",
    description: "Create your free account in seconds with Google. No credit card required.",
  },
  {
    number: "02",
    icon: BookOpen,
    title: "Start Practicing",
    description: "Access practice tests for all 4 sections: Listening, Reading, Writing, and Speaking.",
  },
  {
    number: "03",
    icon: Target,
    title: "Track Progress",
    description: "Monitor your improvement with detailed progress tracking and performance analytics.",
  },
  {
    number: "04",
    icon: Award,
    title: "Achieve Your Goal",
    description: "Use expert tips and strategies to reach your target CELPIP score.",
  },
]

export function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="section-padding bg-muted/30">
      <div className="container mx-auto container-padding">
        <motion.div
          className="text-center mb-10"
          initial={sectionHeader.initial}
          animate={isInView ? sectionHeader.animate : sectionHeader.initial}
          transition={sectionHeader.transition}
        >
          <h2 className="heading-2 mb-2 text-gradient-primary">How It Works</h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Get started in minutes and begin your CELPIP preparation journey today.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                initial={cardItem(index).initial}
                animate={isInView ? cardItem(index).animate : cardItem(index).initial}
                transition={cardItem(index).transition}
                className="relative"
              >
                <Card className="card-hover h-full relative card-elevated">
                  <div className="absolute -top-2.5 -left-2.5 h-8 w-8 rounded-lg gradient-primary text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {step.number}
                  </div>
                  <CardHeader className="pt-4 pb-3">
                    <div className="mx-auto mb-3 h-11 w-11 rounded-lg gradient-primary flex items-center justify-center shadow-sm">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-base font-semibold text-gradient-primary mb-1.5">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm leading-relaxed">
                      {step.description}
                    </CardDescription>
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

