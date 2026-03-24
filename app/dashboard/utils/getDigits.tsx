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
  Digit0,
  Digit1,
  Digit2,
  Digit3,
  Digit4,
  Digit5,
  Digit6,
  Digit7,
  Digit8,
  Digit9,
]

export const getDigits = (waterLevel: number, glassVolume: number) => {
  return (waterLevel / glassVolume)
    .toString()
    .padStart(2, "0")
    .split("")
    .map((digit, index) => {
      const Digit = DIGITS[parseInt(digit)]
      return (
        <Digit
          key={`${digit}${index}`}
          className="text-blue-light-1 w-36 rounded-xl"
        />
      )
    })
}
