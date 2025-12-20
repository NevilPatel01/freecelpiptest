"use client"

import { motion } from "framer-motion"
import { useRef } from "react"
import { useInView } from "framer-motion"
import { Users, TrendingUp, BookOpen, Award } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { sectionHeader, cardItem } from "@/lib/animations"

const stats = [
  {
    number: "10K+",
    label: "Active Students",
    icon: Users,
    color: "gradient-primary",
  },
  {
    number: "95%",
    label: "Success Rate",
    icon: TrendingUp,
    color: "gradient-listening",
  },
  {
    number: "4",
    label: "Test Sections",
    icon: BookOpen,
    color: "gradient-reading",
  },
  {
    number: "100%",
    label: "Free Forever",
    icon: Award,
    color: "gradient-writing",
  },
]

export function Statistics() {
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
          <h2 className="heading-2 mb-3 text-gradient-primary">Trusted by Thousands</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join a growing community of students achieving their CELPIP goals
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={cardItem(index).initial}
                animate={isInView ? cardItem(index).animate : cardItem(index).initial}
                transition={cardItem(index).transition}
              >
                <Card className="stat-card">
                  <CardContent className="p-5">
                    <div className={`mx-auto mb-3 h-10 w-10 rounded-lg ${stat.color} flex items-center justify-center shadow-md`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="stat-card-number">{stat.number}</div>
                    <div className="stat-card-label">{stat.label}</div>
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

