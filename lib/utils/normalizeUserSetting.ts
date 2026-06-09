import { MAX_GLASS_VOLUME } from "../constants"
import { MAX_USER_AGE, MAX_WATER_LIMIT } from "../constants"
import { UserSettingInput } from "../types"

export const normalizeUserSetting = (
  input: UserSettingInput,
): UserSettingInput => {
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
        value: Math.max(0, Math.min(MAX_USER_AGE, Math.round(input.value))),
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
