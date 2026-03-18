"use client"

import { PaginationHeader } from "@/components/PaginationHeader"
import { useAuth } from "@/contexts/AuthContext"
import { formatDate, formatDatesRange, formatDays } from "@/lib/utils"
import { ConsumptionRecord } from "@/lib/types"
import { StatsItem } from "./components/StatsItem"
import { GLASS_VOLUME, MAX_WATER_PER_DAY } from "@/lib/constants"
import { getStreaks } from "@/lib/utils/getStreaks"
import { clampWaterLevel } from "../dashboard/utils/clampWaterLevel"
import { RankingType } from "@/lib/utils/getRanking"

type StatsProps = {
  averageWaterLevel: number
  records?: ConsumptionRecord[]
  ranking: RankingType
  isLoading: boolean
  error: Error | null
}

export default function Stats({
  averageWaterLevel,
  records,
  ranking,
  isLoading,
  error,
}: StatsProps) {
  const { user } = useAuth()

  const todayDate = formatDate(new Date())
  const {
    currentStreak,
    longestStreak,
    currentStreakRange,
    lastLongestStreakRange,
  } = getStreaks(todayDate, records)

  const totalPoints =
    records?.reduce((sum, record) => {
      return sum + clampWaterLevel(Number(record.amount)) / MAX_WATER_PER_DAY
    }, 0) ?? 0

  const rankIndex = ranking.findIndex((entry) => entry.userId === user?.id)

  const averageLitresValue = `${averageWaterLevel.toFixed(2)} L`
  const averageGlassesValue = `${(averageWaterLevel / GLASS_VOLUME).toFixed(1)} glass${
    averageWaterLevel / GLASS_VOLUME === 1 ? "" : "es"
  }`

  const currentRangeLabel = currentStreakRange
    ? formatDatesRange(currentStreakRange.startDate, currentStreakRange.endDate)
    : "-"
  const longestRangeLabel = lastLongestStreakRange
    ? formatDatesRange(
        lastLongestStreakRange.startDate,
        lastLongestStreakRange.endDate,
      )
    : "-"
  const pointsLabel = `${totalPoints.toFixed(2)} points`
  const rankLabel = !!rankIndex ? `#${rankIndex} position` : "-"

  return (
    <div className="flex w-full max-w-[400px] flex-col gap-4">
      <PaginationHeader title={user?.email ?? "User"} />
      {error && <div className="text-red-200">Error: {error.message}</div>}
      <div className="flex flex-col gap-2">
        <StatsItem
          label="Average per day"
          mainValue={averageLitresValue}
          secondaryValue={averageGlassesValue}
        />
        <StatsItem
          label="Current streak"
          mainValue={formatDays(currentStreak)}
          secondaryValue={currentRangeLabel}
          isLoading={isLoading}
        />
        <StatsItem
          label="Longest streak"
          mainValue={formatDays(longestStreak)}
          secondaryValue={longestRangeLabel}
          isLoading={isLoading}
        />
        <StatsItem
          label="Total points"
          mainValue={pointsLabel}
          secondaryValue={rankLabel}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
