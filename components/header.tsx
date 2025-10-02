"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { useState } from "react"

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const handleCompetitionClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    // If we're not on the homepage, navigate there first
    if (pathname !== "/") {
      router.push("/#competition")
      // Wait for navigation, then scroll
      setTimeout(() => {
        const element = document.getElementById("competition")
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 100)
    } else {
      // If we're already on homepage, just scroll
      const element = document.getElementById("competition")
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">
              <span className="text-foreground">Big</span>
              <span className="text-primary">Bag</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
            <Link href="/winners" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Past Winners
            </Link>
            <Link href="/game" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Game
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 md:px-6 h-9 text-sm"
            >
              <a href="https://pump.fun/coin/" target="_blank" rel="noopener noreferrer">
                Buy $BigBag
              </a>
            </Button>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-6 mt-8">
                  <Link
                    href="/how-it-works"
                    className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    How It Works
                  </Link>
                  <Link
                    href="/winners"
                    className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    Past Winners
                  </Link>
                  <Link
                    href="/game"
                    className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    Game
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
