import type { Metadata } from "next"
import { TestimonialsPage } from "@/components/sections/testimonials-page"

export const metadata: Metadata = {
  title: "CELPIP Success Stories | FreeCELPIPTest",
  description: "Read success stories from students who achieved their CELPIP goals using our free practice materials and study resources.",
  alternates: {
    canonical: "/testimonials",
  },
}

export default function TestimonialsPageRoute() {
  return <TestimonialsPage />
}

