import { getColorFromRange } from "./getColorFromRange"
import { getScoreLevel } from "./getScoreLevel"

export const getEmoji = (waterLevel: number, maxWaterPerDay: number) => {
  const Emoji = getScoreLevel(waterLevel, maxWaterPerDay).emoji
  const color = getColorFromRange(
    waterLevel / maxWaterPerDay,
    "#C43823",
    "#1BC264",
  )

  return <Emoji className="w-14" color={color} />
}
