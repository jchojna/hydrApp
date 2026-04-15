import { cn } from "@/lib/utils"
import { getColorFromRange } from "../app/[lng]/dashboard/utils/getColorFromRange"
import { getScoreLevel } from "../app/[lng]/dashboard/utils/getScoreLevel"
import { EMOJI_GREEN_COLOR, EMOJI_RED_COLOR } from "@/lib/constants"

interface EmojiIconProps {
  waterLevel: number
  maxWaterPerDay: number
  className?: string
}

export const EmojiIcon = ({
  waterLevel,
  maxWaterPerDay,
  className,
}: EmojiIconProps) => {
  const Emoji = getScoreLevel(waterLevel, maxWaterPerDay).emoji
  const color = getColorFromRange(
    waterLevel / maxWaterPerDay,
    EMOJI_RED_COLOR,
    EMOJI_GREEN_COLOR,
  )

  return <Emoji className={cn("w-10", className)} color={color} />
}
