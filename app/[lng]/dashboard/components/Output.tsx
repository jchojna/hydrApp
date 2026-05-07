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
    <div className="flex flex-1 flex-col items-center justify-center gap-10">
      <Today />
      <Counter value={waterLevel / glassVolume} />
      <div className="text-md font-medium text-blue-100">
        {scoreLevel.message}
      </div>
    </div>
  )
}
