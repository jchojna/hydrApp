import { and, desc, eq, gte, lte, lt } from "drizzle-orm"

import { db } from "@/db"
import { consumptionTable } from "@/db/schema"
import { ArchiveEntry, PaginatedArchiveEntries } from "../types"
import { formatDate, shiftDate } from "../utils"

export async function getPaginatedArchiveEntries(
  userId: string,
  limit: number,
  startDate: string,
  endDate: string,
): Promise<PaginatedArchiveEntries> {
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
