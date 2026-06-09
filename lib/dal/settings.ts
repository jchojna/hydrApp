import { eq } from "drizzle-orm"

import { db } from "@/db"
import { usersTable } from "@/db/schema"
import { ActionResponse, UserSettings } from "../types"

export async function getUserSettings(
  userId: string,
): Promise<ActionResponse<UserSettings>> {
  try {
    const [result] = await db
      .select({
        username: usersTable.username,
        age: usersTable.age,
        sex: usersTable.sex,
        maxWaterPerDay: usersTable.max_water_per_day,
        glassVolume: usersTable.glass_volume,
      })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1)

    return {
      success: true,
      message: "User settings retrieved successfully",
      data: {
        username: result.username,
        age: result.age,
        sex: result.sex,
        maxWaterPerDay: Number(result.maxWaterPerDay),
        glassVolume: Number(result.glassVolume),
      },
    }
  } catch (error) {
    console.error("Error getting user settings:", error)
    return {
      success: false,
      message: "An error occurred while getting user settings",
    }
  }
}

export async function updateUserSettings(
  userId: string,
  settings: Partial<UserSettings>,
) {
  try {
    const values: Partial<typeof usersTable.$inferInsert> = {}

    // TODO: add zod validation
    if (typeof settings.username === "string") {
      values.username = settings.username
    }

    if (typeof settings.age === "number") {
      values.age = settings.age
    }

    if (
      settings.sex === "male" ||
      settings.sex === "female" ||
      settings.sex === "other"
    ) {
      values.sex = settings.sex
    }

    if (typeof settings.maxWaterPerDay === "number") {
      values.max_water_per_day = settings.maxWaterPerDay.toString()
    }

    if (typeof settings.glassVolume === "number") {
      values.glass_volume = settings.glassVolume.toString()
    }

    if (!Object.keys(values).length) return null

    const result = await db
      .update(usersTable)
      .set({
        ...values,
        updated_at: new Date(),
      })
      .where(eq(usersTable.id, userId))
      .returning()

    return result[0]
  } catch (error) {
    console.error("Error updating user settings:", error)
    throw new Error("Failed to update user settings")
  }
}
