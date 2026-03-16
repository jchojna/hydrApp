"use server"

import { ActionResponse } from "./types"
import {
  getUserAllConsumptionRecords,
  getCurrentUser,
  getUsersTotalConsumptionAmounts,
} from "@/lib/dal"
import { MAX_WATER_PER_DAY } from "@/lib/constants"
import { formatDate } from "@/lib/utils"
import { UserStats } from "@/lib/types"
import { clampWaterLevel } from "@/app/dashboard/utils/clampWaterLevel"
import { getStreaks } from "@/lib/utils/getStreaks"

export async function getUserStatsAction(): Promise<ActionResponse<UserStats>> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        message: "You need to be signed in",
      }
    }

    const [records, totals] = await Promise.all([
      getUserAllConsumptionRecords(user.id),
      getUsersTotalConsumptionAmounts(),
    ])

    const todayDate = formatDate(new Date())
    const {
      currentStreak,
      longestStreak,
      currentStreakRange,
      lastLongestStreakRange,
    } = getStreaks(records, todayDate)

    const totalPoints = records.reduce((sum, record) => {
      return sum + clampWaterLevel(Number(record.amount)) / MAX_WATER_PER_DAY
    }, 0)

    const userPointsRanking = totals
      .map((entry) => ({
        userId: entry.userId,
        points: Number(entry.totalAmount) / MAX_WATER_PER_DAY,
      }))
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points
        return a.userId.localeCompare(b.userId)
      })

    const rankIndex = userPointsRanking.findIndex(
      (entry) => entry.userId === user.id,
    )

    return {
      success: true,
      message: "User stats retrieved successfully",
      data: {
        currentStreak,
        longestStreak,
        currentStreakRange,
        lastLongestStreakRange,
        points: totalPoints,
        rank: rankIndex >= 0 ? rankIndex + 1 : null,
      },
    }
  } catch (error) {
    console.error("Get user stats error:", error)
    return {
      success: false,
      message: "An error occurred while getting user stats",
    }
  }
}
