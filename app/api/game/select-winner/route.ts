import { NextResponse } from "next/server"
import { getCurrentGame, updateGameState, selectRandomWinner, saveWinner, createNewGame } from "@/lib/redis"

export async function POST() {
  try {
    const currentGame = await getCurrentGame()

    if (!currentGame || currentGame.status !== "active") {
      return NextResponse.json({ error: "No active game" }, { status: 400 })
    }

    if (currentGame.participants.length === 0) {
      return NextResponse.json({ error: "No participants" }, { status: 400 })
    }

    await updateGameState({ status: "selecting_winner" })

    await new Promise((resolve) => setTimeout(resolve, 28000))

    // Select random winner based on ticket weight
    const winner = await selectRandomWinner(currentGame.participants)

    if (!winner || !winner.walletAddress) {
      throw new Error("Invalid winner selected")
    }

    const winnerData = {
      gameId: currentGame.id,
      title: currentGame.title,
      description: currentGame.description,
      walletAddress: winner.walletAddress,
      ticketCount: winner.ticketCount,
      prizeAmount: currentGame.prizePool,
      timestamp: Date.now(),
      snapshotUrl: currentGame.snapshotUrl,
    }

    await saveWinner(winnerData)

    // Mark game as completed
    await updateGameState({
      status: "completed",
      endTime: Date.now(),
    })

    // Create new game for next round
    await createNewGame()

    const response = {
      winner: {
        walletAddress: winner.walletAddress,
        prizeAmount: currentGame.prizePool,
        ticketCount: winner.ticketCount,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error selecting winner:", error)
    return NextResponse.json({ error: "Failed to select winner" }, { status: 500 })
  }
}
