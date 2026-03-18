import { MAX_WATER_PER_DAY } from "../constants"
import { UserTotalConsumptionAmount } from "../types"

export type RankingType = ReturnType<typeof getRanking>

export const getRanking = (totals: UserTotalConsumptionAmount[] | undefined) =>
  (
    totals?.map((entry) => ({
      userId: entry.userId,
      points: Number(entry.totalAmount) / MAX_WATER_PER_DAY,
    })) ?? []
  )
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points
      return a.userId.localeCompare(b.userId)
    })
    .map((entry) => ({
      ...entry,
      points: entry.points.toFixed(2),
    }))
