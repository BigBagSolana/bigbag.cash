import { NextResponse } from "next/server"
import { getWinners } from "@/lib/redis"

export async function GET() {
  try {
    const winnersData = await getWinners(20)

    if (!winnersData || !Array.isArray(winnersData) || winnersData.length === 0) {
      return NextResponse.json({ winners: [] })
    }

    const formattedWinners = winnersData
      .map((winner, index) => {
        try {
          if (!winner || !winner.walletAddress) {
            return null
          }

          return {
            prize: winner.title || "Token Raffle",
            winner: `${winner.walletAddress.slice(0, 4)}...${winner.walletAddress.slice(-4)}`,
            globalPrice: 0,
            solAmount: winner.prizeAmount || 0,
            date: new Date(winner.timestamp).toLocaleDateString(),
            txId: undefined,
            snapshotLink: winner.snapshotUrl,
            timestamp: winner.timestamp,
          }
        } catch (error) {
          console.error(`Error formatting winner at index ${index}:`, error)
          return null
        }
      })
      .filter((w) => w !== null)

    return NextResponse.json({ winners: formattedWinners })
  } catch (error) {
    console.error("Error in winners API:", error)
    return NextResponse.json({ error: "Failed to get winners", winners: [] }, { status: 500 })
  }
}
