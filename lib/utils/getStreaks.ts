import { shiftDate } from "@/lib/utils"
import { DateRange } from "../types"

type ConsumptionRecord = {
  date: string
  amount: string
}

export const getStreaks = (
  todayDate: string,
  records?: ConsumptionRecord[],
): {
  currentStreak: number
  longestStreak: number
  currentStreakRange: DateRange | null
  lastLongestStreakRange: DateRange | null
} => {
  if (!records || records.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      currentStreakRange: null,
      lastLongestStreakRange: null,
    }
  }

  const recordsByDate = new Map(
    records.map((record) => [record.date, Number(record.amount)]),
  )

  const firstDate = records[0].date
  let date = firstDate
  let currentStreak = 0
  let currentStreakStart = ""
  let longestStreak = 0
  let currentStreakRange: DateRange | null = null
  let lastLongestStreakRange: DateRange | null = null

  // Walk through each day to ensure missing records are treated as 0.
  while (date <= todayDate) {
    const amount = recordsByDate.get(date) ?? 0

    if (amount > 0) {
      if (currentStreak === 0) {
        currentStreakStart = date
      }
      currentStreak += 1
    } else if (currentStreak > 0) {
      const streakEndDate = shiftDate(date, -1)
      if (currentStreak >= longestStreak) {
        longestStreak = currentStreak
        lastLongestStreakRange = {
          startDate: currentStreakStart,
          endDate: streakEndDate,
        }
      }
      currentStreak = 0
    }

    date = shiftDate(date, 1)
  }

  if (currentStreak > 0) {
    currentStreakRange = {
      startDate: currentStreakStart,
      endDate: todayDate,
    }

    if (currentStreak >= longestStreak) {
      longestStreak = currentStreak
      lastLongestStreakRange = {
        startDate: currentStreakStart,
        endDate: todayDate,
      }
    }
  }

  return {
    currentStreak,
    longestStreak,
    currentStreakRange,
    lastLongestStreakRange,
  }
}
