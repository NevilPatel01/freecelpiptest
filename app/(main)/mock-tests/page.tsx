import { ComingSoon } from "@/components/ui/coming-soon"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "CELPIP Mock Tests | Full-Length Practice Tests - Coming Soon",
  description: "Full-length CELPIP mock tests to simulate the real exam experience. Practice all 4 sections in one complete test with realistic timing and scoring. Coming soon!",
  keywords: [
    "CELPIP mock tests",
    "CELPIP full-length practice",
    "CELPIP exam simulation",
    "CELPIP practice exam",
    "complete CELPIP test",
    "CELPIP test practice",
    "CELPIP sample test",
  ],
  openGraph: {
    title: "CELPIP Mock Tests | Full-Length Practice - Coming Soon",
    description: "Full-length CELPIP mock tests to simulate the real exam. Practice all sections with realistic timing and scoring.",
    type: "website",
  },
  alternates: {
    canonical: "/mock-tests",
  },
}

export default function MockTestsPage() {
  return (
    <ComingSoon
      title="CELPIP Mock Tests - Coming Soon"
      description="We're developing full-length CELPIP mock tests that simulate the complete exam experience. These comprehensive tests will help you practice all four sections in one sitting, just like the real test."
      features={[
        "Full-length tests covering all 4 sections",
        "Realistic test timing and format",
        "Complete exam simulation experience",
        "Detailed score reports and feedback",
        "Performance analysis by section",
        "Practice under real test conditions",
      ]}
      showNewsletter={true}
      relatedLinks={[
        {
          name: "Practice Tests",
          href: "/practice",
          description: "Practice individual sections with sample questions",
        },
        {
          name: "Study Resources",
          href: "/blog",
          description: "Access study guides, tips, and strategies",
        },
        {
          name: "Test Format Guide",
          href: "/resources#understanding-celpip",
          description: "Learn about CELPIP test structure and format",
        },
      ]}
    />
  )
}

