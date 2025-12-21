import { Metadata } from "next"
import { CELPIPScoreCalculator } from "@/components/tools/celpip-score-calculator"

export const metadata: Metadata = {
  title: "CELPIP Score Calculator | FreeCELPIPTest",
  description: "Calculate your CELPIP score and see how it maps to Canadian Language Benchmark (CLB) levels. Get an estimate of your overall CELPIP score.",
  keywords: ["CELPIP score calculator", "CLB calculator", "CELPIP score", "CELPIP test score"],
  alternates: {
    canonical: "/celpip-score-calculator",
  },
}

export default function CELPIPScoreCalculatorPage() {
  return <CELPIPScoreCalculator />
}

