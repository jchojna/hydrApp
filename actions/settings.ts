"use server"

import { SelectUser } from "@/db/schema"
import { ActionResponse } from "./types"
import { getCurrentUser, getUserSettings, updateUserSettings } from "@/lib/dal"
import { UserSettings } from "@/lib/types"

type SaveUserSettingInput =
  | { key: "username"; value: string }
  | { key: "age"; value: number }
  | { key: "sex"; value: SelectUser["sex"] }
  | { key: "maxWaterPerDay"; value: number }
  | { key: "glassVolume"; value: number }

const MAX_AGE = 100
const MAX_WATER_LIMIT = 5
const MAX_GLASS_VOLUME = 1

const normalizeUserSetting = (
  input: SaveUserSettingInput,
): SaveUserSettingInput => {
  switch (input.key) {
    case "username": {
      return {
        key: input.key,
        value: input.value.trim().slice(0, 255),
      }
    }
    case "age": {
      return {
        key: input.key,
        value: Math.max(0, Math.min(MAX_AGE, Math.round(input.value))),
      }
    }
    case "sex": {
      if (
        input.value !== "male" &&
        input.value !== "female" &&
        input.value !== "other"
      ) {
        return { key: input.key, value: "other" }
      }

      return input
    }
    case "maxWaterPerDay": {
      const clampedValue = Math.max(0, Math.min(MAX_WATER_LIMIT, input.value))

      return {
        key: input.key,
        value: Number(clampedValue.toFixed(2)),
      }
    }
    case "glassVolume": {
      const clampedValue = Math.max(0, Math.min(MAX_GLASS_VOLUME, input.value))

      return {
        key: input.key,
        value: Number(clampedValue.toFixed(2)),
      }
    }
  }
}

export async function getUserSettingsAction(): Promise<
  ActionResponse<UserSettings>
> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        message: "You need to be signed in",
      }
    }

    const settings = await getUserSettings(user.id)

    return {
      success: true,
      message: "User settings retrieved successfully",
      data: settings,
    }
  } catch (error) {
    console.error("Get user settings error:", error)
    return {
      success: false,
      message: "An error occurred while getting user settings",
    }
  }
}

export async function saveUserSettingAction(
  input: SaveUserSettingInput,
): Promise<ActionResponse<UserSettings>> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        message: "You need to be signed in",
      }
    }

    const normalizedInput = normalizeUserSetting(input)

    await updateUserSettings(user.id, {
      [normalizedInput.key]: normalizedInput.value,
    })

    const settings = await getUserSettings(user.id)

    return {
      success: true,
      message: "User setting saved successfully",
      data: settings,
    }
  } catch (error) {
    console.error("Save user setting error:", error)
    return {
      success: false,
      message: "An error occurred while saving user setting",
    }
  }
}
