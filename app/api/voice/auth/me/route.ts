import { NextRequest, NextResponse } from "next/server"
import { readFileSync, existsSync } from "fs"
import { join } from "path"

async function verifyToken(token: string) {
  // In a real implementation, this would validate a JWT token
  // For now, we'll use a simple token format check
  if (!token.startsWith("voice_token_")) {
    return null
  }

  // Extract user ID from token (simplified)
  const parts = token.split("_")
  if (parts.length < 3) {
    return null
  }

  const userId = parts[2]
  
  // Load and return user data
  const usersFile = join(process.cwd(), "data", "users.json")
  if (!existsSync(usersFile)) {
    return null
  }

  try {
    const usersData = JSON.parse(readFileSync(usersFile, "utf8"))
    const users = usersData.users || []
    const user = users.find((u: any) => u.id === userId)
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user
      return userWithoutPassword
    }
  } catch (error) {
    console.error("Error loading user data:", error)
  }

  return null
}

export async function GET(request: NextRequest) {
  try {
    const auth = request.headers.get("authorization")
    if (!auth || !auth.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const token = auth.substring(7)
    const user = await verifyToken(token)

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    return NextResponse.json(user)

  } catch (error) {
    console.error("Voice auth me error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}