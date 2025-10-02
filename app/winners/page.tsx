import { Header } from "@/components/header"
import { PastWinners } from "@/components/past-winners"
import { Footer } from "@/components/footer"

export default function WinnersPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-16">
        <PastWinners />
      </div>
      <Footer />
    </main>
  )
}
