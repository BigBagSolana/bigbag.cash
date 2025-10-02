import { Redis } from "@upstash/redis"

// Initialize Redis client
export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

// Types
export interface Participant {
  walletAddress: string
  ticketCount: number
  transactionSignature: string
  timestamp: number
}

export interface GameState {
  id: string
  status: "idle" | "starting" | "active" | "selecting_winner" | "completed"
  title?: string
  description?: string
  startTime?: number
  endTime?: number
  participants: Participant[]
  snapshotUrl?: string
  totalTickets: number
  prizePool: number
  winner?: {
    walletAddress: string
    ticketCount: number
    prizeAmount: number
  }
}

export interface Winner {
  gameId: string
  title?: string
  description?: string
  walletAddress: string
  ticketCount: number
  prizeAmount: number
  timestamp: number
  snapshotUrl?: string
}

// Redis keys
const KEYS = {
  currentGame: "game:current",
  gameHistory: "game:history",
  winners: "winners:list",
  participants: (gameId: string) => `game:${gameId}:participants`,
}

// Game operations
export async function getCurrentGame(): Promise<GameState | null> {
  return await redis.get<GameState>(KEYS.currentGame)
}

export async function createNewGame(): Promise<GameState> {
  const gameId = `game_${Date.now()}`
  const newGame: GameState = {
    id: gameId,
    status: "idle",
    participants: [],
    totalTickets: 0,
    prizePool: 0,
  }
  await redis.set(KEYS.currentGame, newGame)
  return newGame
}

export async function updateGameState(updates: Partial<GameState>): Promise<GameState> {
  const currentGame = await getCurrentGame()
  if (!currentGame) {
    throw new Error("No active game found")
  }
  const updatedGame = { ...currentGame, ...updates }
  await redis.set(KEYS.currentGame, updatedGame)
  return updatedGame
}

export async function addParticipant(participant: Participant): Promise<void> {
  const currentGame = await getCurrentGame()
  if (!currentGame) {
    throw new Error("No active game found")
  }

  const updatedParticipants = [...currentGame.participants, participant]
  await updateGameState({
    participants: updatedParticipants,
    totalTickets: currentGame.totalTickets + participant.ticketCount,
    prizePool: currentGame.prizePool + participant.ticketCount * 0.1,
  })
}

export async function saveWinner(winner: Winner): Promise<void> {
  try {
    const winnerString = JSON.stringify(winner)
    const result = await redis.lpush(KEYS.winners, winnerString)

    const verification = await redis.lrange(KEYS.winners, 0, 0)

    if (!verification || verification.length === 0) {
      throw new Error("Winner was not saved - verification failed")
    }

    // Archive current game
    const currentGame = await getCurrentGame()
    if (currentGame) {
      await redis.lpush(KEYS.gameHistory, JSON.stringify(currentGame))
    }
  } catch (error) {
    console.error("Error saving winner:", error)
    throw error
  }
}

export async function getWinners(limit = 10): Promise<Winner[]> {
  try {
    const winners = await redis.lrange(KEYS.winners, 0, limit - 1)

    if (!winners) {
      return []
    }

    if (!Array.isArray(winners)) {
      return []
    }

    if (winners.length === 0) {
      return []
    }

    const parsedWinners = winners
      .map((w, index) => {
        try {
          if (typeof w === "string") {
            return JSON.parse(w) as Winner
          }
          return w as Winner
        } catch (parseError) {
          console.error(`Error parsing winner at index ${index}:`, parseError)
          return null
        }
      })
      .filter((w): w is Winner => w !== null)

    return parsedWinners
  } catch (error) {
    console.error("Error fetching winners:", error)
    return []
  }
}

export async function selectRandomWinner(participants: Participant[]): Promise<Participant> {
  if (!participants || participants.length === 0) {
    throw new Error("No participants to select from")
  }

  // Create weighted array based on ticket count
  const weightedParticipants: Participant[] = []
  participants.forEach((participant) => {
    for (let i = 0; i < participant.ticketCount; i++) {
      weightedParticipants.push(participant)
    }
  })

  if (weightedParticipants.length === 0) {
    throw new Error("No weighted participants (all have 0 tickets)")
  }

  // Select random winner
  const randomIndex = Math.floor(Math.random() * weightedParticipants.length)
  const winner = weightedParticipants[randomIndex]

  if (!winner || !winner.walletAddress) {
    throw new Error("Failed to select valid winner")
  }

  // Update current game state with the selected winner
  const currentGame = await getCurrentGame()
  if (currentGame) {
    await updateGameState({
      winner: {
        walletAddress: winner.walletAddress,
        ticketCount: winner.ticketCount,
        prizeAmount: currentGame.prizePool,
      },
    })
  }

  return winner
}

export async function clearAllWinners(): Promise<void> {
  try {
    await redis.del(KEYS.winners)
  } catch (error) {
    console.error("Error clearing winners:", error)
    throw error
  }
}
