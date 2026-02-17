"use client"

import { useEffect, useRef } from "react"
import { Pane } from "tweakpane"

import { Waves } from "./waves"
import { addTweakpane } from "./utils/tweakpane"

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
    addTweakpane(pane)

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
