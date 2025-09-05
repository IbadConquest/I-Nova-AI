import { NextRequest, NextResponse } from "next/server"
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs"
import { join } from "path"

// ElevenLabs API configuration
const ELEVENLABS_API_KEY = "sk_36c79273cfff468a20301d4aced4c69835739441dc106acf"
const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1"

// Voice models mapping
const VOICE_MODELS = {
  rachel: "21m00Tcm4TlvDq8ikWAM", // Rachel - Professional
  drew: "29vD33N1CtxCmqQRPOHJ", // Drew - Conversational
  clyde: "2EiwWnXFnvU5JabPnv8n", // Clyde - Narrator
  paul: "5Q0t7uMcjvnagumLfvZi", // Paul - British
  domi: "AZnzlk1XvdvUeBnXmlld", // Domi - Creative
  dave: "CYw3kZ02Hs0563khs1Fj", // Dave - Professional
}

interface GenerateRequest {
  text: string
  voice: string
  speed?: number
  stability?: number
  clarity?: number
}

async function verifyAuth(request: NextRequest) {
  const auth = request.headers.get("authorization")
  if (!auth || !auth.startsWith("Bearer ")) {
    return null
  }
  
  // Simple token verification (in production, use proper JWT validation)
  const token = auth.substring(7)
  return token ? { id: "user123", name: "User" } : null
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body: GenerateRequest = await request.json()
    const { text, voice = "rachel", speed = 1.0, stability = 0.75, clarity = 0.75 } = body

    // Validate input
    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    if (text.length > 5000) {
      return NextResponse.json({ error: "Text too long (max 5000 characters)" }, { status: 400 })
    }

    // Get voice ID
    const voiceId = VOICE_MODELS[voice as keyof typeof VOICE_MODELS] || VOICE_MODELS.rachel

    // Prepare ElevenLabs request
    const elevenLabsPayload = {
      text,
      model_id: "eleven_monolingual_v1",
      voice_settings: {
        stability: Math.max(0, Math.min(1, stability)),
        similarity_boost: Math.max(0, Math.min(1, clarity)),
        style: 0.5,
        use_speaker_boost: true
      }
    }

    // Make request to ElevenLabs API
    const response = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      body: JSON.stringify(elevenLabsPayload),
    })

    if (!response.ok) {
      console.error("ElevenLabs API error:", response.status, await response.text())
      return NextResponse.json(
        { error: "Voice generation failed" },
        { status: response.status }
      )
    }

    // Get audio data
    const audioBuffer = await response.arrayBuffer()
    const audioData = Buffer.from(audioBuffer)

    // Create user directory if it doesn't exist
    const userDir = join(process.cwd(), "data", "voice", user.id)
    if (!existsSync(userDir)) {
      mkdirSync(userDir, { recursive: true })
    }

    // Save audio file
    const filename = `tts-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.mp3`
    const filepath = join(userDir, filename)
    writeFileSync(filepath, audioData)

    // Save generation record
    const recordFile = join(userDir, "tts-history.json")
    let history = []
    if (existsSync(recordFile)) {
      try {
        history = JSON.parse(readFileSync(recordFile, "utf8"))
      } catch (e) {
        history = []
      }
    }

    const record = {
      id: filename.replace(".mp3", ""),
      text: text.substring(0, 100) + (text.length > 100 ? "..." : ""),
      voice,
      settings: { speed, stability, clarity },
      filename,
      createdAt: new Date().toISOString(),
      characterCount: text.length,
    }

    history.unshift(record)
    history = history.slice(0, 100) // Keep last 100 records
    writeFileSync(recordFile, JSON.stringify(history, null, 2))

    // Return success response with file URL
    // In production, you'd want to serve files through a proper file server or CDN
    const audioUrl = `/api/voice/files/${user.id}/${filename}`

    return NextResponse.json({
      success: true,
      audioUrl,
      record,
    })

  } catch (error) {
    console.error("TTS generation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}