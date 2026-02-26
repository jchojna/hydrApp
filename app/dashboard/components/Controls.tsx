import { PlusCircleIcon } from "@/assets/svg/icons/plus-circle"
import { IconButton } from "@/components/IconButton"
import { MinusCircleIcon } from "@/assets/svg/icons/minus-circle"
import { waves } from "@/app/background"

import { Emoji1 } from "@/assets/svg/emojis/emoji-1"
import { Emoji2 } from "@/assets/svg/emojis/emoji-2"
import { Emoji3 } from "@/assets/svg/emojis/emoji-3"
import { Emoji4 } from "@/assets/svg/emojis/emoji-4"
import { Emoji5 } from "@/assets/svg/emojis/emoji-5"
import { Emoji6 } from "@/assets/svg/emojis/emoji-6"
import { Emoji7 } from "@/assets/svg/emojis/emoji-7"
import { Emoji8 } from "@/assets/svg/emojis/emoji-8"
import type { Dispatch, SetStateAction } from "react"

const EMOJIS = [Emoji1, Emoji2, Emoji3, Emoji4, Emoji5, Emoji6, Emoji7, Emoji8]

const getEmoji = (waterLevel: number, totalWaterLevels: number) => {
  const emojiCount = EMOJIS.length
  const safeTotalLevels = Math.max(totalWaterLevels, 1)
  const clampedLevel = Math.min(Math.max(waterLevel, 0), safeTotalLevels)
  const emojiIndex = Math.min(
    emojiCount - 1,
    Math.floor((clampedLevel * emojiCount) / safeTotalLevels),
  )
  const Emoji = EMOJIS[emojiIndex]

  return <Emoji className="w-14" />
}

interface ControlsProps {
  waterLevel: number
  totalWaterLevels: number
  setWaterLevel: Dispatch<SetStateAction<number>>
}

export const Controls = ({
  waterLevel,
  totalWaterLevels,
  setWaterLevel,
}: ControlsProps) => {
  const handleIncreaseWaterLevel = () => {
    setWaterLevel((prevWaterLevel) =>
      Math.min(prevWaterLevel + 1, totalWaterLevels),
    )
    waves?.increaseWaterLevel() // TODO: change to set water level
  }

  const handleDecreaseWaterLevel = () => {
    setWaterLevel((prevWaterLevel) => Math.max(prevWaterLevel - 1, 0))
    waves?.decreaseWaterLevel() // TODO: change to set water level
  }

  return (
    <div className="absolute right-0 bottom-0 flex flex-col gap-4 p-8">
      <IconButton
        icon={<PlusCircleIcon />}
        onClick={handleIncreaseWaterLevel}
      />
      <IconButton
        icon={<MinusCircleIcon />}
        onClick={handleDecreaseWaterLevel}
      />
      {getEmoji(waterLevel, totalWaterLevels)}
    </div>
  )
}
