import { notFound } from "next/navigation"
import { ComingSoon } from "@/components/ui/coming-soon"
import type { Metadata } from "next"

const validSections = ["listening", "reading", "writing", "speaking"]

const sectionConfig: Record<
  string,
  {
    name: string
    description: string
    features: string[]
    relatedLinks: Array<{ name: string; href: string; description: string }>
  }
> = {
  listening: {
    name: "Listening",
    description:
      "We're building comprehensive listening practice tests with audio recordings, comprehension questions, and detailed explanations to help you improve your listening skills.",
    features: [
      "Audio recordings matching real test format",
      "Multiple question types (multiple choice, fill in the blank)",
      "Practice with Canadian accents and contexts",
      "Detailed answer explanations",
      "Progress tracking and performance analytics",
    ],
    relatedLinks: [
      {
        name: "Study Tips & Strategies",
        href: "/blog",
        description: "Read expert tips for improving your listening skills",
      },
      {
        name: "Test Format Guide",
        href: "/resources#understanding-celpip",
        description: "Learn about the listening section format and timing",
      },
    ],
  },
  reading: {
    name: "Reading",
    description:
      "We're developing reading practice tests with realistic passages, comprehension questions, and detailed feedback to help you master the reading section.",
    features: [
      "Realistic reading passages",
      "Various question types (multiple choice, matching, fill in the blank)",
      "Practice with different text types and topics",
      "Detailed answer explanations",
      "Time management practice",
    ],
    relatedLinks: [
      {
        name: "Study Tips & Strategies",
        href: "/blog",
        description: "Learn strategies for improving reading comprehension",
      },
      {
        name: "Test Format Guide",
        href: "/resources#understanding-celpip",
        description: "Understand the reading section format and requirements",
      },
    ],
  },
  writing: {
    name: "Writing",
    description:
      "We're creating writing practice exercises with sample prompts, templates, and detailed feedback to help you excel in both email and essay writing tasks.",
    features: [
      "Practice with real test format prompts",
      "Email writing practice (Task 1)",
      "Essay writing practice (Task 2)",
      "Writing templates and examples",
      "Detailed feedback and improvement suggestions",
    ],
    relatedLinks: [
      {
        name: "Writing Tips & Guides",
        href: "/blog",
        description: "Access writing templates, tips, and examples",
      },
      {
        name: "Test Format Guide",
        href: "/resources#understanding-celpip",
        description: "Learn about writing tasks and requirements",
      },
    ],
  },
  speaking: {
    name: "Speaking",
    description:
      "We're building speaking practice exercises with recording capabilities, sample prompts, and feedback to help you improve your speaking fluency and pronunciation.",
    features: [
      "Practice with all 8 speaking tasks",
      "Recording and playback functionality",
      "Sample responses and model answers",
      "Pronunciation and fluency feedback",
      "Practice with realistic timing",
    ],
    relatedLinks: [
      {
        name: "Speaking Tips & Strategies",
        href: "/blog",
        description: "Learn techniques for improving speaking skills",
      },
      {
        name: "Test Format Guide",
        href: "/resources#understanding-celpip",
        description: "Understand speaking tasks and evaluation criteria",
      },
    ],
  },
}

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
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

  const sectionName = sectionNames[section]

  return {
    title: `CELPIP ${sectionName} Practice Tests | Free ${sectionName} Practice Questions`,
    description: `Practice CELPIP ${sectionName} section with realistic questions, exercises, and detailed feedback. Free ${sectionName.toLowerCase()} practice tests coming soon.`,
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

  if (!validSections.includes(section)) {
    notFound()
  }

  const config = sectionConfig[section]

  return (
    <ComingSoon
      title={`CELPIP ${config.name} Practice - Coming Soon`}
      description={config.description}
      features={config.features}
      showNewsletter={true}
      relatedLinks={config.relatedLinks}
    />
  )
}

