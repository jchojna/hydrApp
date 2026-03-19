import { SelectUser } from "@/db/schema"

export type ArchiveEntry = {
  date: string
  amount: string
}

export type ArchivePageInfo = {
  limit: number
  startDate: string
  endDate: string
  hasPreviousPage: boolean
  hasNextPage: boolean
  previousStartDate: string | null
  previousEndDate: string | null
  nextStartDate: string | null
  nextEndDate: string | null
}

export type PaginatedArchiveEntries = {
  entries: ArchiveEntry[]
  pageInfo: ArchivePageInfo
}

export type DateRange = {
  startDate: string
  endDate: string
}

export type UserStats = {
  currentStreak: number
  longestStreak: number
  currentStreakRange: DateRange | null
  lastLongestStreakRange: DateRange | null
  points: number
  rank: number | null
}

export type ConsumptionRecord = {
  date: string
  amount: string
}

export type UserTotalConsumptionAmount = {
  userId: string
  totalAmount: string
}

export type UserSex = SelectUser["sex"]

export type UserSettings = {
  username: string
  age: number
  sex: UserSex
  maxWaterPerDay: number
  glassVolume: number
}
