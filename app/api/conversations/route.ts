import { type NextRequest, NextResponse } from "next/server"
import { getUserConversations, createConversation, deleteConversation } from "@/lib/conversations"
import { deleteMessagesForConversation } from "@/lib/messages"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const conversations = getUserConversations(userId)
    return NextResponse.json({ conversations })
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, title } = await request.json()

    if (!userId || !title) {
      return NextResponse.json({ error: "User ID and title are required" }, { status: 400 })
    }

    const conversation = createConversation(userId, title)
    return NextResponse.json({ conversation })
  } catch (error) {
    console.error("Error creating conversation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get("conversationId")
    const userId = searchParams.get("userId")

    if (!conversationId || !userId) {
      return NextResponse.json({ error: "Conversation ID and User ID are required" }, { status: 400 })
    }

    const deleted = deleteConversation(conversationId, userId)
    if (deleted) {
      // Also delete all messages for this conversation
      deleteMessagesForConversation(conversationId, userId)
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error deleting conversation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
