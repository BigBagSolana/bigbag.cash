import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Coins, Camera, Sparkles, Wallet, Trophy, Shield, Clock, Users } from "lucide-react"

const steps = [
  {
    icon: Coins,
    title: "Hold Tokens",
    description: "Every 50,000 tokens in your wallet equals one raffle entry. More tokens = more chances to win.",
  },
  {
    icon: Camera,
    title: "Snapshot Taken",
    description: "At a specific time, we capture all holder balances and calculate entries automatically.",
  },
  {
    icon: Sparkles,
    title: "AI Selection",
    description: "Our AI-powered pointer selects the winner in a transparent, animated draw everyone can watch.",
  },
  {
    icon: Wallet,
    title: "Instant SOL Reward",
    description: "Prize value converted to SOL at current rates and sent directly to winner's wallet.",
  },
]

const features = [
  {
    icon: Trophy,
    title: "Fair & Transparent",
    description: "Every holder with 50k+ tokens gets automatic entries. No manual registration needed.",
  },
  {
    icon: Shield,
    title: "Provably Fair",
    description: "All snapshots are recorded on-chain. Winner selection is verifiable and transparent.",
  },
  {
    icon: Clock,
    title: "Regular Draws",
    description: "New prizes and draws happen regularly. Keep holding to participate in every draw.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "The more tokens you hold, the better your chances. Support the project and win big.",
  },
]

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <div className="pt-24 pb-20 sm:pt-32 sm:pb-28">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <p className="mb-4 text-sm tracking-widest text-primary uppercase font-medium">Simple Process</p>
            <h1 className="mb-6 text-5xl font-bold sm:text-6xl text-balance">How It Works</h1>
            <p className="text-xl text-muted-foreground text-balance">
              Simple, transparent, and fair. Here's how our raffle system works from start to finish.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-4 mb-20">
            {steps.map((step, index) => (
              <div key={index} className="bg-background p-8 border border-border hover:bg-card transition-colors">
                <div className="mb-6">
                  <div className="flex h-12 w-12 items-center justify-center border border-primary/20 bg-primary/5">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="mb-3 text-xs font-mono text-primary uppercase tracking-wider">Step {index + 1}</div>
                <h3 className="mb-4 text-xl font-bold text-balance">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground text-balance">{step.description}</p>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="mb-6 text-4xl font-bold text-balance">Why BigBag Raffle?</h2>
            <p className="text-lg text-muted-foreground text-balance">
              Built on Solana for speed, transparency, and fairness.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 max-w-5xl mx-auto mb-20">
            {features.map((feature, index) => (
              <div key={index} className="border border-border bg-card p-8">
                <div className="mb-6">
                  <div className="flex h-12 w-12 items-center justify-center border border-primary/20 bg-primary/5">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="mb-4 text-xl font-bold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-12 text-4xl font-bold text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="border border-border bg-card p-8">
                <h3 className="text-xl font-bold mb-3">How do I participate?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Simply hold 50,000 or more $BigBag tokens in your wallet. You'll automatically be entered into every
                  draw. No registration needed.
                </p>
              </div>
              <div className="border border-border bg-card p-8">
                <h3 className="text-xl font-bold mb-3">How are winners selected?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We take a snapshot of all token holders, calculate entries (1 per 50k tokens), and use a weighted
                  random selection. The top holder (liquidity pool) is automatically excluded.
                </p>
              </div>
              <div className="border border-border bg-card p-8">
                <h3 className="text-xl font-bold mb-3">When do I receive my prize?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Winners receive their SOL prize directly to their wallet instantly after the draw. All transactions
                  are recorded on-chain.
                </p>
              </div>
              <div className="border border-border bg-card p-8">
                <h3 className="text-xl font-bold mb-3">Can I increase my chances?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Yes! The more tokens you hold, the more entries you get. For example, 200k tokens = 4 entries, 1M
                  tokens = 20 entries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
