import { cache } from "react"
import { and, desc, eq } from "drizzle-orm"
import { updateTag } from "next/cache"

import { db } from "@/db"
import { getSession } from "@/lib/auth/session"
import { consumptionTable, usersTable } from "@/db/schema"
import { ArchiveEntry } from "./types"

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

    return result[0]?.amount || null
  } catch (error) {
    console.error("Error getting consumption amount:", error)
    throw new Error("Failed to get consumption amount")
  }
}

export async function upsertConsumptionRecord(
  userId: string,
  amount: number,
  date: string,
) {
  try {
    const result = await db
      .insert(consumptionTable)
      .values({ user_id: userId, amount: amount.toString(), date })
      .onConflictDoUpdate({
        target: [consumptionTable.user_id, consumptionTable.date],
        set: { amount: amount.toString(), updated_at: new Date() },
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
  offset: number,
): Promise<{
  entries: ArchiveEntry[]
  pageInfo: {
    limit: number
    offset: number
    hasPreviousPage: boolean
    hasNextPage: boolean
    previousOffset: number
    nextOffset: number | null
  }
}> {
  try {
    const result = await db
      .select()
      .from(consumptionTable)
      .where(eq(consumptionTable.user_id, userId))
      .limit(limit + 1)
      .offset(offset)
      .orderBy(desc(consumptionTable.date))

    const hasNextPage = result.length > limit
    const entries = result.slice(0, limit).map((entry) => ({
      date: entry.date,
      amount: entry.amount,
    }))

    return {
      entries,
      pageInfo: {
        limit,
        offset,
        hasPreviousPage: offset > 0,
        hasNextPage,
        previousOffset: Math.max(0, offset - limit),
        nextOffset: hasNextPage ? offset + limit : null,
      },
    }
  } catch (error) {
    console.error("Error getting paginated archive entries:", error)
    throw new Error("Failed to get paginated archive entries")
  }
}
