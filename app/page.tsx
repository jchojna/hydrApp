"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"

import { waves } from "./background"
import { Button } from "@/components/ui/button"

export default function Home() {
  const router = useRouter()

  const handleStart = useCallback(() => {
    waves?.logo.hideLogo()
    waves?.fadeOut()
    router.push("/signin")
  }, [router])

  return (
    <div>
      <Button onClick={handleStart}>Start</Button>
    </div>
  )
}
