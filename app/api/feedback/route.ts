import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message, rating, category } = body

    // Validate required fields
    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    // Save feedback to database
    // Note: You'll need to add a Feedback model to your Prisma schema
    // For now, we'll just return success
    // In production, you would save to database:
    // await prisma.feedback.create({
    //   data: {
    //     name: name || null,
    //     email: email || null,
    //     message,
    //     rating: rating || null,
    //     category: category || 'general',
    //   },
    // })

    // Log feedback (in production, save to database)
    console.log("Feedback received:", { name, email, message, rating, category })

    return NextResponse.json(
      { 
        success: true, 
        message: "Thank you for your feedback! We appreciate your input." 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Feedback submission error:", error)
    return NextResponse.json(
      { error: "Failed to submit feedback. Please try again." },
      { status: 500 }
    )
  }
}

