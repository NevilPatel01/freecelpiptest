import type { Metadata } from "next"
import { StudyResources } from "@/components/sections/study-resources"

export const metadata: Metadata = {
  title: "CELPIP Study Resources | FreeCELPIPTest",
  description: "Download free CELPIP study guides, vocabulary lists, tips, and strategies to help you prepare for your test.",
  alternates: {
    canonical: "/resources",
  },
}

export default function ResourcesPage() {
  return <StudyResources />
}

