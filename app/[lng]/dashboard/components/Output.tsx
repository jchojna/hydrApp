import { useMemo } from "react"

import { Today } from "./Today"
import { getScoreLevel } from "../utils/getScoreLevel"
import { useSettings } from "@/providers/SettingsContext"
import { Counter } from "./counter"

interface OutputProps {
  waterLevel: number
}

export const Output = ({ waterLevel }: OutputProps) => {
  const {
    settings: { glassVolume, maxWaterPerDay },
  } = useSettings()

  const scoreLevel = useMemo(
    () => getScoreLevel(waterLevel, maxWaterPerDay),
    [maxWaterPerDay, waterLevel],
  )

  return (
    <div className="flex flex-col items-center gap-4">
      <Today />
      <Counter value={waterLevel / glassVolume} />
      <div className="text-sm text-blue-300">{scoreLevel.message}</div>
    </div>
  )
}
