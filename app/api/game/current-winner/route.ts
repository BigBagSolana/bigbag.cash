import { NextResponse } from "next/server"
import { getCurrentGame } from "@/lib/redis"

export async function GET() {
  try {
    const currentGame = await getCurrentGame()

    if (!currentGame) {
      return NextResponse.json({ winner: null })
    }

    // Check if there's a winner stored in the game state
    // We'll add a winner field to GameState
    const winner = (currentGame as any).winner || null

    return NextResponse.json({ winner })
  } catch (error) {
    console.error("Error fetching current winner:", error)
    return NextResponse.json({ error: "Failed to fetch winner" }, { status: 500 })
  }
}
