import { Emoji1 } from "@/assets/svg/emojis/emoji-1"
import { Emoji2 } from "@/assets/svg/emojis/emoji-2"
import { Emoji3 } from "@/assets/svg/emojis/emoji-3"
import { Emoji4 } from "@/assets/svg/emojis/emoji-4"
import { Emoji5 } from "@/assets/svg/emojis/emoji-5"
import { Emoji6 } from "@/assets/svg/emojis/emoji-6"
import { Emoji7 } from "@/assets/svg/emojis/emoji-7"
import { Emoji8 } from "@/assets/svg/emojis/emoji-8"
import { getColorFromRange } from "./getColorFromRange"

const EMOJIS = [Emoji1, Emoji2, Emoji3, Emoji4, Emoji5, Emoji6, Emoji7, Emoji8]

export const getEmoji = (waterLevel: number, totalWaterLevels: number) => {
  const emojiCount = EMOJIS.length
  const safeTotalLevels = Math.max(totalWaterLevels, 1)
  const clampedLevel = Math.min(Math.max(waterLevel, 0), safeTotalLevels)
  const emojiIndex = Math.min(
    emojiCount - 1,
    Math.floor((clampedLevel * emojiCount) / safeTotalLevels),
  )
  const Emoji = EMOJIS[emojiIndex]
  const color = getColorFromRange(
    clampedLevel / safeTotalLevels,
    "#C43823",
    "#1BC264",
  )

  return <Emoji className="w-14" color={color} />
}
