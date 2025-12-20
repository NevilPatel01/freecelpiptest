"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Play, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { heroAnimations } from "@/lib/animations"

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Warm gradient background */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.05),transparent_50%)]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-16 md:py-20">
        <motion.div
          className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8"
          {...heroAnimations.container}
        >
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
            {...heroAnimations.title}
          >
            Master CELPIP with{" "}
            <span className="text-gradient-primary">
              Free Practice Tests
            </span>{" "}
            & Expert Tips
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            {...heroAnimations.subtitle}
          >
            Prepare for your CELPIP test with comprehensive practice materials, study guides, and
            expert strategies. 100% free, forever.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            {...heroAnimations.buttons}
          >
            <Button size="lg" className="text-lg px-8 py-6 shadow-lg whitespace-nowrap" asChild>
              <Link href="/practice" className="flex items-center">
                <span>Start Free Practice</span>
                <ArrowRight className="ml-2 h-5 w-5 flex-shrink-0" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 whitespace-nowrap" asChild>
              <Link href="/blog" className="flex items-center">
                <span>Read Study Tips</span>
                <Play className="ml-2 h-5 w-5 flex-shrink-0" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            className="pt-8 flex flex-wrap justify-center gap-4 text-sm"
            {...heroAnimations.badges}
          >
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border-2 border-primary/20 shadow-sm">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="font-medium text-foreground">100% Free Forever</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border-2 border-chart-2/20 shadow-sm">
              <CheckCircle2 className="h-4 w-4 text-chart-2 flex-shrink-0" />
              <span className="font-medium text-foreground">All 4 Test Sections</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border-2 border-chart-3/20 shadow-sm">
              <CheckCircle2 className="h-4 w-4 text-chart-3 flex-shrink-0" />
              <span className="font-medium text-foreground">Expert Study Guides</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

