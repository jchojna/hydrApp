"use client"

import { useCallback, useState, useTransition } from "react"
import { useRouter } from "next/navigation"

import { waves } from "./background"
import { Button } from "@/components/ui/button"
import { signOutAction } from "@/actions/signOut"

export default function Home() {
  const [isIntro, setIsIntro] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleStart = useCallback(() => {
    setIsIntro(false)
    waves?.logo.hideLogo()
    waves?.fadeOut()
    router.push("/signin")
  }, [router])

  const handleSignOut = () => {
    startTransition(async () => {
      await signOutAction()
    })
  }

  return (
    <div>
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
      <Button onClick={handleSignOut} disabled={isPending}>
        {isPending ? "Signing out..." : "Sign Out"}
      </Button>
    </div>
  )
}
