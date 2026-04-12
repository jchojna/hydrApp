"use client"

import { useEffect, useRef } from "react"
// import { Pane } from "tweakpane"

import { Waves } from "./waves"
// import { addTweakpane } from "./utils/tweakpane"

export let waves: Waves | null = null

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    waves = new Waves(canvas)
    waves.start()

    // const pane = new Pane()
    // addTweakpane(pane)

    const resizeCanvas = waves.resizeCanvas
    window.addEventListener("resize", resizeCanvas)
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      // pane.dispose()
    }
  }, [canvasRef])

  return (
    <div className="relative h-full min-h-screen w-full">
      <canvas
        ref={canvasRef}
        className="flex h-full w-full"
        aria-hidden="true"
      />
    </div>
  )
}
