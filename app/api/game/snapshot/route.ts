import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"

export async function POST(request: Request) {
  try {
    const { participants } = await request.json()

    if (!participants || participants.length === 0) {
      return NextResponse.json({ error: "No participants provided" }, { status: 400 })
    }

    const timestamp = Date.now()
    const snapshotId = `snapshot_${timestamp}`

    // Store snapshot data in Redis
    await redis.set(
      `snapshot:${snapshotId}`,
      JSON.stringify({
        participants,
        timestamp,
        totalTickets: participants.reduce((sum: number, p: any) => sum + p.ticketCount, 0),
      }),
      { ex: 60 * 60 * 24 * 30 }, // Expire after 30 days
    )

    return NextResponse.json({ snapshotId })
  } catch (error) {
    console.error("Error creating snapshot:", error)
    return NextResponse.json({ error: "Failed to create snapshot" }, { status: 500 })
  }
}
