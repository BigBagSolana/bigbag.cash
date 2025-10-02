"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Users, Ticket, Clock, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface Participant {
  walletAddress: string
  ticketCount: number
}

interface SnapshotData {
  participants: Participant[]
  timestamp: number
  totalTickets: number
}

const PARTICIPANTS_PER_PAGE = 50

export default function SnapshotPage() {
  const params = useParams()
  const [snapshot, setSnapshot] = useState<SnapshotData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    loadSnapshot()
  }, [params.id])

  const loadSnapshot = async () => {
    try {
      setLoading(true)
      const url = `/api/game/snapshot/${params.id}`

      const response = await fetch(url)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Snapshot not found")
      }

      const data = await response.json()
      setSnapshot(data)
    } catch (err) {
      console.error("Error loading snapshot:", err)
      setError(err instanceof Error ? err.message : "Failed to load snapshot")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lime-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading snapshot...</p>
        </div>
      </div>
    )
  }

  if (error || !snapshot) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold mb-4">Snapshot Not Found</h1>
          <p className="text-white/60 mb-8">{error || "This snapshot does not exist or has expired."}</p>
          <Link
            href="/game"
            className="inline-flex items-center gap-2 px-6 py-3 bg-lime-400 text-black font-bold rounded-lg hover:bg-lime-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Game
          </Link>
        </div>
      </div>
    )
  }

  const sortedParticipants = snapshot.participants.sort((a, b) => b.ticketCount - a.ticketCount)
  const totalPages = Math.ceil(sortedParticipants.length / PARTICIPANTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PARTICIPANTS_PER_PAGE
  const endIndex = startIndex + PARTICIPANTS_PER_PAGE
  const currentParticipants = sortedParticipants.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link
            href="/game"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Game
          </Link>
          <h1 className="text-3xl font-bold">Draw Snapshot</h1>
          <p className="text-white/40 text-sm mt-1">Captured on {new Date(snapshot.timestamp).toLocaleString()}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          <div className="border border-white/10 rounded-2xl p-8 bg-white/5">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-lime-400" />
              <span className="text-white/60">Total Participants</span>
            </div>
            <p className="text-5xl font-bold text-white">{snapshot.participants.length}</p>
          </div>

          <div className="border border-white/10 rounded-2xl p-8 bg-white/5">
            <div className="flex items-center gap-3 mb-4">
              <Ticket className="w-6 h-6 text-lime-400" />
              <span className="text-white/60">Total Tickets</span>
            </div>
            <p className="text-5xl font-bold text-white">{snapshot.totalTickets}</p>
          </div>
        </div>

        {/* Participants List */}
        <div className="border border-white/10 rounded-2xl p-6 bg-white/5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <Users className="w-6 h-6 text-lime-400" />
              Participants
            </h2>
            <div className="text-white/60 text-sm">
              Showing {startIndex + 1}-{Math.min(endIndex, sortedParticipants.length)} of {sortedParticipants.length}
            </div>
          </div>

          <div className="space-y-2">
            {/* Header */}
            <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-3 border-b border-white/10 text-white/60 text-sm font-bold">
              <div>Wallet Address</div>
              <div className="text-right">Tickets</div>
              <div className="text-right w-24">Win Chance</div>
            </div>

            {/* Participants */}
            {currentParticipants.map((participant, index) => {
              const winChance = ((participant.ticketCount / snapshot.totalTickets) * 100).toFixed(2)

              return (
                <div
                  key={startIndex + index}
                  className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-4 border border-white/5 rounded-lg hover:border-lime-400/30 hover:bg-white/5 transition-all"
                >
                  <div className="font-mono text-sm sm:text-base break-all">{participant.walletAddress}</div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-lime-400/10 text-lime-400 rounded-full font-bold">
                      <Ticket className="w-4 h-4" />
                      {participant.ticketCount}
                    </span>
                  </div>
                  <div className="text-right w-24 text-white/60">{winChance}%</div>
                </div>
              )
            })}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-white/10 hover:border-lime-400/50 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`w-10 h-10 rounded-lg font-bold transition-all ${
                        currentPage === pageNum
                          ? "bg-lime-400 text-black"
                          : "border border-white/10 hover:border-lime-400/50 hover:bg-white/5"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-white/10 hover:border-lime-400/50 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-8 p-6 border border-white/10 rounded-2xl bg-white/5">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-lime-400 mt-1" />
            <div>
              <p className="font-bold mb-2">About This Snapshot</p>
              <p className="text-white/60 text-sm leading-relaxed">
                This snapshot was taken at the moment the draw started. It shows all eligible participants who held
                50,000+ $BigBag tokens at that time, along with their ticket counts. Each 50,000 tokens equals 1 ticket
                in the draw.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
