"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Headphones, BookOpen, PenTool, Mic, Clock, Play, Pause, ArrowLeft, Mail, Bell } from "lucide-react"
import Link from "next/link"

interface PracticeSectionProps {
  section: string
}

const sectionConfig = {
  listening: {
    name: "Listening",
    icon: Headphones,
    description: "Listen to audio recordings and answer comprehension questions.",
    gradient: "gradient-listening",
  },
  reading: {
    name: "Reading",
    icon: BookOpen,
    description: "Read passages and answer questions to test your comprehension.",
    gradient: "gradient-reading",
  },
  writing: {
    name: "Writing",
    icon: PenTool,
    description: "Practice writing emails and essays with guided exercises.",
    gradient: "gradient-writing",
  },
  speaking: {
    name: "Speaking",
    icon: Mic,
    description: "Practice speaking tasks and improve your fluency.",
    gradient: "gradient-speaking",
  },
}

export function PracticeSection({ section }: PracticeSectionProps) {
  const config = sectionConfig[section as keyof typeof sectionConfig]
  const Icon = config.icon
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(1800) // 30 minutes in seconds
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [writingText, setWritingText] = useState("")

  // Mock questions
  const mockQuestions = {
    listening: [
      { id: 1, question: "What is the main topic of the conversation?", options: ["A) Weather", "B) Travel plans", "C) Restaurant", "D) Shopping"] },
      { id: 2, question: "Where does the conversation take place?", options: ["A) Airport", "B) Hotel", "C) Restaurant", "D) Office"] },
    ],
    reading: [
      { id: 1, question: "What is the main idea of the passage?", options: ["A) Climate change", "B) Technology", "C) Education", "D) Health"] },
      { id: 2, question: "According to the passage, what is mentioned about...?", options: ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"] },
    ],
    writing: {
      task: "Write an email to your professor explaining why you missed class yesterday.",
      wordCount: 150,
    },
    speaking: [
      { id: 1, task: "Describe a memorable vacation you took.", time: 60 },
      { id: 2, task: "Give advice to someone planning to visit your country.", time: 90 },
    ],
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const wordCount = writingText.split(/\s+/).filter(word => word.length > 0).length

  return (
    <div className="container mx-auto container-padding py-8 md:py-12">
      <Button variant="ghost" asChild className="mb-6 whitespace-nowrap" size="sm">
        <Link href="/practice" className="flex items-center">
          <ArrowLeft className="mr-2 h-3.5 w-3.5 flex-shrink-0" />
          <span>Back to Practice Tests</span>
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header */}
          <Card className="card-modern card-elevated">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className={`h-14 w-14 rounded-2xl ${config.gradient} flex items-center justify-center shadow-md`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-gradient-primary">{config.name} Practice</CardTitle>
                  <CardDescription className="text-sm">{config.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Notification Banner */}
          <Card className="card-modern border-primary/20 card-elevated">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-md">
                  <Bell className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-1.5">Full version launching soon</p>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                    This is a preview interface. Sign up to get notified when complete practice tests are available.
                  </p>
                  <div className="flex gap-2">
                    <Input placeholder="Enter your email" className="flex-1 text-sm" />
                    <Button size="sm">Notify Me</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Practice Interface */}
          <Card className="card-modern card-elevated">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg font-semibold mb-1">Question {currentQuestion}</CardTitle>
                  <CardDescription className="text-xs">
                    {section === "listening" && "Listen to the audio and answer the questions"}
                    {section === "reading" && "Read the passage and answer the questions"}
                    {section === "writing" && "Complete the writing task"}
                    {section === "speaking" && "Record your response"}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border text-xs font-semibold">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span className="font-mono">{formatTime(timeRemaining)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Listening Interface */}
              {section === "listening" && (
                <>
                  <div className="bg-muted/30 rounded-lg p-6 text-center border border-border">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="mb-4"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="mr-2 h-5 w-5" />
                          Pause Audio
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-5 w-5" />
                          Play Audio
                        </>
                      )}
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Audio player preview - Full audio will be available in the complete version
                    </p>
                  </div>
                  {mockQuestions.listening.map((q) => (
                    <div key={q.id} className="space-y-3">
                      <p className="font-medium">{q.question}</p>
                      <div className="space-y-2">
                        {q.options.map((option) => (
                          <Button
                            key={option}
                            variant="outline"
                            className="w-full justify-start text-left"
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Reading Interface */}
              {section === "reading" && (
                <>
                  <div className="bg-muted/30 rounded-lg p-6 max-h-64 overflow-y-auto border border-border">
                    <p className="text-sm leading-relaxed">
                      This is a sample reading passage. In the full version, you'll see complete passages
                      with multiple paragraphs. Read carefully and answer the questions below.
                    </p>
                    <p className="text-sm leading-relaxed mt-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                      exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                  </div>
                  {mockQuestions.reading.map((q) => (
                    <div key={q.id} className="space-y-3">
                      <p className="font-medium">{q.question}</p>
                      <div className="space-y-2">
                        {q.options.map((option) => (
                          <Button
                            key={option}
                            variant="outline"
                            className="w-full justify-start text-left"
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Writing Interface */}
              {section === "writing" && (
                <>
                  <div className="space-y-4">
                    <div className="bg-muted/30 rounded-lg p-4 border border-border">
                      <p className="font-medium mb-2">Task:</p>
                      <p className="text-sm">{mockQuestions.writing.task}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Word count: {mockQuestions.writing.wordCount} words
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Word count: {wordCount} / {mockQuestions.writing.wordCount}</span>
                        <span>Time remaining: {formatTime(timeRemaining)}</span>
                      </div>
                      <textarea
                        value={writingText}
                        onChange={(e) => setWritingText(e.target.value)}
                        className="w-full h-64 p-4 rounded-lg resize-none border border-input bg-background"
                        placeholder="Start typing your response here..."
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Speaking Interface */}
              {section === "speaking" && (
                <>
                  {mockQuestions.speaking.map((task) => (
                    <div key={task.id} className="space-y-4">
                      <div className="bg-muted/30 rounded-lg p-4 border border-border">
                        <p className="font-medium mb-2">Task {task.id}:</p>
                        <p className="text-sm">{task.task}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Preparation time: 30 seconds | Speaking time: {task.time} seconds
                        </p>
                      </div>
                      <div className="flex flex-col items-center gap-4">
                        <Button size="lg" variant="outline" className="w-full">
                          <Mic className="mr-2 h-5 w-5" />
                          Start Recording
                        </Button>
                        <div className="text-sm text-muted-foreground text-center">
                          Recording interface preview - Full recording functionality coming soon
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  disabled={currentQuestion === 1}
                  onClick={() => setCurrentQuestion(Math.max(1, currentQuestion - 1))}
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                >
                  Next Question
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="text-lg">Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Overall Progress</span>
                  <span>0%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "0%" }} />
                </div>
              </div>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Questions Completed</span>
                  <span>0 / 10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time Spent</span>
                  <span>0 min</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="text-lg">Save Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Sign in with Google to save your progress and access your practice history.
              </p>
              <Button className="w-full" variant="outline">
                Sign in with Google
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

