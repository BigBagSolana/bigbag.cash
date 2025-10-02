import { Coins, Camera, Sparkles, Wallet } from "lucide-react"

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

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 border-t border-border">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-2xl mb-16">
          <p className="mb-4 text-sm tracking-widest text-primary uppercase font-medium">Simple Process</p>
          <h2 className="mb-6 text-4xl font-bold sm:text-5xl text-balance">How It Works</h2>
          <p className="text-lg text-muted-foreground text-balance">
            Simple, transparent, and fair. Here's how our raffle system works.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
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
      </div>
    </section>
  )
}
