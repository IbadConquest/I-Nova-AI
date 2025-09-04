import { readFileSync, writeFileSync } from "fs"
import { join } from "path"

export interface Message {
  id: string
  userId: string
  conversationId?: string
  content: string
  role: "user" | "assistant"
  timestamp: string
}

const messagesPath = join(process.cwd(), "data", "messages.json")

export function getMessages(userId: string, conversationId?: string): Message[] {
  try {
    const data = readFileSync(messagesPath, "utf8")
    const allMessages = JSON.parse(data).messages
    return allMessages
      .filter((msg: Message) => {
        if (conversationId) {
          return msg.userId === userId && msg.conversationId === conversationId
        }
        return msg.userId === userId
      })
      .sort((a: Message, b: Message) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  } catch {
    return []
  }
}

export function saveMessage(message: Omit<Message, "id" | "timestamp">): Message {
  try {
    const data = readFileSync(messagesPath, "utf8")
    const allMessages = JSON.parse(data).messages

    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    }

    allMessages.push(newMessage)
    writeFileSync(messagesPath, JSON.stringify({ messages: allMessages }, null, 2))

    return newMessage
  } catch {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    }

    writeFileSync(messagesPath, JSON.stringify({ messages: [newMessage] }, null, 2))
    return newMessage
  }
}

export function deleteMessagesForConversation(conversationId: string, userId: string): void {
  try {
    const data = readFileSync(messagesPath, "utf8")
    const allMessages = JSON.parse(data).messages

    const filteredMessages = allMessages.filter(
      (msg: Message) => !(msg.conversationId === conversationId && msg.userId === userId),
    )

    writeFileSync(messagesPath, JSON.stringify({ messages: filteredMessages }, null, 2))
  } catch (error) {
    console.error("Error deleting messages:", error)
  }
}

export function clearUserMessages(userId: string): void {
  try {
    const data = readFileSync(messagesPath, "utf8")
    const allMessages = JSON.parse(data).messages

    const filteredMessages = allMessages.filter((msg: Message) => msg.userId !== userId)

    writeFileSync(messagesPath, JSON.stringify({ messages: filteredMessages }, null, 2))
  } catch (error) {
    console.error("Error clearing messages:", error)
  }
}
