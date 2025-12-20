import { ComingSoon } from "@/components/ui/coming-soon"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "CELPIP Practice Tests | Free CELPIP Practice Questions & Exercises",
  description: "Free CELPIP practice tests for Listening, Reading, Writing, and Speaking sections. Practice with sample questions, exercises, and study guides to prepare for your CELPIP test.",
  keywords: [
    "CELPIP practice tests",
    "CELPIP practice questions",
    "free CELPIP practice",
    "CELPIP listening practice",
    "CELPIP reading practice",
    "CELPIP writing practice",
    "CELPIP speaking practice",
    "CELPIP test preparation",
    "CELPIP study materials",
  ],
  openGraph: {
    title: "CELPIP Practice Tests | FreeCELPIPTest",
    description: "Free CELPIP practice tests for all 4 sections. Practice with sample questions and exercises to prepare for your test.",
    type: "website",
  },
  alternates: {
    canonical: "/practice",
  },
}

export default function PracticeTestsPage() {
  return (
    <ComingSoon
      title="CELPIP Practice Tests - Coming Soon"
      description="We're building comprehensive practice tests for all four CELPIP sections. Our practice tests will include realistic questions, detailed explanations, and progress tracking to help you prepare effectively."
      features={[
        "Realistic practice questions for all 4 sections",
        "Audio recordings for listening practice",
        "Detailed answer explanations and feedback",
        "Progress tracking and performance analytics",
        "Timed practice sessions matching real test format",
        "Study guides and tips for each section",
      ]}
      showNewsletter={true}
      relatedLinks={[
        {
          name: "Study Guides & Tips",
          href: "/blog",
          description: "Read expert tips and strategies for each CELPIP section",
        },
        {
          name: "About CELPIP Test",
          href: "/resources#understanding-celpip",
          description: "Learn about test format, scoring, and what to expect",
        },
        {
          name: "Score Calculator",
          href: "/celpip-score-calculator",
          description: "Calculate your CLB level and understand scoring",
        },
      ]}
    />
  )
}

