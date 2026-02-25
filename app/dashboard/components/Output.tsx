import { Digit0 } from "@/assets/svg/digits/digit-0"
import { Digit1 } from "@/assets/svg/digits/digit-1"
import { Digit2 } from "@/assets/svg/digits/digit-2"
import { Digit3 } from "@/assets/svg/digits/digit-3"
import { Digit4 } from "@/assets/svg/digits/digit-4"
import { Digit5 } from "@/assets/svg/digits/digit-5"
import { Digit6 } from "@/assets/svg/digits/digit-6"
import { Digit7 } from "@/assets/svg/digits/digit-7"
import { Digit8 } from "@/assets/svg/digits/digit-8"
import { Digit9 } from "@/assets/svg/digits/digit-9"

const DIGITS = [
  <Digit0 key="0" className="w-16" />,
  <Digit1 key="1" className="w-16" />,
  <Digit2 key="2" className="w-16" />,
  <Digit3 key="3" className="w-16" />,
  <Digit4 key="4" className="w-16" />,
  <Digit5 key="5" className="w-16" />,
  <Digit6 key="6" className="w-16" />,
  <Digit7 key="7" className="w-16" />,
  <Digit8 key="8" className="w-16" />,
  <Digit9 key="9" className="w-16" />,
]

interface OutputProps {
  waterLevel: number
}

export const Output = ({ waterLevel }: OutputProps) => {
  const digits = waterLevel
    .toString()
    .padStart(2, "0")
    .split("")
    .map((digit) => DIGITS[parseInt(digit)])

  return <div className="flex gap-2">{digits}</div>
}
