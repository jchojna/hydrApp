import {
  useMemo,
  useTransition,
  type Dispatch,
  type SetStateAction,
} from "react"

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
  setWaterLevel: Dispatch<SetStateAction<number>>
}

export const Controls = ({
  waterLevel,
  totalWaterLevels,
  setWaterLevel,
}: ControlsProps) => {
  const [isPending, startTransition] = useTransition()

  const handleIncreaseWaterLevel = async () => {
    setWaterLevel((prevWaterLevel) =>
      Math.min(prevWaterLevel + 1, totalWaterLevels),
    )
    waves?.increaseWaterLevel() // TODO: change to set water level

    startTransition(async () => {
      await saveConsumptionAction({
        amount: waterLevel + 1,
        date: formatDate(new Date()),
      })
    })
  }

  const handleDecreaseWaterLevel = () => {
    setWaterLevel((prevWaterLevel) => Math.max(prevWaterLevel - 1, 0))
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
