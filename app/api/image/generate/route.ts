import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

interface GenerateImageRequest {
  prompt: string
  style?: string
  size?: string
}

// Mock image URLs for demonstration
const mockImages = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1024&h=1024&fit=crop",
  "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=1024&h=1024&fit=crop",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1024&h=1024&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1024&h=1024&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1024&h=1024&fit=crop",
  "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1024&h=1024&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1024&h=1024&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1024&h=1024&fit=crop",
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1024&h=1024&fit=crop",
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1024&h=1024&fit=crop"
]

export async function POST(request: NextRequest) {
  try {
    const body: GenerateImageRequest = await request.json()
    const { prompt, style = "realistic", size = "1024x1024" } = body

    // Validate input
    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      )
    }

    if (prompt.length > 1000) {
      return NextResponse.json(
        { error: "Prompt too long (max 1000 characters)" },
        { status: 400 }
      )
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock image generation - in production, this would call an actual AI image service
    // You can integrate with services like:
    // - OpenAI DALL-E
    // - Stability AI
    // - Midjourney API
    // - Replicate
    
    const randomIndex = Math.floor(Math.random() * mockImages.length)
    const imageUrl = mockImages[randomIndex]

    // Mock metadata
    const generatedImage = {
      imageUrl,
      prompt: prompt.substring(0, 100) + (prompt.length > 100 ? "..." : ""),
      style,
      size,
      id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      ...generatedImage,
    })

  } catch (error) {
    console.error("Image generation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}