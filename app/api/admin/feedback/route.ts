import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { isAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const session = await auth()

        if (!session || !isAdmin(session.user?.email)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const feedback = await prisma.feedback.findMany({
            orderBy: {
                createdAt: "desc",
            },
        })

        return NextResponse.json({ feedback })
    } catch (error) {
        console.error("Error fetching feedback:", error)
        return NextResponse.json(
            { error: "Failed to fetch feedback" },
            { status: 500 }
        )
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await auth()

        if (!session || !isAdmin(session.user?.email)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id, status } = await request.json()

        const updated = await prisma.feedback.update({
            where: { id },
            data: { status },
        })

        return NextResponse.json({ feedback: updated })
    } catch (error) {
        console.error("Error updating feedback:", error)
        return NextResponse.json(
            { error: "Failed to update feedback" },
            { status: 500 }
        )
    }
}
