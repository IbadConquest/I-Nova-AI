import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs"
import { join } from "path"

async function verifyAuth(request: NextRequest) {
  const auth = request.headers.get("authorization")
  if (!auth || !auth.startsWith("Bearer ")) {
    return null
  }
  
  const token = auth.substring(7)
  return token ? { id: "user123", name: "User", email: "user@example.com" } : null
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create user directory if it doesn't exist
    const userDir = join(process.cwd(), "data", "voice", user.id)
    if (!existsSync(userDir)) {
      mkdirSync(userDir, { recursive: true })
    }

    // Load user profile
    const profileFile = join(userDir, "profile.json")
    let profile = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: "",
      preferredVoice: "rachel",
      defaultSpeed: 1.0,
      defaultStability: 0.75,
      autoSave: true,
      emailNotifications: true,
      qualityPreference: "high",
      language: "en",
      timezone: "America/New_York",
      voicePreferences: {
        preferredModel: "rachel",
        defaultSpeed: 1.0,
        defaultPitch: 0.0,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (existsSync(profileFile)) {
      try {
        const savedProfile = JSON.parse(readFileSync(profileFile, "utf8"))
        profile = { ...profile, ...savedProfile, id: user.id }
      } catch (e) {
        console.error("Error reading profile:", e)
      }
    } else {
      // Save default profile
      writeFileSync(profileFile, JSON.stringify(profile, null, 2))
    }

    return NextResponse.json(profile)

  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const updates = await request.json()

    // Create user directory if it doesn't exist
    const userDir = join(process.cwd(), "data", "voice", user.id)
    if (!existsSync(userDir)) {
      mkdirSync(userDir, { recursive: true })
    }

    // Load existing profile
    const profileFile = join(userDir, "profile.json")
    let profile = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: "",
      preferredVoice: "rachel",
      defaultSpeed: 1.0,
      defaultStability: 0.75,
      autoSave: true,
      emailNotifications: true,
      qualityPreference: "high",
      language: "en",
      timezone: "America/New_York",
      voicePreferences: {
        preferredModel: "rachel",
        defaultSpeed: 1.0,
        defaultPitch: 0.0,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (existsSync(profileFile)) {
      try {
        const savedProfile = JSON.parse(readFileSync(profileFile, "utf8"))
        profile = { ...profile, ...savedProfile }
      } catch (e) {
        console.error("Error reading profile:", e)
      }
    }

    // Apply updates
    const allowedFields = [
      "name", "email", "avatar", "preferredVoice", "defaultSpeed", "defaultStability",
      "autoSave", "emailNotifications", "qualityPreference", "language", "timezone",
      "voicePreferences"
    ]

    const updatedProfile = { ...profile }
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        updatedProfile[key] = value
      }
    }

    updatedProfile.updatedAt = new Date().toISOString()

    // Save updated profile
    writeFileSync(profileFile, JSON.stringify(updatedProfile, null, 2))

    return NextResponse.json(updatedProfile)

  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}