import { NextResponse } from "next/server"
import { getCurrentGame, createNewGame } from "@/lib/redis"

export async function GET() {
  try {
    let game = await getCurrentGame()

    // Create new game if none exists
    if (!game) {
      console.log("[v0] No game found, creating new game")
      game = await createNewGame()
      console.log("[v0] New game created:", game)
    }

    return NextResponse.json({ game })
  } catch (error) {
    console.error("[v0] Error getting game state:", error)
    return NextResponse.json(
      {
        error: "Failed to get game state",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
