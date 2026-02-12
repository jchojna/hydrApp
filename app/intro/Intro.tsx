"use client"

import { useEffect, useRef } from "react"
import { Waves } from "./waves"

export type WaveLayer = {
  amplitudeRatio: number
  speed: number
  phaseOffset: number
  periods: number
  color: string
  yOffset: number
}

export const waveLayers: WaveLayer[] = [
  {
    amplitudeRatio: 0.4,
    speed: 0.001,
    phaseOffset: Math.PI / 2,
    periods: 6,
    color: "rgba(23, 86, 130, 0.85)",
    yOffset: 100,
  },
  {
    amplitudeRatio: 0.5,
    speed: 0.0013,
    phaseOffset: Math.PI / 3,
    periods: 3,
    color: "rgba(28, 102, 150, 0.9)",
    yOffset: 50,
  },
  {
    amplitudeRatio: 0.65,
    speed: 0.0018,
    phaseOffset: 0,
    periods: 2,
    color: "rgba(33, 121, 170, 0.95)",
    yOffset: 0,
  },
]

export const Intro = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    new Waves(canvas).start()

    // window.addEventListener("resize", resizeCanvas)
    // return () => {
    //   window.removeEventListener("resize", resizeCanvas)
    //   if (animationFrameRef.current) {
    //     cancelAnimationFrame(animationFrameRef.current)
    //   }
    // }
  }, [])

  return (
    <div ref={containerRef} className="relative h-full min-h-screen w-full">
      <canvas
        ref={canvasRef}
        className="flex h-full w-full"
        aria-hidden="true"
      />
    </div>
  )
}
