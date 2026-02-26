import { useMemo } from "react"

import { getDigits } from "../utils/getDigits"
import { Today } from "./Today"

interface OutputProps {
  waterLevel: number
}

export const Output = ({ waterLevel }: OutputProps) => {
  const digits = useMemo(() => getDigits(waterLevel), [waterLevel])

  return (
    <div className="flex flex-col items-center gap-4">
      <Today />
      <div className="flex gap-3">{digits}</div>
    </div>
  )
}
