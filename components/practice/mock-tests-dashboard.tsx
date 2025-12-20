"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Clock, CheckCircle2, AlertCircle, Mail, Play, Pause, ArrowRight } from "lucide-react"
import Link from "next/link"

export function MockTestsDashboard() {
  const [timeRemaining, setTimeRemaining] = useState(18000) // 5 hours in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [currentSection, setCurrentSection] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => Math.max(0, prev - 1))
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeRemaining])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const sections = [
    { id: "listening", name: "Listening", duration: 47, completed: false },
    { id: "reading", name: "Reading", duration: 55, completed: false },
    { id: "writing", name: "Writing", duration: 53, completed: false },
    { id: "speaking", name: "Speaking", duration: 20, completed: false },
  ]

  if (showResults) {
    return (
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="card-modern mb-8 card-elevated">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl md:text-3xl font-semibold mb-2 text-gradient-primary">Test Results</CardTitle>
              <CardDescription className="text-sm">Your CELPIP Mock Test Performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {sections.map((section) => (
                  <div key={section.id} className="text-center p-4 bg-muted/30 rounded-xl border border-border">
                    <p className="text-xs text-muted-foreground mb-2 font-medium">{section.name}</p>
                    <p className="text-xl font-bold text-foreground">--</p>
                    <p className="text-xs text-muted-foreground mt-1">Score</p>
                  </div>
                ))}
              </div>
              <div className="pt-6 border-t">
                <p className="text-center text-sm text-muted-foreground mb-5 leading-relaxed">
                  Complete mock tests with scoring are coming soon!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="outline" size="sm" onClick={() => setShowResults(false)}>
                    Back to Test
                  </Button>
                  <Button size="sm" onClick={() => setShowResults(false)}>
                    Take Another Test
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto container-padding py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="heading-2 mb-4 text-gradient-primary">CELPIP Mock Tests</h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          Take a full-length practice test to simulate the real CELPIP exam experience.
        </p>
      </motion.div>

      {!currentSection ? (
        <div className="space-y-6">
          <Card className="card-modern card-elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Start Mock Test</CardTitle>
              <CardDescription className="text-sm">
                Complete all 4 sections: Listening, Reading, Writing, and Speaking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    className="p-4 bg-muted/30 rounded-xl flex items-center justify-between hover:bg-muted/50 border border-border transition-all"
                  >
                    <div>
                      <p className="font-semibold text-sm">{section.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{section.duration} minutes</p>
                    </div>
                    {section.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted" />
                    )}
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground mb-4">
                  Total test duration: Approximately 3 hours
                </p>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    setCurrentSection("listening")
                    setIsRunning(true)
                  }}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Mock Test
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern border-primary/20 card-elevated">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-md">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2 text-gradient-primary">Complete mock tests coming soon</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    We're building the full mock test experience with realistic questions, timing, and scoring.
                    Sign up to get notified when it's ready!
                  </p>
                  <div className="flex gap-2">
                    <Input placeholder="Enter your email" className="flex-1 text-sm" />
                    <Button size="sm">
                      <Mail className="mr-2 h-3.5 w-3.5" />
                      Notify Me
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="card-modern card-elevated">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg font-semibold mb-1">
                    {sections.find((s) => s.id === currentSection)?.name} Section
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Question 1 of 10
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-lg font-mono font-semibold">{formatTime(timeRemaining)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Time Remaining</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsRunning(!isRunning)}
                  >
                    {isRunning ? (
                      <>
                        <Pause className="mr-2 h-3.5 w-3.5" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-3.5 w-3.5" />
                        Resume
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="mb-6">
                <div className="flex justify-between text-xs mb-2.5">
                  <span className="font-medium text-muted-foreground">Progress</span>
                  <span className="font-semibold text-foreground">1 / 10 questions</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full gradient-primary rounded-full transition-all duration-500" style={{ width: "10%" }} />
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-6 mb-6 border border-border">
                <p className="text-center text-muted-foreground">
                  Mock test interface preview. Full test experience coming soon!
                </p>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentSection(null)}>
                  Exit Test
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline">Previous</Button>
                  <Button>Next Question</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="text-lg">Section Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {sections.map((section) => (
                  <Button
                    key={section.id}
                    variant={currentSection === section.id ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setCurrentSection(section.id)}
                  >
                    {section.name}
                  </Button>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button
                  className="w-full"
                  onClick={() => setShowResults(true)}
                >
                  Submit Test
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

