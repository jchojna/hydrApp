import { useMemo, useTransition } from "react"

import { PlusCircleIcon } from "@/assets/svg/icons/plus-circle"
import { IconButton } from "@/components/IconButton"
import { MinusCircleIcon } from "@/assets/svg/icons/minus-circle"
import { waves } from "@/app/background"
import { getEmoji } from "../utils/getEmoji"
import { formatDate } from "../utils/formatDate"
import { saveConsumptionAction } from "@/actions/consumption"

interface ControlsProps {
  waterLevel: number
  totalWaterLevels: number
}

export const Controls = ({ waterLevel, totalWaterLevels }: ControlsProps) => {
  const [isPending, startTransition] = useTransition()

  const handleIncreaseWaterLevel = async () => {
    waves?.increaseWaterLevel() // TODO: change to set water level

    startTransition(async () => {
      await saveConsumptionAction({
        amount: waterLevel + 1,
        date: formatDate(new Date()),
      })
    })
  }

  const handleDecreaseWaterLevel = () => {
    waves?.decreaseWaterLevel() // TODO: change to set water level

    startTransition(async () => {
      await saveConsumptionAction({
        amount: waterLevel - 1,
        date: formatDate(new Date()),
      })
    })
  }

  const emoji = useMemo(
    () => getEmoji(waterLevel, totalWaterLevels),
    [waterLevel, totalWaterLevels],
  )

  return (
    <div className="absolute right-0 bottom-0 flex flex-col gap-4 p-8">
      <IconButton
        icon={<PlusCircleIcon />}
        onClick={handleIncreaseWaterLevel}
        disabled={isPending}
      />
      <IconButton
        icon={<MinusCircleIcon />}
        onClick={handleDecreaseWaterLevel}
        disabled={isPending}
      />
      {emoji}
    </div>
  )
}
