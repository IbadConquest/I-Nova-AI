import { type NextRequest, NextResponse } from "next/server"
import { getMessages, saveMessage } from "@/lib/messages"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const messages = getMessages(userId)
    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, content, role } = await request.json()

    if (!userId || !content || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!["user", "assistant"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    const message = saveMessage({ userId, content, role })
    return NextResponse.json({ message })
  } catch (error) {
    console.error("Error saving message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
