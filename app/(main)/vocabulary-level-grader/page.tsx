import { Metadata } from "next"
import { VocabularyLevelGrader } from "@/components/tools/vocabulary-level-grader"

export const metadata: Metadata = {
  title: "Vocabulary Level Grader | FreeCELPIPTest",
  description: "Test your English vocabulary level and see how it compares to CELPIP requirements. Get personalized recommendations for improvement.",
  keywords: ["vocabulary test", "vocabulary level", "CELPIP vocabulary", "English vocabulary test"],
}

export default function VocabularyLevelGraderPage() {
  return <VocabularyLevelGrader />
}

