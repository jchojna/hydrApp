import { useMemo, useTransition } from "react"

import { PlusCircleIcon } from "@/assets/svg/icons/plus-circle"
import { IconButton } from "@/components/IconButton"
import { MinusCircleIcon } from "@/assets/svg/icons/minus-circle"
import { waves } from "@/app/background"
import { getEmoji } from "../utils/getEmoji"
import { formatDate } from "../utils/formatDate"
import { saveConsumptionAction } from "@/actions/consumption"
import { GLASS_VOLUME, MAX_WATER_PER_DAY } from "../utils/constants"
import { clampWaterLevel } from "../utils/clampWaterLevel"

interface ControlsProps {
  waterLevel: number
}

export const Controls = ({ waterLevel }: ControlsProps) => {
  const [isPending, startTransition] = useTransition()

  const handleIncreaseWaterLevel = async () => {
    const newWaterLevel = clampWaterLevel(waterLevel + GLASS_VOLUME)
    if (newWaterLevel === waterLevel) return

    waves?.setWaterLevel(newWaterLevel)

    startTransition(async () => {
      await saveConsumptionAction({
        amount: newWaterLevel,
        date: formatDate(new Date()),
      })
    })
  }

  const handleDecreaseWaterLevel = () => {
    const newWaterLevel = clampWaterLevel(waterLevel - GLASS_VOLUME)
    if (newWaterLevel === waterLevel) return

    waves?.setWaterLevel(newWaterLevel)

    startTransition(async () => {
      await saveConsumptionAction({
        amount: newWaterLevel,
        date: formatDate(new Date()),
      })
    })
  }

  const emoji = useMemo(
    () => getEmoji(waterLevel, MAX_WATER_PER_DAY),
    [waterLevel],
  )

  return (
    <div className="absolute right-0 bottom-0 flex flex-col gap-4 p-8">
      <IconButton
        icon={<PlusCircleIcon />}
        onClick={handleIncreaseWaterLevel}
        disabled={isPending || waterLevel >= MAX_WATER_PER_DAY}
      />
      <IconButton
        icon={<MinusCircleIcon />}
        onClick={handleDecreaseWaterLevel}
        disabled={isPending || waterLevel <= 0}
      />
      {emoji}
    </div>
  )
}
