export const clampWaterLevel = (waterLevel: number, maxWaterPerDay: number) => {
  return Math.min(Math.max(waterLevel, 0), maxWaterPerDay)
}
