import { useMemo } from "react"
import { getDigits } from "../utils/getDigits"

interface OutputProps {
  waterLevel: number
}

export const Output = ({ waterLevel }: OutputProps) => {
  const digits = useMemo(() => getDigits(waterLevel), [waterLevel])

  return <div className="flex gap-3">{digits}</div>
}
