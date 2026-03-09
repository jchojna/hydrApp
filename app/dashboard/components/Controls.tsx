import { useCallback, useMemo, useTransition } from "react"

import { PlusCircleIcon } from "@/assets/svg/icons/plus-circle"
import { IconButton } from "@/components/IconButton"
import { MinusCircleIcon } from "@/assets/svg/icons/minus-circle"
import { waves } from "@/app/background"
import { getEmoji } from "../utils/getEmoji"
import { formatDate } from "@/lib/utils"
import { saveConsumptionAction } from "@/actions/consumption"
import { GLASS_VOLUME, MAX_WATER_PER_DAY } from "../utils/constants"
import { clampWaterLevel } from "../utils/clampWaterLevel"

interface ControlsProps {
  waterLevel: number
  onWaterLevelChange: (waterLevel: number) => void
}

export const Controls = ({ waterLevel, onWaterLevelChange }: ControlsProps) => {
  const [isPending, startTransition] = useTransition()
  const previousWaterLevel = waterLevel

  const handleWaterLevelChange = useCallback(
    (newWaterLevel: number) => {
      const todayDate = formatDate(new Date())
      onWaterLevelChange(newWaterLevel)
      waves?.setWaterLevel(newWaterLevel)

      startTransition(async () => {
        const response = await saveConsumptionAction({
          amount: newWaterLevel,
          date: todayDate,
        })

        if (!response.success) {
          onWaterLevelChange(previousWaterLevel)
          waves?.setWaterLevel(previousWaterLevel)
        }
      })
    },
    [onWaterLevelChange, previousWaterLevel],
  )

  const handleIncreaseWaterLevel = () => {
    const newWaterLevel = clampWaterLevel(waterLevel + GLASS_VOLUME)
    if (newWaterLevel === waterLevel) return

    handleWaterLevelChange(newWaterLevel)
  }

  const handleDecreaseWaterLevel = () => {
    const newWaterLevel = clampWaterLevel(waterLevel - GLASS_VOLUME)
    if (newWaterLevel === waterLevel) return

    handleWaterLevelChange(newWaterLevel)
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
