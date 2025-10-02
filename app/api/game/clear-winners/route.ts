import { NextResponse } from "next/server"
import { clearAllWinners } from "@/lib/redis"

export async function POST() {
  try {
    await clearAllWinners()
    return NextResponse.json({ success: true, message: "All winners cleared" })
  } catch (error) {
    console.error("Error clearing winners:", error)
    return NextResponse.json({ error: "Failed to clear winners" }, { status: 500 })
  }
}
