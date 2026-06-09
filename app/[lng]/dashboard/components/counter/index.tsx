"use client"

import { useMemo } from "react"
import { CounterDigits } from "./components/CounterDigits"

interface CounterProps {
  value: number
}

export const Counter = ({ value }: CounterProps) => {
  const digits = useMemo(() => {
    return value.toString().padStart(2, "0").split("")
  }, [value])

  return (
    <div className="flex gap-2">
      {digits.map((digit, index) => (
        <CounterDigits key={`digit-${index}`} digit={digit} />
      ))}
    </div>
  )
}
