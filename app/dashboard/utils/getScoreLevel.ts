import { SCORE_LEVELS } from "./constants"

export const getScoreLevelIndex = (
  waterLevel: number,
  maxWaterPerDay: number,
) => {
  const scoreLevelCount = SCORE_LEVELS.length
  const scoreLevelIndex = Math.min(
    scoreLevelCount - 1,
    Math.floor((waterLevel * scoreLevelCount) / maxWaterPerDay),
  )
  return scoreLevelIndex
}

export const getScoreLevel = (waterLevel: number, maxWaterPerDay: number) => {
  const scoreLevelIndex = getScoreLevelIndex(waterLevel, maxWaterPerDay)
  return SCORE_LEVELS[scoreLevelIndex]
}
