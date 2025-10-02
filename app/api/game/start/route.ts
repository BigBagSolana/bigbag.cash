import { NextResponse } from "next/server"
import { updateGameState, getCurrentGame } from "@/lib/redis"
import { getTokenHoldersViaHelius } from "@/lib/helius"

export async function POST(request: Request) {
  try {
    const { title, description, prizePool } = await request.json()

    const currentGame = await getCurrentGame()
    if (!currentGame) {
      return NextResponse.json({ error: "No game found" }, { status: 404 })
    }

    const holders = await getTokenHoldersViaHelius()

    if (holders.length === 0) {
      return NextResponse.json({ error: "No eligible holders found" }, { status: 400 })
    }

    const sortedHolders = [...holders].sort((a, b) => b.ticketCount - a.ticketCount)
    const topHolder = sortedHolders[0]
    const eligibleHolders = sortedHolders.slice(1) // Exclude holder #1

    if (eligibleHolders.length === 0) {
      return NextResponse.json({ error: "No eligible holders after excluding liquidity pool" }, { status: 400 })
    }

    const totalTickets = eligibleHolders.reduce((sum, holder) => sum + holder.ticketCount, 0)

    const snapshotResponse = await fetch(`${request.url.split("/start")[0]}/snapshot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participants: eligibleHolders }),
    })

    const { snapshotId } = await snapshotResponse.json()

    const snapshotUrl = `/game/snapshot/${snapshotId}`

    await updateGameState({
      status: "starting",
      title,
      description,
      snapshotUrl,
      participants: eligibleHolders.map((holder) => ({
        walletAddress: holder.walletAddress,
        ticketCount: holder.ticketCount,
        transactionSignature: "snapshot",
        timestamp: Date.now(),
      })),
      totalTickets,
      prizePool: Number(prizePool) || 0,
    })

    // Wait for animation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update to active status
    const updatedGame = await updateGameState({
      status: "active",
      startTime: Date.now(),
    })

    return NextResponse.json({
      game: updatedGame,
      holdersCount: eligibleHolders.length,
      totalTickets,
    })
  } catch (error) {
    console.error("Error starting game:", error)
    return NextResponse.json({ error: "Failed to start game" }, { status: 500 })
  }
}
