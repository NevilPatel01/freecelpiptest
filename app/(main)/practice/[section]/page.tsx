import { notFound } from "next/navigation"
import { PracticeSection } from "@/components/practice/practice-section"

const validSections = ["listening", "reading", "writing", "speaking"]

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }) {
  const { section: sectionParam } = await params
  const section = sectionParam.toLowerCase()
  if (!validSections.includes(section)) {
    return { title: "Section Not Found" }
  }

  const sectionNames: Record<string, string> = {
    listening: "Listening",
    reading: "Reading",
    writing: "Writing",
    speaking: "Speaking",
  }

  return {
    title: `CELPIP ${sectionNames[section]} Practice | FreeCELPIPTest`,
    description: `Practice CELPIP ${sectionNames[section]} section with realistic questions and detailed feedback.`,
  }
}

export default async function PracticeSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section: sectionParam } = await params
  const section = sectionParam.toLowerCase()

  if (!validSections.includes(section)) {
    notFound()
  }

  return <PracticeSection section={section} />
}

