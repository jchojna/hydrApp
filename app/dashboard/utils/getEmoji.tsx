import { Emoji1 } from "@/assets/svg/emojis/emoji-1"
import { Emoji2 } from "@/assets/svg/emojis/emoji-2"
import { Emoji3 } from "@/assets/svg/emojis/emoji-3"
import { Emoji4 } from "@/assets/svg/emojis/emoji-4"
import { Emoji5 } from "@/assets/svg/emojis/emoji-5"
import { Emoji6 } from "@/assets/svg/emojis/emoji-6"
import { Emoji7 } from "@/assets/svg/emojis/emoji-7"
import { Emoji8 } from "@/assets/svg/emojis/emoji-8"

const EMOJIS = [Emoji1, Emoji2, Emoji3, Emoji4, Emoji5, Emoji6, Emoji7, Emoji8]

export const getColorFromRange = (
  percentage: number,
  startColor: string,
  endColor: string,
) => {
  const normalizedPercentage = Math.min(Math.max(percentage, 0), 1)

  const parseHexColor = (color: string) => {
    const sanitized = color.replace("#", "")
    const hex =
      sanitized.length === 3
        ? sanitized
            .split("")
            .map((char) => char + char)
            .join("")
        : sanitized

    if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
      throw new Error(`Invalid hex color provided: ${color}`)
    }

    return {
      r: Number.parseInt(hex.slice(0, 2), 16),
      g: Number.parseInt(hex.slice(2, 4), 16),
      b: Number.parseInt(hex.slice(4, 6), 16),
    }
  }

  const toHex = (value: number) => value.toString(16).padStart(2, "0")
  const start = parseHexColor(startColor)
  const end = parseHexColor(endColor)

  const r = Math.round(start.r + (end.r - start.r) * normalizedPercentage)
  const g = Math.round(start.g + (end.g - start.g) * normalizedPercentage)
  const b = Math.round(start.b + (end.b - start.b) * normalizedPercentage)

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

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
