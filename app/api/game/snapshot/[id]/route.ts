import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const snapshotId = params.id

    if (!snapshotId) {
      return NextResponse.json({ error: "Snapshot ID required" }, { status: 400 })
    }

    const snapshotData = await redis.get(`snapshot:${snapshotId}`)

    if (!snapshotData) {
      return NextResponse.json({ error: "Snapshot not found" }, { status: 404 })
    }

    const snapshot = typeof snapshotData === "string" ? JSON.parse(snapshotData) : snapshotData

    return NextResponse.json(snapshot)
  } catch (error) {
    console.error("Error retrieving snapshot:", error)
    return NextResponse.json({ error: "Failed to retrieve snapshot" }, { status: 500 })
  }
}
