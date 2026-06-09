import { and, asc, eq, sql } from "drizzle-orm"
import { updateTag } from "next/cache"

import { db } from "@/db"
import { consumptionTable, usersTable } from "@/db/schema"
import { ConsumptionRecord, UserTotalConsumptionAmount } from "../types"
import { formatDate, parseDate } from "../utils"

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

    return Number(result[0]?.amount ?? "0")
  } catch (error) {
    console.error("Error getting consumption amount:", error)
    throw new Error("Failed to get consumption amount")
  }
}

export async function getUserAllConsumptionRecords(
  userId: string,
): Promise<ConsumptionRecord[]> {
  try {
    return await db
      .select({ date: consumptionTable.date, amount: consumptionTable.amount })
      .from(consumptionTable)
      .where(eq(consumptionTable.user_id, userId))
      .orderBy(asc(consumptionTable.date))
  } catch (error) {
    console.error("Error getting consumption records:", error)
    throw new Error("Failed to get consumption records")
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

    return Number((totalAmount / daysSinceFirstRecord).toFixed(2))
  } catch (error) {
    console.error("Error getting average consumption amount:", error)
    throw new Error("Failed to get average consumption amount")
  }
}

export async function getUsersTotalConsumptionAmounts(): Promise<
  UserTotalConsumptionAmount[]
> {
  try {
    return await db
      .select({
        userId: usersTable.id,
        username: usersTable.username,
        email: usersTable.email,
        totalAmount: sql<string>`coalesce(sum(least(${consumptionTable.amount}, ${usersTable.max_water_per_day})), 0)`,
      })
      .from(usersTable)
      .leftJoin(consumptionTable, eq(consumptionTable.user_id, usersTable.id))
      .groupBy(usersTable.id)
  } catch (error) {
    console.error("Error getting users total consumption amounts:", error)
    throw new Error("Failed to get users total consumption amounts")
  }
}

async function getMaxWaterPerDay(userId: string): Promise<number> {
  try {
    const result = await db
      .select({ maxWaterPerDay: usersTable.max_water_per_day })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1)

    return Number(result[0]?.maxWaterPerDay ?? "0")
  } catch (error) {
    console.error("Error getting max water per day:", error)
    throw new Error("Failed to get max water per day")
  }
}

export async function upsertConsumptionRecord(
  userId: string,
  amount: number,
  date: string,
) {
  try {
    const maxWaterPerDay = await getMaxWaterPerDay(userId)
    const points = (amount / maxWaterPerDay).toFixed(2)

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
