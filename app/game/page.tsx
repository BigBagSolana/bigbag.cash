"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Trophy, Sparkles, Users, Ticket, Coins, Clock, Zap } from "lucide-react"
import type { GameState } from "@/lib/redis"
import { Header } from "@/components/header"

interface PastWinner {
  prize: string
  winner: string
  globalPrice: number
  solAmount: number
  date: string
  txId?: string
  snapshotLink?: string
  timestamp: number
  prizeAmount?: number
}

export default function GamePage() {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [animationPhase, setAnimationPhase] = useState<"fast" | "medium" | "slow" | "stopped">("fast")
  const [winner, setWinner] = useState<{ walletAddress: string; ticketCount: number; prizeAmount: number } | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [winnerRevealTime, setWinnerRevealTime] = useState<number | null>(null)
  const [celebrationCountdown, setCelebrationCountdown] = useState<number>(60)
  const [pastWinners, setPastWinners] = useState<PastWinner[]>([])
  const animationRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    loadGameState()
    loadPastWinners()
    const interval = setInterval(() => {
      loadGameState()
      loadPastWinners()
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (winnerRevealTime) {
      const countdownInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - winnerRevealTime) / 1000)
        const remaining = Math.max(0, 60 - elapsed)
        setCelebrationCountdown(remaining)

        if (remaining === 0) {
          setWinnerRevealTime(null)
          setWinner(null)
          setShowConfetti(false)
        }
      }, 1000)

      return () => clearInterval(countdownInterval)
    }
  }, [winnerRevealTime])

  useEffect(() => {
    if (gameState?.status === "selecting_winner" && !isAnimating) {
      startAnimation()
    }
  }, [gameState?.status, isAnimating])

  const loadGameState = async () => {
    try {
      const response = await fetch("/api/game/state")
      const data = await response.json()
      setGameState(data.game)
    } catch (error) {
      console.error("Error loading game state:", error)
    }
  }

  const loadPastWinners = async () => {
    try {
      const response = await fetch("/api/game/winners")
      const data = await response.json()
      if (data.winners && Array.isArray(data.winners)) {
        setPastWinners(data.winners)
      }
    } catch (error) {
      console.error("Error loading past winners:", error)
    }
  }

  const startAnimation = () => {
    if (!gameState?.participants || gameState.participants.length === 0) {
      return
    }

    setIsAnimating(true)
    setCurrentIndex(0)
    setAnimationPhase("fast")
    setWinner(null)
    setShowConfetti(false)
    setWinnerRevealTime(null)

    let index = 0
    let phase: "fast" | "medium" | "slow" | "stopped" = "fast"
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime

      if (elapsed < 5000) {
        phase = "fast"
      } else if (elapsed < 15000) {
        phase = "medium"
      } else if (elapsed < 25000) {
        phase = "slow"
      } else {
        phase = "stopped"
      }

      setAnimationPhase(phase)

      if (phase === "stopped") {
        if (animationRef.current) {
          clearTimeout(animationRef.current)
        }
        selectFinalWinner()
        return
      }

      index = (index + 1) % gameState.participants.length
      setCurrentIndex(index)

      let delay = 50
      if (phase === "fast") delay = 50
      else if (phase === "medium") delay = 150
      else if (phase === "slow") delay = 400

      animationRef.current = setTimeout(animate, delay)
    }

    animate()
  }

  const selectFinalWinner = async () => {
    try {
      const response = await fetch("/api/game/current-winner")
      const data = await response.json()

      if (data.winner) {
        setWinner(data.winner)
        setShowConfetti(true)
        setWinnerRevealTime(Date.now())
        setCelebrationCountdown(60)

        const winnerIndex = gameState?.participants.findIndex((p) => p.walletAddress === data.winner.walletAddress)
        if (winnerIndex !== undefined && winnerIndex !== -1) {
          setCurrentIndex(winnerIndex)
        }
      }
    } catch (error) {
      console.error("Error fetching winner:", error)
    } finally {
      setIsAnimating(false)
    }
  }

  if (winner && winnerRevealTime) {
    return (
      <div className="min-h-screen bg-black text-white overflow-hidden relative">
        <Header />
        <ParticleBackground />

        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-lime-400/20 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-green-400/10 rounded-full blur-[120px]" />
        </div>

        {showConfetti && <EnhancedConfetti />}

        <div className="relative z-50 min-h-screen flex items-center justify-center p-4 pt-24">
          <div className="text-center max-w-5xl w-full">
            <div className="mb-8 inline-flex items-center gap-3 glass-card px-8 py-4 rounded-full animate-float">
              <Clock className="w-6 h-6 text-lime-400 animate-pulse" />
              <span className="text-white/90 text-lg font-bold">
                Celebration ends in <span className="text-lime-400 text-2xl mx-2">{celebrationCountdown}s</span>
              </span>
            </div>

            <div className="relative inline-block mb-12">
              <div className="absolute inset-0 bg-lime-400/40 blur-[100px] rounded-full animate-pulse" />
              <div className="relative">
                <Trophy className="w-40 h-40 sm:w-56 sm:h-56 text-lime-400 animate-float drop-shadow-[0_0_50px_rgba(163,230,53,1)]" />
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-7xl sm:text-9xl font-black mb-4 bg-gradient-to-r from-lime-300 via-lime-400 to-green-400 bg-clip-text text-transparent animate-pulse leading-none tracking-tight">
                WINNER!
              </h2>
              <div className="flex items-center justify-center gap-3">
                <Sparkles className="w-8 h-8 text-lime-400 animate-spin" />
                <p className="text-2xl sm:text-3xl font-bold text-white/80">Congratulations!</p>
                <Sparkles className="w-8 h-8 text-lime-400 animate-spin" />
              </div>
            </div>

            <div className="relative group mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-lime-400/30 via-green-400/30 to-lime-400/30 rounded-3xl blur-3xl animate-pulse" />
              <div className="relative glass-card rounded-3xl p-8 sm:p-12 border-2 border-lime-400/50">
                <div className="flex items-center justify-center gap-3 mb-8">
                  <Zap className="w-7 h-7 text-lime-400" />
                  <p className="text-white/80 text-xl sm:text-2xl font-bold">Winning Wallet</p>
                  <Zap className="w-7 h-7 text-lime-400" />
                </div>

                <div className="bg-black/60 rounded-2xl p-4 sm:p-6 mb-8 border border-lime-400/30">
                  <p className="font-mono text-lg sm:text-2xl lg:text-4xl text-lime-400 break-all leading-relaxed font-bold">
                    {winner.walletAddress}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="glass-card rounded-2xl p-8 border border-white/20 hover:border-lime-400/50 transition-all">
                    <Ticket className="w-8 h-8 text-lime-400 mb-4 mx-auto" />
                    <p className="text-white/60 mb-3 text-base">Tickets Held</p>
                    <p className="text-5xl sm:text-6xl font-black text-lime-400">{winner.ticketCount}</p>
                  </div>
                  <div className="glass-card rounded-2xl p-8 border border-white/20 hover:border-lime-400/50 transition-all">
                    <Trophy className="w-8 h-8 text-lime-400 mb-4 mx-auto" />
                    <p className="text-white/60 mb-3 text-base">Prize Won</p>
                    <p className="text-5xl sm:text-6xl font-black text-lime-400">
                      {(winner.prizeAmount || 0).toFixed(2)}
                    </p>
                    <p className="text-white/60 text-xl mt-2">SOL</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!gameState || gameState.status === "idle") {
    return (
      <div className="min-h-screen bg-black text-white overflow-hidden relative">
        <Header />
        <ParticleBackground />

        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-lime-400/10 rounded-full blur-[120px] animate-pulse" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-8 pt-24">
          <div className="text-center max-w-3xl mx-auto mb-16 py-20">
            <div className="relative inline-block mb-12">
              <div className="absolute inset-0 bg-lime-400/30 blur-[80px] rounded-full animate-pulse" />
              <Trophy className="w-36 h-36 text-lime-400 relative animate-float drop-shadow-[0_0_40px_rgba(163,230,53,0.8)]" />
            </div>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-6 bg-gradient-to-r from-lime-300 via-lime-400 to-green-400 bg-clip-text text-transparent leading-tight">
              No Active Draw
            </h1>
            <p className="text-2xl text-white/70 leading-relaxed font-medium">
              The next exciting draw will begin soon. Stay tuned for your chance to win big!
            </p>
          </div>

          {pastWinners.length > 0 && (
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-lime-400 to-green-400 bg-clip-text text-transparent inline-block">
                  Recent Winners
                </h2>
              </div>
              <div className="grid gap-4">
                {pastWinners.slice(0, 10).map((pastWinner, index) => (
                  <div key={index} className="glass-card-hover rounded-2xl p-6 sm:p-8 group">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <div className="absolute inset-0 bg-lime-400/20 blur-xl rounded-full" />
                          <Trophy className="w-12 h-12 text-lime-400 relative" />
                        </div>
                        <div>
                          <p className="font-mono text-xl text-white font-bold mb-2">{pastWinner.winner}</p>
                          <p className="text-white/50 text-base">{pastWinner.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white/60 text-sm mb-2">Prize</p>
                        <p className="text-4xl font-black text-lime-400">
                          {(pastWinner.prizeAmount || pastWinner.solAmount || 0).toFixed(2)}
                        </p>
                        <p className="text-white/60 text-lg mt-1">SOL</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const participants = gameState.participants || []
  const gridCols = Math.min(Math.ceil(Math.sqrt(participants.length)), 8)
  const MAX_DISPLAYED_PARTICIPANTS = 100
  const displayedParticipants = participants.slice(0, MAX_DISPLAYED_PARTICIPANTS)
  const hasMoreParticipants = participants.length > MAX_DISPLAYED_PARTICIPANTS

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <Header />
      <ParticleBackground />

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-lime-400/10 rounded-full blur-[150px] animate-pulse" />
      </div>

      <div className="relative z-10 p-4 sm:p-8 pt-24">
        <div className="max-w-7xl mx-auto mb-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-4 mb-8 px-8 py-4 glass-card rounded-full animate-pulse-glow">
              <Sparkles className="w-6 h-6 text-lime-400 animate-spin" />
              <span className="text-lime-400 font-black text-lg tracking-wider">LIVE DRAW IN PROGRESS</span>
              <Sparkles className="w-6 h-6 text-lime-400 animate-spin" />
            </div>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black mb-6 bg-gradient-to-r from-lime-300 via-lime-400 to-green-400 bg-clip-text text-transparent leading-tight">
              {gameState.title || "$BigBag Token Raffle"}
            </h1>
            <p className="text-white/80 text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed font-medium">
              {gameState.description || "Watch as we select our lucky winner live!"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all" />
              <div className="relative glass-card-hover p-8 rounded-3xl">
                <div className="flex items-center gap-4 mb-4">
                  <Users className="w-8 h-8 text-purple-400" />
                  <p className="text-white/70 text-base font-bold">Participants</p>
                </div>
                <p className="text-6xl font-black text-white">{participants.length}</p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all" />
              <div className="relative glass-card-hover p-8 rounded-3xl">
                <div className="flex items-center gap-4 mb-4">
                  <Ticket className="w-8 h-8 text-blue-400" />
                  <p className="text-white/70 text-base font-bold">Total Tickets</p>
                </div>
                <p className="text-6xl font-black text-white">{gameState.totalTickets}</p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-lime-500/20 to-green-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all" />
              <div className="relative glass-card-hover p-8 rounded-3xl">
                <div className="flex items-center gap-4 mb-4">
                  <Coins className="w-8 h-8 text-lime-400" />
                  <p className="text-white/70 text-base font-bold">Prize Pool</p>
                </div>
                <p className="text-6xl font-black text-lime-400">{(gameState.prizePool || 0).toFixed(2)}</p>
                <p className="text-white/60 text-xl mt-2">SOL</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {participants.length > 0 ? (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 glass-card px-6 py-3 rounded-full">
                  <Users className="w-5 h-5 text-lime-400" />
                  <span className="text-white/90 font-bold">
                    {hasMoreParticipants
                      ? `Showing ${MAX_DISPLAYED_PARTICIPANTS} of ${participants.length} participants`
                      : `${participants.length} participant${participants.length !== 1 ? "s" : ""}`}
                  </span>
                </div>
                {hasMoreParticipants && (
                  <p className="text-white/60 text-sm mt-3">
                    All participants are included in the draw. Visit the winners page after the draw to see the complete
                    list.
                  </p>
                )}
              </div>

              <div
                className="grid gap-3 mb-12"
                style={{
                  gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
                }}
              >
                {displayedParticipants.map((participant, index) => {
                  const isActive = index === currentIndex
                  const isWinner = winner?.walletAddress === participant.walletAddress

                  return (
                    <div
                      key={index}
                      className={`
                        relative rounded-2xl transition-all duration-300 overflow-hidden
                        ${
                          isWinner
                            ? "border-2 border-lime-400 bg-gradient-to-br from-lime-400/40 to-green-400/40 shadow-[0_0_60px_rgba(163,230,53,0.8)] scale-110 z-20"
                            : isActive && isAnimating
                              ? "border-2 border-purple-400 bg-gradient-to-br from-purple-400/30 to-pink-400/30 shadow-[0_0_40px_rgba(192,132,252,0.6)] scale-105"
                              : "border border-white/10 glass-card hover:border-white/30"
                        }
                      `}
                    >
                      {isActive && isAnimating && (
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/30 animate-pulse" />
                      )}

                      {isWinner && (
                        <div className="absolute inset-0 bg-gradient-to-r from-lime-400/40 via-green-400/40 to-lime-400/40 animate-pulse" />
                      )}

                      <div className="relative p-4 sm:p-5">
                        <div
                          className={`absolute -top-2 -right-2 text-sm font-black px-3 py-1.5 rounded-full shadow-lg ${
                            isWinner
                              ? "bg-lime-400 text-black"
                              : isActive && isAnimating
                                ? "bg-purple-400 text-black"
                                : "bg-white/10 text-white"
                          }`}
                        >
                          {participant.ticketCount}x
                        </div>

                        <p className="font-mono text-sm sm:text-base break-all text-white font-bold">
                          {participant.walletAddress.slice(0, 4)}...{participant.walletAddress.slice(-4)}
                        </p>

                        {isWinner && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Trophy className="w-10 h-10 sm:w-14 sm:h-14 text-lime-400 animate-bounce drop-shadow-[0_0_20px_rgba(163,230,53,1)]" />
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-white/40 text-xl">No participants yet</p>
            </div>
          )}

          {isAnimating && !winner && (
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-6 glass-card px-10 py-6 rounded-full backdrop-blur-xl border-2 border-purple-400/30 animate-pulse-glow">
                <div className="relative">
                  <div className="w-5 h-5 bg-purple-400 rounded-full animate-ping absolute" />
                  <div className="w-5 h-5 bg-purple-400 rounded-full relative" />
                </div>
                <p className="text-2xl font-black text-white">
                  {animationPhase === "fast" && "Scanning all participants..."}
                  {animationPhase === "medium" && "Narrowing down the selection..."}
                  {animationPhase === "slow" && "Almost there... selecting winner..."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ParticleBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-lime-400/30 rounded-full animate-particle"
          style={
            {
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              "--tx": `${(Math.random() - 0.5) * 200}px`,
              "--ty": `${(Math.random() - 0.5) * 200}px`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

function EnhancedConfetti() {
  const colors = ["#a3e635", "#84cc16", "#65a30d", "#4ade80", "#22c55e", "#10b981", "#fbbf24", "#f59e0b"]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
      {Array.from({ length: 150 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-fall"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${Math.random() * 20}%`,
            width: `${Math.random() * 12 + 6}px`,
            height: `${Math.random() * 12 + 6}px`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            borderRadius: Math.random() > 0.5 ? "50%" : "0%",
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
            opacity: Math.random() * 0.8 + 0.2,
            boxShadow: `0 0 10px ${colors[Math.floor(Math.random() * colors.length)]}`,
          }}
        />
      ))}
    </div>
  )
}
