"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, CheckCircle2, X, ArrowRight, TrendingUp } from "lucide-react"
import { sectionHeader } from "@/lib/animations"

const vocabularyTests = [
  {
    level: "Beginner",
    words: [
      { word: "happy", options: ["sad", "joyful", "angry", "tired"], correct: 1 },
      { word: "big", options: ["small", "large", "tiny", "little"], correct: 1 },
      { word: "fast", options: ["slow", "quick", "lazy", "calm"], correct: 1 },
    ],
  },
  {
    level: "Intermediate",
    words: [
      { word: "comprehensive", options: ["limited", "complete", "partial", "brief"], correct: 1 },
      { word: "significant", options: ["minor", "important", "trivial", "small"], correct: 1 },
      { word: "enhance", options: ["reduce", "improve", "decrease", "weaken"], correct: 1 },
    ],
  },
  {
    level: "Advanced",
    words: [
      { word: "ubiquitous", options: ["rare", "everywhere", "hidden", "unknown"], correct: 1 },
      { word: "meticulous", options: ["careless", "careful", "hasty", "casual"], correct: 1 },
      { word: "elaborate", options: ["simple", "detailed", "basic", "plain"], correct: 1 },
    ],
  },
]

export function VocabularyLevelGrader() {
  const [currentLevel, setCurrentLevel] = useState<number | null>(null)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswer = (wordIndex: number, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [wordIndex]: optionIndex }))
  }

  const calculateScore = () => {
    if (currentLevel === null) return
    const test = vocabularyTests[currentLevel]
    let correct = 0
    test.words.forEach((word, index) => {
      if (answers[index] === word.correct) {
        correct++
      }
    })
    setScore(correct)
    setShowResults(true)
  }

  const resetTest = () => {
    setCurrentLevel(null)
    setAnswers({})
    setShowResults(false)
    setScore(0)
  }

  const getLevelRecommendation = () => {
    if (currentLevel === null) return ""
    const test = vocabularyTests[currentLevel]
    const percentage = (score / test.words.length) * 100
    
    if (percentage >= 80) {
      return currentLevel < vocabularyTests.length - 1 
        ? `Excellent! Try the ${vocabularyTests[currentLevel + 1].level} level.`
        : "Excellent! You have advanced vocabulary skills."
    } else if (percentage >= 60) {
      return "Good! Continue practicing at this level."
    } else {
      return currentLevel > 0
        ? `Consider practicing at the ${vocabularyTests[currentLevel - 1].level} level first.`
        : "Keep practicing! Build your vocabulary foundation."
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
        <div className="inline-flex h-14 w-14 rounded-xl gradient-primary items-center justify-center mb-4 shadow-md">
          <BookOpen className="h-7 w-7 text-white" />
        </div>
        <h1 className="heading-2 mb-3 text-gradient-primary">Vocabulary Level Grader</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Test your English vocabulary level and see how it compares to CELPIP requirements.
        </p>
      </motion.div>

      {currentLevel === null ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vocabularyTests.map((test, index) => (
            <motion.div
              key={test.level}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="card-hover card-elevated cursor-pointer" onClick={() => setCurrentLevel(index)}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">{test.level}</CardTitle>
                  <CardDescription className="text-sm">
                    {test.words.length} vocabulary questions
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button variant="outline" className="w-full whitespace-nowrap" asChild>
                    <div className="flex items-center justify-center cursor-pointer">
                      <span>Start Test</span>
                      <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" />
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="card-modern card-elevated">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                {vocabularyTests[currentLevel].level} Level Test
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={resetTest} className="whitespace-nowrap">
                <span>Change Level</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {vocabularyTests[currentLevel].words.map((word, wordIndex) => (
              <div key={wordIndex} className="p-4 border border-border/50 rounded-lg">
                <p className="font-semibold mb-3 text-sm">
                  {wordIndex + 1}. What is the meaning of "<span className="text-primary">{word.word}</span>"?
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {word.options.map((option, optionIndex) => (
                    <button
                      key={optionIndex}
                      onClick={() => handleAnswer(wordIndex, optionIndex)}
                      className={`p-3 rounded-lg text-left text-sm border transition-all ${
                        answers[wordIndex] === optionIndex
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <Button 
              onClick={calculateScore} 
              className="w-full whitespace-nowrap"
              disabled={Object.keys(answers).length !== vocabularyTests[currentLevel].words.length}
            >
              <span>Calculate Score</span>
            </Button>

            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border border-primary/20 bg-primary/5 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <p className="font-semibold">Your Score: {score}/{vocabularyTests[currentLevel].words.length}</p>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{getLevelRecommendation()}</p>
                <div className="space-y-2">
                  {vocabularyTests[currentLevel].words.map((word, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      {answers[index] === word.correct ? (
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-destructive flex-shrink-0" />
                      )}
                      <span className={answers[index] === word.correct ? "text-foreground" : "text-muted-foreground"}>
                        {word.word}: {word.options[word.correct]}
                      </span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 whitespace-nowrap" onClick={resetTest}>
                  <span>Try Another Level</span>
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

