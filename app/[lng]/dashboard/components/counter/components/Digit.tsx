"use client"

import { cn } from "@/lib/utils"

type DigitProps = {
  digit: string
  ref: React.RefObject<HTMLDivElement | null>
}

export const Digit = ({ digit, ref }: DigitProps) => {
  return (
    <div
      ref={ref}
      className={cn(
        "absolute top-0 left-0 flex h-full w-full items-center justify-center",
        "text-9xl font-medium text-blue-50",
      )}
    >
      <span className="leading-none">{digit}</span>
    </div>
  )
}
