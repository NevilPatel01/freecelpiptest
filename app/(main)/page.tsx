"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle2, BookOpen, Users, TrendingUp, Clock, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HeroSection } from "@/components/sections/hero-section"
import { ValueProposition } from "@/components/sections/value-proposition"
import { Statistics } from "@/components/sections/statistics"
import { HowItWorks } from "@/components/sections/how-it-works"
import { Testimonials } from "@/components/sections/testimonials"
import { FeaturedBlog } from "@/components/sections/featured-blog"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <Statistics />
      <ValueProposition />
      <HowItWorks />
      <FeaturedBlog />
      <Testimonials />
    </div>
  )
}

