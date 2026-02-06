"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calculator, TrendingUp, Award, Info } from "lucide-react"
import { sectionHeader } from "@/lib/animations"

const clbLevels = [
  { level: 12, description: "Advanced proficiency - Native-like" },
  { level: 11, description: "Advanced proficiency" },
  { level: 10, description: "Advanced proficiency" },
  { level: 9, description: "Advanced intermediate" },
  { level: 8, description: "Intermediate" },
  { level: 7, description: "Developing proficiency" },
  { level: 6, description: "Basic proficiency" },
  { level: 5, description: "Initial proficiency" },
  { level: 4, description: "Basic proficiency" },
]

export function CELPIPScoreCalculator() {
  const [scores, setScores] = useState({
    listening: "",
    reading: "",
    writing: "",
    speaking: "",
  })

  const calculateMinimum = () => {
    const values = Object.values(scores).map(Number).filter(v => !isNaN(v) && v > 0)
    if (values.length === 0) return null
    return Math.min(...values)
  }

  const minimumScore = calculateMinimum()
  const clbLevel = minimumScore ? Math.min(12, Math.max(4, minimumScore)) : null

  const handleScoreChange = (section: string, value: string) => {
    const numValue = parseInt(value)
    if (value === "" || (!isNaN(numValue) && numValue >= 1 && numValue <= 12)) {
      setScores(prev => ({ ...prev, [section]: value }))
    }
  }

  return (
    <div className="container mx-auto container-padding py-10 md:py-14 max-w-4xl">
      <motion.div
        className="text-center mb-10"
        initial={sectionHeader.initial}
        animate={sectionHeader.animate}
        transition={sectionHeader.transition}
      >
        <div className="inline-flex h-12 w-12 rounded-xl gradient-primary items-center justify-center mb-4 shadow-sm">
          <Calculator className="h-6 w-6 text-white" />
        </div>
        <h1 className="heading-2 mb-3 text-gradient-primary">CELPIP Score Calculator</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Enter your CELPIP section scores to see your individual section scores and minimum CLB level.
        </p>
      </motion.div>

      <Card className="card-modern card-elevated mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Enter Your Scores
          </CardTitle>
          <CardDescription className="text-sm">
            Enter your CELPIP scores (1-12) for each section
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { key: "listening", label: "Listening", icon: "🎧" },
              { key: "reading", label: "Reading", icon: "📖" },
              { key: "writing", label: "Writing", icon: "✍️" },
              { key: "speaking", label: "Speaking", icon: "🎤" },
            ].map((section) => (
              <div key={section.key}>
                <label className="text-sm font-medium mb-2 block text-muted-foreground">
                  {section.icon} {section.label}
                </label>
                <Input
                  type="number"
                  min="1"
                  max="12"
                  placeholder="1-12"
                  value={scores[section.key as keyof typeof scores]}
                  onChange={(e) => handleScoreChange(section.key, e.target.value)}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {minimumScore && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
        >
          <Card className="card-modern card-elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Minimum Score
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-4xl font-bold text-gradient-primary mb-2">{minimumScore}</div>
              <p className="text-sm text-muted-foreground">Lowest score across all sections</p>
            </CardContent>
          </Card>

          <Card className="card-modern card-elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Minimum CLB Level
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-4xl font-bold text-gradient-primary mb-2">CLB {clbLevel}</div>
              <p className="text-sm text-muted-foreground">
                {clbLevels.find(l => l.level === clbLevel)?.description || "Canadian Language Benchmark"}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Card className="card-modern card-elevated border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-sm leading-relaxed">
              <p className="font-semibold mb-2">How CELPIP Scoring Works</p>
              <ul className="space-y-1.5 text-muted-foreground">
                <li>• Each section is scored independently from 1 to 12</li>
                <li>• CLB levels correspond directly to CELPIP scores (CLB 4-12)</li>
                <li>• Immigration programs require minimum scores in each section (typically CLB 7 or higher)</li>
                <li>• Your minimum score determines your eligibility, not an average</li>
                <li>• This calculator provides an estimate - official scores come from CELPIP</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

