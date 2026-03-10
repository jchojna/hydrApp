import { MAX_WATER_PER_DAY } from "@/lib/constants"

export const clampWaterLevel = (
  waterLevel: number,
  maxWaterPerDay: number = MAX_WATER_PER_DAY,
) => {
  return Math.min(Math.max(waterLevel, 0), maxWaterPerDay)
}
