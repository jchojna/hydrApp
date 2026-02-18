"use client"

import { useEffect, useRef } from "react"
import { Pane } from "tweakpane"

import { Waves } from "./waves"
import { addTweakpane } from "./utils/tweakpane"

export default function Background() {
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
      <div className="absolute right-6 bottom-6 z-10 flex gap-2">
        <button
          type="button"
          className="cursor-pointer rounded-md bg-slate-900/75 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-900/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          onClick={() => wavesRef.current?.swingWaves()}
        >
          Spring Waves
        </button>
        <button
          type="button"
          className="cursor-pointer rounded-md bg-slate-900/75 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-900/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          onClick={() => wavesRef.current?.decreaseWaterLevel()}
        >
          -
        </button>
        <button
          type="button"
          className="cursor-pointer rounded-md bg-slate-900/75 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-900/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          onClick={() => wavesRef.current?.increaseWaterLevel()}
        >
          +
        </button>
      </div>
    </div>
  )
}
