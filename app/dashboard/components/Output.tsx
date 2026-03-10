import { useMemo } from "react"

import { getDigits } from "../utils/getDigits"
import { Today } from "./Today"
import { MAX_WATER_PER_DAY } from "@/lib/constants"
import { getScoreLevel } from "../utils/getScoreLevel"

interface OutputProps {
  waterLevel: number
}

export const Output = ({ waterLevel }: OutputProps) => {
  const digits = useMemo(() => getDigits(waterLevel), [waterLevel])
  const scoreLevel = useMemo(
    () => getScoreLevel(waterLevel, MAX_WATER_PER_DAY),
    [waterLevel],
  )

  return (
    <div className="flex flex-col items-center gap-4">
      <Today />
      <div className="flex gap-3">{digits}</div>
      <div className="text-blue-light-1 text-sm">{scoreLevel.message}</div>
    </div>
  )
}
