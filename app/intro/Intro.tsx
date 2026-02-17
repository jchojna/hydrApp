"use client"

import { useEffect, useRef } from "react"
import { Waves } from "./waves"
import { Pane } from "tweakpane"
import { WAVES_DATA } from "./constants"

export const Intro = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const wavesRef = useRef<Waves | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    if (!wavesRef.current) {
      wavesRef.current = new Waves(canvas)
    }
    wavesRef.current.start()

    const pane = new Pane()

    pane.addBinding(WAVES_DATA[0], "amplitudeRatio", {
      min: 0,
      max: 1,
      step: 0.1,
    })
    pane.addBinding(WAVES_DATA[1], "amplitudeRatio")
    pane.addBinding(WAVES_DATA[2], "amplitudeRatio")

    const resizeCanvas = wavesRef.current.resizeCanvas
    window.addEventListener("resize", resizeCanvas)
    return () => {
      wavesRef.current = null
      window.removeEventListener("resize", resizeCanvas)
      pane.dispose()
    }
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
