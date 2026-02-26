import { SCORE_LEVELS } from "./constants"

export const getScoreLevelIndex = (
  waterLevel: number,
  totalWaterLevels: number,
) => {
  const scoreLevelCount = SCORE_LEVELS.length
  const safeTotalLevels = Math.max(totalWaterLevels, 1)
  const clampedLevel = Math.min(Math.max(waterLevel, 0), safeTotalLevels)
  const scoreLevelIndex = Math.min(
    scoreLevelCount - 1,
    Math.floor((clampedLevel * scoreLevelCount) / safeTotalLevels),
  )
  return scoreLevelIndex
}

export const getScoreLevel = (waterLevel: number, totalWaterLevels: number) => {
  const scoreLevelIndex = getScoreLevelIndex(waterLevel, totalWaterLevels)
  return SCORE_LEVELS[scoreLevelIndex]
}
