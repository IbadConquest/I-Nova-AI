import { type NextRequest, NextResponse } from "next/server"
import { clearUserMessages } from "@/lib/messages"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    clearUserMessages(userId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error clearing messages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
