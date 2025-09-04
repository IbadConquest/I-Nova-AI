import { NextResponse } from "next/server"
import { initializeDatabases } from "@/lib/database"

export async function POST() {
  try {
    initializeDatabases()
    return NextResponse.json({ success: true, message: "Databases initialized successfully" })
  } catch (error) {
    console.error("Error initializing databases:", error)
    return NextResponse.json({ error: "Failed to initialize databases" }, { status: 500 })
  }
}
