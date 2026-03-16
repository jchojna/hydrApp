import { cache } from "react"
import { and, asc, desc, eq, gte, lte, lt, sql } from "drizzle-orm"
import { updateTag } from "next/cache"

import { db } from "@/db"
import { getSession } from "@/lib/auth/session"
import { consumptionTable, usersTable } from "@/db/schema"
import { ArchiveEntry, ArchivePageInfo } from "./types"
import { formatDate, parseDate, shiftDate } from "./utils"
import { MAX_WATER_PER_DAY } from "@/lib/constants"

export const getCurrentUser = cache(async () => {
  const session = await getSession()
  if (!session) return null

  // Skip database query during prerendering if we don't have a session
  // hack until we have PPR https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering
  if (
    typeof window === "undefined" &&
    process.env.NEXT_PHASE === "phase-production-build"
  ) {
    return null
  }

  try {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, session.userId))

    return result[0] || null
  } catch (error) {
    console.error("Error getting user by ID:", error)
    return null
  }
})

export const getUserByEmail = cache(async (email: string) => {
  try {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
    return result[0] || null
  } catch (error) {
    console.error("Error getting user by email:", error)
    return null
  }
})

export async function getConsumptionAmount(userId: string, date: string) {
  try {
    const result = await db
      .select({ amount: consumptionTable.amount })
      .from(consumptionTable)
      .where(
        and(
          eq(consumptionTable.user_id, userId),
          eq(consumptionTable.date, date),
        ),
      )
      .limit(1)

    return Number(result[0]?.amount) ?? 0
  } catch (error) {
    console.error("Error getting consumption amount:", error)
    throw new Error("Failed to get consumption amount")
  }
}

export async function getAverageConsumptionAmountSinceFirstRecord(
  userId: string,
): Promise<number> {
  try {
    const firstEntry = await db
      .select({ date: consumptionTable.date })
      .from(consumptionTable)
      .where(eq(consumptionTable.user_id, userId))
      .orderBy(asc(consumptionTable.date))
      .limit(1)

    if (!firstEntry[0]?.date) return 0

    const totalAmountResult = await db
      .select({
        totalAmount: sql<string>`coalesce(sum(${consumptionTable.amount}), 0)`,
      })
      .from(consumptionTable)
      .where(eq(consumptionTable.user_id, userId))

    const totalAmount = Number(totalAmountResult[0]?.totalAmount ?? "0")
    const firstRecordedDate = parseDate(firstEntry[0].date)
    const today = parseDate(formatDate(new Date()))
    const daysSinceFirstRecord =
      Math.floor(
        (today.getTime() - firstRecordedDate.getTime()) / (24 * 60 * 60 * 1000),
      ) + 1

    if (daysSinceFirstRecord <= 0) return 0

    return totalAmount / daysSinceFirstRecord
  } catch (error) {
    console.error("Error getting average consumption amount:", error)
    throw new Error("Failed to get average consumption amount")
  }
}

export async function upsertConsumptionRecord(
  userId: string,
  amount: number,
  date: string,
) {
  try {
    const points = (amount / MAX_WATER_PER_DAY).toFixed(2)

    const result = await db
      .insert(consumptionTable)
      .values({
        user_id: userId,
        amount: amount.toString(),
        points,
        date,
      })
      .onConflictDoUpdate({
        target: [consumptionTable.user_id, consumptionTable.date],
        set: { amount: amount.toString(), points, updated_at: new Date() },
      })
      .returning()

    updateTag("dashboardPage")

    return result[0] || null
  } catch (error) {
    console.error("Error upserting consumption record:", error)
    throw new Error("Failed to upsert consumption record")
  }
}

export async function getPaginatedArchiveEntries(
  userId: string,
  limit: number,
  startDate: string,
  endDate: string,
): Promise<{
  entries: ArchiveEntry[]
  pageInfo: ArchivePageInfo
}> {
  try {
    const result = await db
      .select()
      .from(consumptionTable)
      .where(
        and(
          eq(consumptionTable.user_id, userId),
          gte(consumptionTable.date, startDate),
          lte(consumptionTable.date, endDate),
        ),
      )
      .orderBy(desc(consumptionTable.date))

    const olderEntry = await db
      .select({ date: consumptionTable.date })
      .from(consumptionTable)
      .where(
        and(
          eq(consumptionTable.user_id, userId),
          lt(consumptionTable.date, startDate),
        ),
      )
      .limit(1)

    const entriesByDate = new Map(
      result.map((entry) => [
        entry.date,
        {
          date: entry.date,
          amount: entry.amount,
        } satisfies ArchiveEntry,
      ]),
    )

    const todayDate = formatDate(new Date())
    const hasPreviousPage = endDate < todayDate
    const hasNextPage = olderEntry.length > 0
    const oldestDateInDatabase = !hasNextPage
      ? (result[result.length - 1]?.date ?? null)
      : null

    const entries: ArchiveEntry[] = Array.from(
      { length: limit },
      (_, index) => {
        const date = shiftDate(endDate, -index)
        return (entriesByDate.get(date) ?? {
          date,
          amount: "0",
        }) satisfies ArchiveEntry
      },
    ).filter((entry) => {
      if (!oldestDateInDatabase) return true
      return new Date(entry.date) >= new Date(oldestDateInDatabase)
    })

    return {
      entries,
      pageInfo: {
        limit,
        startDate,
        endDate,
        hasPreviousPage,
        hasNextPage,
        previousStartDate: hasPreviousPage ? shiftDate(startDate, limit) : null,
        previousEndDate: hasPreviousPage ? shiftDate(endDate, limit) : null,
        nextStartDate: hasNextPage ? shiftDate(startDate, -limit) : null,
        nextEndDate: hasNextPage ? shiftDate(endDate, -limit) : null,
      },
    }
  } catch (error) {
    console.error("Error getting paginated archive entries:", error)
    throw new Error("Failed to get paginated archive entries")
  }
}
