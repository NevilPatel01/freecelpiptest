"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Headphones, BookOpen, PenTool, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { sectionHeader, slideUp } from "@/lib/animations"

interface Task {
  id: string
  taskNumber: number
  name: string
}

interface SectionConfig {
  id: string
  name: string
  icon: typeof Headphones
  gradient: string
  description: string
  tasks: Task[]
}

const sectionConfigs: Record<string, SectionConfig> = {
  listening: {
    id: "listening",
    name: "Listening",
    icon: Headphones,
    gradient: "gradient-listening",
    description: "Practice listening comprehension with audio recordings and questions.",
    tasks: [
      { id: "listening-1", taskNumber: 1, name: "Problem Solving" },
      { id: "listening-2", taskNumber: 2, name: "Daily Life Conversation" },
      { id: "listening-3", taskNumber: 3, name: "Information" },
      { id: "listening-4", taskNumber: 4, name: "News Item" },
      { id: "listening-5", taskNumber: 5, name: "Discussion" },
      { id: "listening-6", taskNumber: 6, name: "Viewpoints" },
    ],
  },
  reading: {
    id: "reading",
    name: "Reading",
    icon: BookOpen,
    gradient: "gradient-reading",
    description: "Improve your reading skills with passages and comprehension questions.",
    tasks: [
      { id: "reading-1", taskNumber: 1, name: "Correspondence" },
      { id: "reading-2", taskNumber: 2, name: "Apply a Diagram" },
      { id: "reading-3", taskNumber: 3, name: "Information" },
      { id: "reading-4", taskNumber: 4, name: "Viewpoints" },
    ],
  },
  writing: {
    id: "writing",
    name: "Writing",
    icon: PenTool,
    gradient: "gradient-writing",
    description: "Master email and essay writing with guided practice exercises.",
    tasks: [
      { id: "writing-1", taskNumber: 1, name: "Writing an Email" },
      { id: "writing-2", taskNumber: 2, name: "Survey Questions" },
    ],
  },
  speaking: {
    id: "speaking",
    name: "Speaking",
    icon: Mic,
    gradient: "gradient-speaking",
    description: "Improve your speaking fluency and pronunciation with practice tasks.",
    tasks: [
      { id: "speaking-1", taskNumber: 1, name: "Giving Advice" },
      { id: "speaking-2", taskNumber: 2, name: "Personal Experience" },
      { id: "speaking-3", taskNumber: 3, name: "Describing a Scene" },
      { id: "speaking-4", taskNumber: 4, name: "Making Predictions" },
      { id: "speaking-5", taskNumber: 5, name: "Comparing and Persuading" },
      { id: "speaking-6", taskNumber: 6, name: "Difficult Situation" },
      { id: "speaking-7", taskNumber: 7, name: "Expressing Opinions" },
      { id: "speaking-8", taskNumber: 8, name: "Unusual Situation" },
    ],
  },
}

interface PracticeSectionTasksProps {
  section: string
}

export function PracticeSectionTasks({ section }: PracticeSectionTasksProps) {
  const config = sectionConfigs[section.toLowerCase()]
  
  if (!config) {
    return null
  }

  const Icon = config.icon

  return (
    <div className="container mx-auto container-padding py-10 md:py-14">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Button variant="ghost" asChild className="whitespace-nowrap" size="sm">
          <Link href="/practice" className="flex items-center">
            <ArrowLeft className="mr-2 h-3.5 w-3.5 flex-shrink-0" />
            <span>Back to Practice Tests</span>
          </Link>
        </Button>
      </motion.div>

      {/* Header */}
      <motion.div
        className="mb-12"
        initial={sectionHeader.initial}
        animate={sectionHeader.animate}
        transition={sectionHeader.transition}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className={cn("h-12 w-12 rounded-xl", config.gradient, "flex items-center justify-center shadow-sm")}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="heading-2 mb-2 text-gradient-primary">{config.name} Practice</h1>
            <p className="text-base text-muted-foreground max-w-4xl leading-relaxed">
              {config.description}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {config.tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={slideUp.initial}
            animate={slideUp.animate}
            transition={{ ...slideUp.transition, delay: index * 0.05 }}
          >
            <div
              className={cn(
                "p-5 bg-card border border-border rounded-lg",
                "shadow-sm hover:shadow-md hover:border-primary/20",
                "transition-all duration-200",
                "group"
              )}
            >
              <div className="space-y-2">
                {/* Task Number - smaller, muted text */}
                <p className="text-xs text-muted-foreground font-normal">
                  Task {task.taskNumber}
                </p>
                {/* Task Name - larger, bold, foreground text */}
                <p className="text-base font-semibold text-foreground leading-tight">
                  {task.name}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
