"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { gsap } from "gsap"

import { Digit } from "./Digit"
import { GlassContainer } from "@/components/GlassContainer"

const SLIDE_DURATION_SECONDS = 0.3

export const CounterDigits = ({ digit }: { digit: string }) => {
  const [currentDigit, setCurrentDigit] = useState(digit)
  const [nextDigit, setNextDigit] = useState<string | null>(null)
  const currentDigitRef = useRef<HTMLDivElement | null>(null)
  const nextDigitRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (digit === currentDigit || nextDigit) {
      return
    }

    const frame = window.requestAnimationFrame(() => {
      setNextDigit(digit)
    })

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [digit, currentDigit, nextDigit])

  useLayoutEffect(() => {
    if (!nextDigit || !currentDigitRef.current || !nextDigitRef.current) {
      return
    }

    const isSlideUp =
      Number(nextDigit) === Number(currentDigit) + 1 ||
      Number(currentDigit) === Number(nextDigit) + 9

    gsap.set(currentDigitRef.current, { yPercent: 0, opacity: 1 })
    gsap.set(nextDigitRef.current, {
      yPercent: isSlideUp ? -100 : 100,
      opacity: 0,
    })

    const timeline = gsap.timeline({
      onComplete: () => {
        setCurrentDigit(nextDigit)
        setNextDigit(null)
      },
    })

    timeline.to(currentDigitRef.current, {
      yPercent: isSlideUp ? 100 : -100,
      opacity: 0,
      duration: SLIDE_DURATION_SECONDS,
      ease: "power2.in",
    })

    timeline.to(
      nextDigitRef.current,
      {
        yPercent: 0,
        opacity: 1,
        duration: SLIDE_DURATION_SECONDS,
        ease: "power2.out",
      },
      0,
    )

    return () => {
      timeline.kill()
    }
  }, [nextDigit, currentDigit])

  useLayoutEffect(() => {
    if (nextDigit || !currentDigitRef.current) {
      return
    }

    gsap.set(currentDigitRef.current, { yPercent: 0, opacity: 1 })
  }, [currentDigit, nextDigit])

  return (
    <GlassContainer aria-label={`Digit ${digit}`}>
      <Digit ref={currentDigitRef} digit={currentDigit} />
      {nextDigit && <Digit ref={nextDigitRef} digit={nextDigit} />}
    </GlassContainer>
  )
}
