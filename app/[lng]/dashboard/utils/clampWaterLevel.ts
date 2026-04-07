import { clamp } from "@/lib/utils/clamp"

export const clampWaterLevel = (waterLevel: number, maxWaterPerDay: number) => {
  return clamp(waterLevel, 0, maxWaterPerDay)
}
