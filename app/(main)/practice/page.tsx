import { PracticeTestsLanding } from "@/components/practice/practice-tests-landing"
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
  return <PracticeTestsLanding />
}

