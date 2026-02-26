import { getColorFromRange } from "./getColorFromRange"
import { getScoreLevel } from "./getScoreLevel"

export const getEmoji = (waterLevel: number, totalWaterLevels: number) => {
  const Emoji = getScoreLevel(waterLevel, totalWaterLevels).emoji
  const color = getColorFromRange(
    waterLevel / totalWaterLevels,
    "#C43823",
    "#1BC264",
  )

  return <Emoji className="w-14" color={color} />
}
