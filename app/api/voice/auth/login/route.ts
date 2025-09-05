import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'
import { readFileSync, existsSync } from "fs"
import { join } from "path"
import bcrypt from "bcryptjs"

interface LoginRequest {
  email: string
  password: string
}

export async function POST(request: NextRequest) {
  try {
    const { email, password }: LoginRequest = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Load users from JSON file
    const usersFile = join(process.cwd(), "data", "users.json")
    if (!existsSync(usersFile)) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    const usersData = JSON.parse(readFileSync(usersFile, "utf8"))
    const users = usersData.users || []

    // Find user by email
    const user = users.find((u: any) => u.email === email)
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Generate simple token (in production, use JWT)
    const token = `voice_token_${user.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      token,
      user: userWithoutPassword,
    })

  } catch (error) {
    console.error("Voice auth login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}