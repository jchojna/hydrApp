import { UserTotalConsumptionAmount } from "../types"
import { obscureEmail } from "../utils"

export type RankingType = ReturnType<typeof getRanking>

export const getRanking = (
  totals: UserTotalConsumptionAmount[] | undefined,
  maxWaterPerDay: number,
) =>
  (
    totals?.map((entry) => ({
      userId: entry.userId,
      username: entry.username || obscureEmail(entry.email),
      points: Number(entry.totalAmount) / maxWaterPerDay,
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
