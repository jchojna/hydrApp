"use client"

import { useEffect, useState } from "react"

import { PaginationHeader } from "@/components/PaginationHeader"
import { useAuth } from "@/contexts/AuthContext"
import { getUserStatsAction } from "@/actions/stats"
import { formatDatesRange, formatDays } from "@/lib/utils"
import { UserStats } from "@/lib/types"
import { StatsItem } from "./components/StatsItem"
import { GLASS_VOLUME } from "@/lib/constants"

type StatsProps = {
  averageWaterLevel: number | null
}

export default function Stats({ averageWaterLevel }: StatsProps) {
  const { user } = useAuth()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    if (!user) {
      setStats(null)
      setError(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    getUserStatsAction()
      .then((response) => {
        if (!isActive) return

        if (!response.success) {
          setStats(null)
          setError(response.message)
          return
        }

        setStats(response.data ?? null)
      })
      .catch(() => {
        if (!isActive) return
        setStats(null)
        setError("Failed to load stats")
      })
      .finally(() => {
        if (!isActive) return
        setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [user?.id])

  if (!stats) return null

  const averageLitresValue = averageWaterLevel
    ? `${averageWaterLevel.toFixed(2)} L`
    : null
  const averageGlassesValue = averageWaterLevel
    ? `${(averageWaterLevel / GLASS_VOLUME).toFixed(1)} glass${
        averageWaterLevel / GLASS_VOLUME === 1 ? "" : "es"
      }`
    : null

  const longestRangeLabel = stats?.lastLongestStreakRange
    ? formatDatesRange(
        stats.lastLongestStreakRange.startDate,
        stats.lastLongestStreakRange.endDate,
      )
    : "-"
  const pointsLabel = stats === null ? "-" : `${stats.points.toFixed(2)} points`
  const rankLabel = !!stats?.rank ? `#${stats.rank}` : "-"

  return (
    <div className="flex w-full max-w-[400px] flex-col gap-4">
      <PaginationHeader title={user?.email ?? "User"} />
      {isLoading ? (
        <span className="text-blue-light-3 text-sm">Loading stats...</span>
      ) : null}
      {!isLoading && error ? (
        <span className="text-blue-light-3 text-sm">{error}</span>
      ) : null}
      {!isLoading && !error ? (
        <div className="flex flex-col gap-2">
          <StatsItem
            label="Average per day"
            mainValue={averageLitresValue}
            secondaryValue={averageGlassesValue}
          />
          <StatsItem
            label="Current streak"
            mainValue={formatDays(stats?.currentStreak ?? 0)}
          />
          <StatsItem
            label="Longest streak"
            mainValue={formatDays(stats?.longestStreak ?? 0)}
          />
          <StatsItem
            label="Last longest streak"
            mainValue={longestRangeLabel}
          />
          <StatsItem label="Total points" mainValue={pointsLabel} />
          <StatsItem label="Ranking position" mainValue={rankLabel} />
        </div>
      ) : null}
    </div>
  )
}
