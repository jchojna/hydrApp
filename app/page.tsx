"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { waves } from "./background"

export default function Home() {
  const [isIntro, setIsIntro] = useState(true)
  const router = useRouter()

  const handleStart = useCallback(() => {
    setIsIntro(false)
    waves?.logo.hideLogo()
    waves?.fadeOut()
    router.push("/signin")
  }, [router])

  return (
    <div className="text-4xl font-bold text-amber-300">
      {isIntro && (
        <button
          type="button"
          className="cursor-pointer rounded-md bg-slate-900/75 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-900/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          onClick={handleStart}
        >
          Start
        </button>
      )}
    </div>
  )
}
