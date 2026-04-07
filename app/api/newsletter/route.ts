import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = newsletterSchema.parse(body)

    const existing = await prisma.newsletter.findUnique({
      where: { email },
    })

    if (existing) {
      if (existing.active) {
        return NextResponse.json(
          { message: "Email already subscribed" },
          { status: 400 }
        )
      }
      await prisma.newsletter.update({
        where: { email },
        data: { active: true },
      })
      return NextResponse.json({ message: "Successfully resubscribed" })
    }

    await prisma.newsletter.create({
      data: { email, active: true },
    })

    return NextResponse.json({ message: "Successfully subscribed" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      )
    }
    console.error("Newsletter subscription error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
