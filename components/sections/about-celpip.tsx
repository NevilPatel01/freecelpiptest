"use client"

import { motion } from "framer-motion"
import { useRef } from "react"
import { useInView } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Headphones, BookOpen, PenTool, Mic, Clock, Award } from "lucide-react"
import { sectionHeader, slideUp } from "@/lib/animations"

const sections = [
  {
    name: "Listening",
    icon: Headphones,
    duration: "47-55 minutes",
    tasks: "6 parts",
    description: "Listen to audio recordings and answer comprehension questions covering various everyday situations.",
    gradient: "gradient-listening",
  },
  {
    name: "Reading",
    icon: BookOpen,
    duration: "55-60 minutes",
    tasks: "4 parts",
    description: "Read passages and answer questions to test comprehension of various text types.",
    gradient: "gradient-reading",
  },
  {
    name: "Writing",
    icon: PenTool,
    duration: "53-60 minutes",
    tasks: "2 tasks",
    description: "Task 1: Write an email (150-200 words). Task 2: Write an essay (200-300 words) responding to a question.",
    gradient: "gradient-writing",
  },
  {
    name: "Speaking",
    icon: Mic,
    duration: "15-20 minutes",
    tasks: "8 tasks",
    description: "Complete various speaking tasks using a computer, including describing scenes, giving advice, and expressing opinions.",
    gradient: "gradient-speaking",
  },
]

export function AboutCELPIP() {
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
        <h1 className="heading-2 mb-3 text-gradient-primary">About the CELPIP Test</h1>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Everything you need to know about the Canadian English Language Proficiency Index Program (CELPIP).
        </p>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={slideUp.initial}
        animate={slideUp.animate}
        transition={{ ...slideUp.transition, delay: 0.2 }}
        className="mb-12"
      >
        <Card className="card-modern border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-2">Important Disclaimer</h3>
                <p className="text-sm text-muted-foreground">
                  This website is NOT affiliated with or endorsed by CELPIP. We are an independent study resource
                  providing free practice materials and study guides to help students prepare for the CELPIP test.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* What is CELPIP */}
      <motion.div
        ref={ref}
        initial={sectionHeader.initial}
        animate={isInView ? sectionHeader.animate : sectionHeader.initial}
        transition={sectionHeader.transition}
        className="mb-12"
      >
        <Card className="card-modern card-elevated">
          <CardHeader>
            <CardTitle className="text-xl font-semibold mb-2">What is CELPIP?</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              The Canadian English Language Proficiency Index Program (CELPIP) is an English language test
              designed for Canadian immigration and citizenship purposes. It assesses your English language skills
              in real-world situations.
            </p>
            <p>
              CELPIP is accepted by Immigration, Refugees and Citizenship Canada (IRCC) for permanent residence
              and citizenship applications. The test is computer-delivered and can be taken at designated test
              centers across Canada and internationally.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Test Format */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-12"
      >
        <h2 className="heading-3 mb-6 text-gradient-primary">Test Format</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <Card key={section.name} className="card-hover card-elevated">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-5">
                    <div className={`h-12 w-12 rounded-xl ${section.gradient} flex items-center justify-center shadow-sm`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg font-semibold">{section.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-semibold text-foreground">{section.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Award className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Tasks:</span>
                    <span className="font-semibold text-foreground">{section.tasks}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{section.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </motion.div>

      {/* Scoring System */}
      <motion.div
        initial={slideUp.initial}
        animate={isInView ? slideUp.animate : slideUp.initial}
        transition={{ ...slideUp.transition, delay: 0.4 }}
        className="mb-12"
      >
        <Card className="card-modern card-elevated">
          <CardHeader>
            <CardTitle className="text-xl font-semibold mb-2">Scoring System</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              CELPIP uses a scale from 1 to 12 for each section, which corresponds to the Canadian Language
              Benchmark (CLB) levels. Each section is scored independently, and immigration programs typically
              require minimum scores in each section rather than an overall average.
            </p>
            <ul>
              <li><strong>CLB 4-5:</strong> Basic proficiency</li>
              <li><strong>CLB 6-7:</strong> Intermediate proficiency</li>
              <li><strong>CLB 8-9:</strong> Advanced proficiency</li>
              <li><strong>CLB 10-12:</strong> Expert proficiency</li>
            </ul>
            <p>
              Most immigration programs require minimum CLB levels in each section (typically CLB 7 or higher) depending on
              the program and your specific circumstances. It's important to meet the minimum requirement in all four sections,
              as programs typically don't accept an average score.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Test Day Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ ...slideUp.transition, delay: 0.6 }}
      >
        <Card className="card-modern card-elevated">
          <CardHeader>
            <CardTitle className="text-xl font-semibold mb-2">Test Day Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1 text-sm">•</span>
                <span className="text-sm leading-relaxed">Arrive at least 30 minutes before your scheduled test time</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1 text-sm">•</span>
                <span className="text-sm leading-relaxed">Bring valid identification (passport or government-issued ID)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1 text-sm">•</span>
                <span className="text-sm leading-relaxed">Get a good night's sleep and eat a healthy meal before the test</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1 text-sm">•</span>
                <span className="text-sm leading-relaxed">Familiarize yourself with the test center location beforehand</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1 text-sm">•</span>
                <span className="text-sm leading-relaxed">Stay calm and manage your time effectively during the test</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1 text-sm">•</span>
                <span className="text-sm leading-relaxed">Read all instructions carefully before starting each section</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

