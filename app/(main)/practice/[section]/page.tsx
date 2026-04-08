import { notFound } from "next/navigation"
import { PracticeSectionTasks } from "@/components/practice/practice-section-tasks"
import type { Metadata } from "next"

const validSections = ["listening", "reading", "writing", "speaking"]

export const dynamicParams = false

export function generateStaticParams() {
  return validSections.map((section) => ({ section }))
}

const sectionConfig: Record<
  string,
  {
    name: string
    description: string
  }
> = {
  listening: {
    name: "Listening",
    description: "Practice listening comprehension with audio recordings and questions.",
  },
  reading: {
    name: "Reading",
    description: "Improve your reading skills with passages and comprehension questions.",
  },
  writing: {
    name: "Writing",
    description: "Master email and essay writing with guided practice exercises.",
  },
  speaking: {
    name: "Speaking",
    description: "Improve your speaking fluency and pronunciation with practice tasks.",
  },
}

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const { section: sectionParam } = await params
  const section = sectionParam.toLowerCase()
  if (!validSections.includes(section)) {
    return { title: "Section Not Found" }
  }

  const sectionName = sectionConfig[section].name

  return {
    title: `CELPIP ${sectionName} Practice Tests | Free ${sectionName} Practice Questions`,
    description: `Practice CELPIP ${sectionName} section with realistic questions, exercises, and detailed feedback.`,
    keywords: [
      `CELPIP ${sectionName.toLowerCase()} practice`,
      `CELPIP ${sectionName.toLowerCase()} test`,
      `free ${sectionName.toLowerCase()} practice`,
      `CELPIP ${sectionName.toLowerCase()} questions`,
      `CELPIP ${sectionName.toLowerCase()} exercises`,
    ],
    openGraph: {
      title: `CELPIP ${sectionName} Practice | FreeCELPIPTest`,
      description: `Practice CELPIP ${sectionName} section with realistic questions and detailed feedback.`,
      type: "website",
    },
    alternates: {
      canonical: `/practice/${section}`,
    },
  }
}

export default async function PracticeSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section: sectionParam } = await params
  const section = sectionParam.toLowerCase()

  // Only `generateStaticParams` segments exist in export (`dynamicParams: false`); any other path 404s at runtime.
  if (!validSections.includes(section)) {
    notFound()
  }

  return <PracticeSectionTasks section={section} />
}

