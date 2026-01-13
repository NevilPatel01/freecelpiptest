import { MockTestTasks } from "@/components/practice/mock-test-tasks"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "CELPIP Mock Tests | Practice Individual Tasks",
  description: "Practice CELPIP tasks individually. Select from Listening, Reading, Writing, and Speaking tasks to improve your skills.",
  keywords: [
    "CELPIP mock tests",
    "CELPIP practice tasks",
    "CELPIP listening practice",
    "CELPIP reading practice",
    "CELPIP writing practice",
    "CELPIP speaking practice",
    "CELPIP task practice",
  ],
  openGraph: {
    title: "CELPIP Mock Tests | Practice Individual Tasks",
    description: "Practice CELPIP tasks individually. Select from Listening, Reading, Writing, and Speaking tasks.",
    type: "website",
  },
  alternates: {
    canonical: "/mock-tests",
  },
}

export default function MockTestsPage() {
  return <MockTestTasks />
}

