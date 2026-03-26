"use server"

import { ActionResponse } from "@/lib/types"
import { getCurrentUser } from "@/lib/dal/user"
import { getUserSettings, updateUserSettings } from "@/lib/dal/settings"
import { UserSettingInput, UserSettings } from "@/lib/types"
import { unauthorizedActionResponse } from "@/lib/errors"
import { normalizeUserSetting } from "@/lib/utils/normalizeUserSetting"

export async function saveUserSettingAction(
  input: UserSettingInput,
): Promise<ActionResponse<UserSettings>> {
  try {
    const user = await getCurrentUser()
    if (!user) return unauthorizedActionResponse

    const normalizedInput = normalizeUserSetting(input)

    await updateUserSettings(user.id, {
      [normalizedInput.key]: normalizedInput.value,
    })

    const settings = await getUserSettings(user.id)
    if (!settings.success)
      return {
        success: false,
        message: "An error occurred while getting user settings",
      }

    return {
      success: true,
      message: "User setting saved successfully",
      data: settings.data,
    }
  } catch (error) {
    console.error("Save user setting error:", error)
    return {
      success: false,
      message: "An error occurred while saving user setting",
    }
  }
}
