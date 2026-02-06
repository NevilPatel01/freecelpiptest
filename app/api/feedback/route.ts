import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const feedbackSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  message: z.string().min(1, "Message is required"),
  rating: z.number().min(1).max(5).optional().nullable(),
  category: z.string().default("general"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = feedbackSchema.parse(body)

    // Save feedback to database
    await prisma.feedback.create({
      data: {
        name: validated.name || null,
        email: validated.email || null,
        message: validated.message,
        rating: validated.rating || null,
        category: validated.category,
        status: "new",
      },
    })

    return NextResponse.json(
      { 
        success: true, 
        message: "Thank you for your feedback! We appreciate your input." 
      },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("Feedback submission error:", error)
    return NextResponse.json(
      { error: "Failed to submit feedback. Please try again." },
      { status: 500 }
    )
  }
}

