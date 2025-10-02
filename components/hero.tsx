"use client"

import { Button } from "@/components/ui/button"
import { Lock, Smartphone, Laptop, Car, Sparkles } from "lucide-react"

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="mb-6 text-sm tracking-widest text-primary uppercase font-medium">Solana Memecoin Raffle</p>
            <h1 className="mb-8 text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-none text-balance">
              Your bag,
              <br />
              <span className="text-primary">your chance.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Hold tokens, get entries. AI-powered draws. Instant SOL rewards. The fairest way to win in crypto.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 h-12"
              asChild
            >
              <a href="https://pump.fun/coin" target="_blank" rel="noopener noreferrer">
                Buy Tickets
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border hover:bg-card text-foreground font-medium px-8 h-12 bg-transparent"
              asChild
            >
              <a href="/how-it-works">Learn More</a>
            </Button>
          </div>

          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Volume Milestones</h2>
              <p className="text-muted-foreground">Unlock exclusive prizes as trading volume grows</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Milestone 1: $200k Volume */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-primary/30 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300" />
                <div className="relative bg-card border border-primary/20 rounded-xl p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-xs font-bold text-primary uppercase tracking-wider">Level 1</div>
                  </div>

                  <div className="mb-4">
                    <div className="text-3xl font-bold text-primary mb-1">$200K</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Trading Volume</div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-border/50">
                    <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Grand Prize</div>
                    <div className="text-lg font-bold">iPhone 17 Pro Max</div>
                    <div className="text-xs text-muted-foreground mt-1">1 Winner</div>
                  </div>
                </div>
              </div>

              {/* Milestone 2: $1M Volume */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/60 to-primary/40 rounded-xl blur opacity-40 group-hover:opacity-70 transition duration-300" />
                <div className="relative bg-card border border-primary/30 rounded-xl p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center">
                      <Laptop className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-xs font-bold text-primary uppercase tracking-wider">Level 2</div>
                  </div>

                  <div className="mb-4">
                    <div className="text-3xl font-bold text-primary mb-1">$1M</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Trading Volume</div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-border/50">
                    <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Grand Prize</div>
                    <div className="text-lg font-bold">MacBook Pro 14" M4</div>
                    <div className="text-xs text-muted-foreground mt-1">3 Winners</div>
                  </div>
                </div>
              </div>

              {/* Milestone 3: $5M Volume */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/70 to-primary/50 rounded-xl blur-sm opacity-50 group-hover:opacity-80 transition duration-300" />
                <div className="relative bg-card border border-primary/40 rounded-xl p-6 h-full flex flex-col backdrop-blur-[0.5px] group-hover:backdrop-blur-0 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Car className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-xs font-bold text-primary uppercase tracking-wider">Level 3</div>
                  </div>

                  <div className="mb-4">
                    <div className="text-3xl font-bold text-primary mb-1">$5M</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Trading Volume</div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-border/50">
                    <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Grand Prize</div>
                    <div className="text-lg font-bold">Car</div>
                    <div className="text-xs text-muted-foreground mt-1">Based on creator rewards</div>
                  </div>
                </div>
              </div>

              {/* Milestone 4: $5M+ Volume - Mystery */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-primary/60 to-primary/40 rounded-xl blur-md opacity-60 group-hover:opacity-90 transition duration-300 animate-pulse" />
                <div className="relative bg-gradient-to-br from-card/80 to-card/40 border border-primary/60 rounded-xl p-6 h-full flex flex-col backdrop-blur-[2px] group-hover:backdrop-blur-[1px] transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/30 flex items-center justify-center">
                      <Lock className="w-6 h-6 text-primary animate-pulse" />
                    </div>
                    <div className="text-xs font-bold text-primary uppercase tracking-wider">Level 4</div>
                  </div>

                  <div className="mb-4">
                    <div className="text-3xl font-bold text-primary mb-1">$5M+</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Trading Volume</div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">Mystery Tier</div>
                    </div>
                    <div className="text-lg font-bold text-primary/70">???</div>
                    <div className="text-xs text-muted-foreground mt-1">Exclusive rewards await</div>
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
