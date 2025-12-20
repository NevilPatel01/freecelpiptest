import Link from "next/link"
import { ArrowRight, Play, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-background to-accent/3" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.04),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.03),transparent_50%)]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center space-y-5 md:space-y-6 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Master CELPIP with{" "}
            <span className="text-gradient-primary">
              Free Practice Tests
            </span>{" "}
            & Expert Tips
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Prepare for your CELPIP test with comprehensive practice materials, study guides, and
            expert strategies designed to help you achieve your target score.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-base px-6 py-3 shadow-md whitespace-nowrap" asChild>
              <Link href="/practice" className="flex items-center">
                <span>Start Free Practice</span>
                <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-6 py-3 border whitespace-nowrap" asChild>
              <Link href="/blog" className="flex items-center">
                <span>Read Study Tips</span>
                <Play className="ml-2 h-4 w-4 flex-shrink-0" />
              </Link>
            </Button>
          </div>

          <div className="pt-6 flex flex-wrap justify-center gap-3 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-primary/15 shadow-sm">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
              <span className="font-medium text-foreground">Comprehensive Practice Materials</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-chart-2/15 shadow-sm">
              <CheckCircle2 className="h-3.5 w-3.5 text-chart-2 flex-shrink-0" />
              <span className="font-medium text-foreground">All 4 Test Sections</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-chart-3/15 shadow-sm">
              <CheckCircle2 className="h-3.5 w-3.5 text-chart-3 flex-shrink-0" />
              <span className="font-medium text-foreground">Expert Study Guides</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

