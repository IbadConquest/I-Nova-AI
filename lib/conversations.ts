import { readFileSync, writeFileSync } from "fs"
import { join } from "path"

export interface Conversation {
  id: string
  userId: string
  title: string
  lastMessageAt: string
  createdAt: string
}

const conversationsPath = join(process.cwd(), "data", "conversations.json")

export function getConversations(): Conversation[] {
  try {
    const data = readFileSync(conversationsPath, "utf8")
    return JSON.parse(data).conversations
  } catch {
    return []
  }
}

export function saveConversations(conversations: Conversation[]) {
  writeFileSync(conversationsPath, JSON.stringify({ conversations }, null, 2))
}

export function getUserConversations(userId: string): Conversation[] {
  const conversations = getConversations()
  return conversations
    .filter((conv) => conv.userId === userId)
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
}

export function createConversation(userId: string, title: string): Conversation {
  const conversations = getConversations()
  const now = new Date().toISOString()

  const newConversation: Conversation = {
    id: Date.now().toString(),
    userId,
    title,
    lastMessageAt: now,
    createdAt: now,
  }

  conversations.push(newConversation)
  saveConversations(conversations)
  return newConversation
}

export function updateConversationLastMessage(conversationId: string): void {
  const conversations = getConversations()
  const conversationIndex = conversations.findIndex((conv) => conv.id === conversationId)

  if (conversationIndex >= 0) {
    conversations[conversationIndex].lastMessageAt = new Date().toISOString()
    saveConversations(conversations)
  }
}

export function deleteConversation(conversationId: string, userId: string): boolean {
  const conversations = getConversations()
  const conversationIndex = conversations.findIndex((conv) => conv.id === conversationId && conv.userId === userId)

  if (conversationIndex >= 0) {
    conversations.splice(conversationIndex, 1)
    saveConversations(conversations)
    return true
  }
  return false
}
