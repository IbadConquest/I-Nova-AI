import { NextRequest, NextResponse } from "next/server"
import { readFileSync, existsSync } from "fs"
import { join } from "path"

interface RouteParams {
  params: {
    userId: string
    filename: string
  }
}

async function verifyAuth(request: NextRequest, userId: string) {
  const auth = request.headers.get("authorization")
  if (!auth || !auth.startsWith("Bearer ")) {
    return null
  }
  
  const token = auth.substring(7)
  // In a real implementation, verify the token and check if user can access this file
  return token && userId ? { id: userId } : null
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId, filename } = params
    
    // Verify authentication and authorization
    const user = await verifyAuth(request, userId)
    if (!user || user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Validate filename to prevent path traversal
    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 })
    }

    // Construct file path
    const filePath = join(process.cwd(), "data", "voice", userId, filename)

    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Read and serve the file
    const fileBuffer = readFileSync(filePath)
    
    // Determine content type based on file extension
    let contentType = "application/octet-stream"
    if (filename.endsWith(".mp3")) {
      contentType = "audio/mpeg"
    } else if (filename.endsWith(".wav")) {
      contentType = "audio/wav"
    } else if (filename.endsWith(".ogg")) {
      contentType = "audio/ogg"
    } else if (filename.endsWith(".m4a")) {
      contentType = "audio/mp4"
    }

    // Create response with appropriate headers
    const response = new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": fileBuffer.length.toString(),
        "Cache-Control": "public, max-age=31536000", // Cache for 1 year
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    })

    return response

  } catch (error) {
    console.error("File serving error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}