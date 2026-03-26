import { useMemo } from "react"

import { getDigits } from "../utils/getDigits"
import { Today } from "./Today"
import { getScoreLevel } from "../utils/getScoreLevel"
import { useSettings } from "@/providers/SettingsContext"

interface OutputProps {
  waterLevel: number
}

export const Output = ({ waterLevel }: OutputProps) => {
  const {
    settings: { glassVolume, maxWaterPerDay },
  } = useSettings()
  const digits = useMemo(
    () => getDigits(waterLevel, glassVolume),
    [glassVolume, waterLevel],
  )
  const scoreLevel = useMemo(
    () => getScoreLevel(waterLevel, maxWaterPerDay),
    [maxWaterPerDay, waterLevel],
  )

  return (
    <div className="flex flex-col items-center gap-4">
      <Today />
      <div className="flex gap-3">{digits}</div>
      <div className="text-blue-light-1 text-sm">{scoreLevel.message}</div>
    </div>
  )
}
