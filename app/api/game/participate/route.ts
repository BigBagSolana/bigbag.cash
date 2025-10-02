import { NextResponse } from "next/server"
import { addParticipant, getCurrentGame } from "@/lib/redis"

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(ip)

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 }) // 1 minute window
    return true
  }

  if (limit.count >= 5) {
    // Max 5 requests per minute
    return false
  }

  limit.count++
  return true
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    const { walletAddress, ticketCount, transactionSignature } = await request.json()

    if (!walletAddress || !ticketCount || !transactionSignature) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(walletAddress)) {
      return NextResponse.json({ error: "Invalid wallet address format" }, { status: 400 })
    }

    if (ticketCount < 1 || ticketCount > 10000) {
      return NextResponse.json({ error: "Invalid ticket count" }, { status: 400 })
    }

    // Verify the game is active
    const currentGame = await getCurrentGame()
    if (!currentGame || currentGame.status !== "active") {
      return NextResponse.json({ error: "No active game" }, { status: 400 })
    }

    // In production, verify the Solana transaction
    // const isValid = await verifyPayment(transactionSignature, ticketCount * 0.1, YOUR_WALLET_ADDRESS)
    // if (!isValid) {
    //   return NextResponse.json({ error: 'Invalid payment' }, { status: 400 })
    // }

    // Add participant
    await addParticipant({
      walletAddress,
      ticketCount,
      transactionSignature,
      timestamp: Date.now(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error adding participant:", error)
    return NextResponse.json({ error: "Failed to add participant" }, { status: 500 })
  }
}
