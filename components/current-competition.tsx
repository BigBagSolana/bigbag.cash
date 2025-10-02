"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trophy, Clock, Users, Calculator, ExternalLink } from "lucide-react"
import type { GameState } from "@/lib/redis"

export function CurrentCompetition() {
  const [tokenAmount, setTokenAmount] = useState("")
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGameState()
    // Poll for updates every 10 seconds
    const interval = setInterval(loadGameState, 10000)
    return () => clearInterval(interval)
  }, [])

  const loadGameState = async () => {
    try {
      const response = await fetch("/api/game/state")
      const data = await response.json()
      setGameState(data.game)
    } catch (error) {
      console.error("Error loading game state:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateEntries = (amount: string) => {
    const tokens = Number.parseFloat(amount) || 0
    return Math.floor(tokens / 50000)
  }

  if (loading) {
    return (
      <section id="competition" className="py-20 sm:py-28 border-t border-border">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading current draw...</p>
          </div>
        </div>
      </section>
    )
  }

  if (!gameState || gameState.status === "idle") {
    return (
      <section id="competition" className="py-20 sm:py-28 border-t border-border">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="mx-auto max-w-2xl mb-16">
            <p className="mb-4 text-sm tracking-widest text-primary uppercase font-medium">Coming Soon</p>
            <h2 className="mb-6 text-4xl font-bold sm:text-5xl text-balance">Next Draw</h2>
            <p className="text-lg text-muted-foreground text-balance">
              No active draw at the moment. Check back soon for the next prize!
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="competition" className="py-20 sm:py-28 border-t border-border">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-2xl mb-16">
          <p className="mb-4 text-sm tracking-widest text-primary uppercase font-medium">Active Now</p>
          <h2 className="mb-6 text-4xl font-bold sm:text-5xl text-balance">Current Draw</h2>
          <p className="text-lg text-muted-foreground text-balance">Join the current raffle and win SOL prizes</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 max-w-6xl mx-auto">
          <div className="border border-border bg-card p-8">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center border border-primary/20 bg-primary/5">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">Current Prize</div>
                <div className="text-2xl font-bold">{gameState.title || "Prize Draw"}</div>
              </div>
            </div>

            {gameState.description && (
              <p className="text-muted-foreground mb-6 leading-relaxed">{gameState.description}</p>
            )}

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between border border-primary/20 bg-primary/5 p-6">
                <span className="text-sm text-muted-foreground uppercase tracking-wide">Prize Pool</span>
                <span className="font-mono text-2xl font-bold text-primary">{gameState.prizePool.toFixed(2)} SOL</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="border border-border p-6">
                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide">
                  <Users className="h-4 w-4" />
                  Participants
                </div>
                <div className="font-mono text-2xl font-bold">{gameState.participants.length}</div>
              </div>
              <div className="border border-border p-6">
                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide">
                  <Clock className="h-4 w-4" />
                  Status
                </div>
                <div className="text-lg font-bold capitalize">{gameState.status}</div>
              </div>
            </div>

            <Button
              className="w-full gap-2 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              size="lg"
              asChild
            >
              <a
                href="https://pump.fun/coin/XEuMPGB4bupbgrM9kXJo1wb11DKKZo1JJf8QPpYpump"
                target="_blank"
                rel="noopener noreferrer"
              >
                Buy on Pump.fun
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>

          <div className="border border-border bg-card p-8">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center border border-primary/20 bg-primary/5">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">Entry Calculator</div>
                <div className="text-sm text-muted-foreground">Calculate your chances</div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="tokens" className="text-sm uppercase tracking-wide">
                  Token Amount
                </Label>
                <Input
                  id="tokens"
                  type="number"
                  placeholder="Enter token amount"
                  value={tokenAmount}
                  onChange={(e) => setTokenAmount(e.target.value)}
                  className="h-12 font-mono border-border bg-background"
                />
              </div>

              <div className="border border-primary/20 bg-primary/5 p-8">
                <div className="mb-2 text-sm text-muted-foreground uppercase tracking-wide">Your Entries</div>
                <div className="mb-2 font-mono text-5xl font-bold text-primary">{calculateEntries(tokenAmount)}</div>
                <div className="text-sm text-muted-foreground">Every 50,000 tokens = 1 entry</div>
              </div>

              <div className="space-y-3 border border-border p-6">
                <div className="text-xs font-bold uppercase tracking-wider mb-4">Examples</div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">50,000 tokens</span>
                    <span className="font-mono font-bold">1 entry</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">200,000 tokens</span>
                    <span className="font-mono font-bold">4 entries</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">1,000,000 tokens</span>
                    <span className="font-mono font-bold">20 entries</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
