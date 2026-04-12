"use client"

import { gsap } from "gsap"
import { useEffect, useLayoutEffect, useRef, useState } from "react"

interface FlipCounterProps {
  digits: string[]
}

interface FlipState {
  from: string
  to: string
  isFlipping: boolean
  isHalfFlipped: boolean
}

const FLIP_DURATION_SECONDS = 0.5

const FlipDigit = ({ digit }: { digit: string }) => {
  const previousDigitRef = useRef(digit)
  const flipRef = useRef<HTMLDivElement | null>(null)
  const [flipState, setFlipState] = useState<FlipState>({
    from: digit,
    to: digit,
    isFlipping: false,
    isHalfFlipped: false,
  })

  useEffect(() => {
    if (digit === previousDigitRef.current) {
      return
    }

    setFlipState({
      from: previousDigitRef.current,
      to: digit,
      isFlipping: true,
      isHalfFlipped: false,
    })

    setTimeout(
      () => {
        setFlipState((state) => ({ ...state, isHalfFlipped: true }))
      },
      (FLIP_DURATION_SECONDS / 2) * 1000,
    )

    previousDigitRef.current = digit
  }, [digit, flipState.isHalfFlipped])

  useLayoutEffect(() => {
    if (!flipState.isFlipping || !flipRef.current) {
      return
    }

    const timeline = gsap
      .timeline({
        onComplete: () => {
          setFlipState((state) => ({ ...state, isFlipping: false }))
        },
      })
      .set(flipRef.current, { rotationX: 0 })
      .to(flipRef.current, {
        rotationX: -180,
        duration: FLIP_DURATION_SECONDS,
        ease: "power2.inOut",
      })
      .to(flipRef.current, {
        rotationX: -140,
        duration: 0.08,
        ease: "power1.out",
      })
      .to(flipRef.current, {
        rotationX: -180,
        duration: 0.1,
        ease: "power1.in",
      })

    return () => {
      timeline.kill()
    }
  }, [flipState.isFlipping])

  const currentDigit = flipState.isHalfFlipped ? flipState.to : flipState.from

  return (
    <div
      className="relative h-28 w-24 perspective-[250px]"
      aria-label={`Digit ${digit}`}
    >
      <div className="absolute top-0 left-0 h-1/2 w-full overflow-hidden rounded-t-xl bg-blue-500 text-[2.5rem] font-semibold text-blue-50">
        <span className="absolute top-0 left-0 flex h-[200%] w-full items-center justify-center">
          {currentDigit}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 h-1/2 w-full overflow-hidden rounded-b-xl border-t border-black/20 bg-blue-500 text-[2.5rem] font-semibold text-blue-50">
        <span className="absolute bottom-0 left-0 flex h-[200%] w-full items-center justify-center">
          {currentDigit}
        </span>
      </div>
      {flipState.isFlipping && (
        <div
          className="absolute top-0 left-0 h-1/2 w-full origin-bottom shadow-[0_8px_16px_rgba(0,0,0,0.18)] transform-3d"
          aria-hidden="true"
          ref={flipRef}
        >
          <div className="absolute inset-0 overflow-hidden rounded-t-xl bg-blue-700 text-[2.5rem] font-semibold text-blue-50 backface-hidden">
            <span className="absolute top-0 left-0 flex h-[200%] w-full items-center justify-center">
              {flipState.from}
            </span>
          </div>
          <div className="absolute inset-0 transform-[rotateX(180deg)] overflow-hidden rounded-b-xl bg-blue-700 text-[2.5rem] font-semibold text-blue-50 backface-hidden">
            <span className="absolute bottom-0 left-0 flex h-[200%] w-full items-center justify-center">
              {flipState.to}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export const FlipCounter = ({ digits }: FlipCounterProps) => {
  return (
    <div className="flex gap-3">
      {digits.map((digit, index) => (
        <FlipDigit key={`digit-${index}`} digit={digit} />
      ))}
    </div>
  )
}
