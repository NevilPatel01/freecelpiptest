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

        const subscribers = await prisma.newsletter.findMany({
            orderBy: {
                subscribedAt: "desc",
            },
        })

        return NextResponse.json({ subscribers })
    } catch (error) {
        console.error("Error fetching newsletter subscribers:", error)
        return NextResponse.json(
            { error: "Failed to fetch subscribers" },
            { status: 500 }
        )
    }
}
