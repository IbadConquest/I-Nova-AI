import { type NextRequest, NextResponse } from "next/server"
import { getUserConfig, saveUserConfig } from "@/lib/config"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const config = getUserConfig(userId)
    return NextResponse.json({ config })
  } catch (error) {
    console.error("Error fetching config:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, ...configData } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const config = saveUserConfig(userId, configData)
    return NextResponse.json({ config })
  } catch (error) {
    console.error("Error saving config:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
