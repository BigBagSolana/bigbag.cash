"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Trophy, Users } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

interface Winner {
  prize: string
  winner: string
  globalPrice: number
  solAmount: number
  date: string
  txId?: string
  snapshotLink?: string
  timestamp: number
}

export function PastWinners() {
  const [winners, setWinners] = useState<Winner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const response = await fetch("/api/game/winners")
        const data = await response.json()
        setWinners(data.winners || [])
      } catch (error) {
        console.error("Error fetching winners:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWinners()
  }, [])

  return (
    <section id="winners" className="py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-4xl font-bold sm:text-5xl">Past Winners</h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Complete transparency. Every draw is recorded on-chain with verifiable results.
          </p>
        </div>

        {loading ? (
          <div className="mt-16 text-center">
            <p className="text-muted-foreground">Loading winners...</p>
          </div>
        ) : winners.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-muted-foreground">No winners yet. Be the first!</p>
          </div>
        ) : (
          <div className="mt-16 space-y-6 max-w-5xl mx-auto">
            {winners.map((winner, index) => (
              <Card
                key={winner.timestamp || index}
                className="border-border/50 bg-card/80 backdrop-blur-sm p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary/20">
                      <Trophy className="h-7 w-7 text-secondary" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold">{winner.prize}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="text-muted-foreground">Winner:</span>
                        <code className="rounded-xl bg-muted/50 px-3 py-1.5 font-mono text-foreground border border-border/50">
                          {winner.winner}
                        </code>
                        <Badge variant="outline" className="font-mono border-border/50 bg-background/50 rounded-full">
                          {winner.date}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center lg:flex-col lg:items-end">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-8 sm:justify-start lg:justify-end">
                        <span className="text-sm font-medium text-muted-foreground">Global Price:</span>
                        <span className="font-mono text-lg font-semibold">${winner.globalPrice}</span>
                      </div>
                      <div className="flex items-center justify-between gap-8 sm:justify-start lg:justify-end">
                        <span className="text-sm font-medium text-muted-foreground">Prize Sent:</span>
                        <span className="font-mono text-lg font-bold text-primary">{winner.solAmount} SOL</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {winner.snapshotLink && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 border-border/50 hover:border-primary/50 bg-transparent rounded-full"
                          asChild
                        >
                          <Link href={winner.snapshotLink}>
                            <Users className="h-3.5 w-3.5" />
                            View Participants
                          </Link>
                        </Button>
                      )}
                      {winner.txId && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 border-border/50 hover:border-primary/50 bg-transparent rounded-full"
                          onClick={() => window.open(`https://solscan.io/tx/${winner.txId}`, "_blank")}
                        >
                          TX
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
