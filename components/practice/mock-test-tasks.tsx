"use client"

import { motion } from "framer-motion"
import { Headphones, BookOpen, PenTool, Mic } from "lucide-react"
import { cn } from "@/lib/utils"
import { sectionHeader, slideUp } from "@/lib/animations"

interface Task {
  id: string
  taskNumber: number
  name: string
}

interface Section {
  id: string
  name: string
  icon: typeof Headphones
  gradient: string
  tasks: Task[]
}

const sections: Section[] = [
  {
    id: "listening",
    name: "Listening",
    icon: Headphones,
    gradient: "gradient-listening",
    tasks: [
      { id: "listening-1", taskNumber: 1, name: "Problem Solving" },
      { id: "listening-2", taskNumber: 2, name: "Daily Life Conversation" },
      { id: "listening-3", taskNumber: 3, name: "Information" },
      { id: "listening-4", taskNumber: 4, name: "News Item" },
      { id: "listening-5", taskNumber: 5, name: "Discussion" },
      { id: "listening-6", taskNumber: 6, name: "Viewpoints" },
    ],
  },
  {
    id: "reading",
    name: "Reading",
    icon: BookOpen,
    gradient: "gradient-reading",
    tasks: [
      { id: "reading-1", taskNumber: 1, name: "Correspondence" },
      { id: "reading-2", taskNumber: 2, name: "Apply a Diagram" },
      { id: "reading-3", taskNumber: 3, name: "Information" },
      { id: "reading-4", taskNumber: 4, name: "Viewpoints" },
    ],
  },
  {
    id: "writing",
    name: "Writing",
    icon: PenTool,
    gradient: "gradient-writing",
    tasks: [
      { id: "writing-1", taskNumber: 1, name: "Writing an Email" },
      { id: "writing-2", taskNumber: 2, name: "Survey Questions" },
    ],
  },
  {
    id: "speaking",
    name: "Speaking",
    icon: Mic,
    gradient: "gradient-speaking",
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
]

export function MockTestTasks() {
  return (
    <div className="container mx-auto container-padding py-10 md:py-14">
      {/* Page Header */}
      <motion.div
        className="mb-12"
        initial={sectionHeader.initial}
        animate={sectionHeader.animate}
        transition={sectionHeader.transition}
      >
        <h1 className="heading-2 mb-3 text-gradient-primary">Mock Tests</h1>
        <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
          Select a task to practice individual sections. Choose from Listening, Reading, Writing, and Speaking tasks.
        </p>
      </motion.div>

      {/* Sections Grid - 4 columns on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {sections.map((section, sectionIndex) => {
          const Icon = section.icon
          return (
            <motion.div
              key={section.id}
              initial={slideUp.initial}
              animate={slideUp.animate}
              transition={{ ...slideUp.transition, delay: sectionIndex * 0.1 }}
              className="flex flex-col gap-4"
            >
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-2">
                <div className={cn("h-10 w-10 rounded-xl", section.gradient, "flex items-center justify-center shadow-sm")}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{section.name}</h2>
                  <p className="text-xs text-muted-foreground">{section.tasks.length} tasks</p>
                </div>
              </div>

              {/* Tasks */}
              <div className="flex flex-col gap-3">
                {section.tasks.map((task, taskIndex) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: sectionIndex * 0.1 + taskIndex * 0.03,
                    }}
                  >
                    <div
                      className={cn(
                        "p-4 bg-card border border-border rounded-lg",
                        "shadow-sm hover:shadow-md",
                        "transition-all duration-200",
                        "group"
                      )}
                    >
                      <div className="space-y-1">
                        {/* Task Number - smaller, muted text */}
                        <p className="text-xs text-muted-foreground font-normal leading-tight">
                          Task {task.taskNumber}
                        </p>
                        {/* Task Name - larger, bold, foreground text */}
                        <p className="text-sm font-semibold text-foreground leading-tight">
                          {task.name}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
