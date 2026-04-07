"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"

import { waves } from "../background"
import { Button } from "@/components/ui/button"
import { useT } from "next-i18next/client"

export default function Home() {
  const router = useRouter()
  const { t } = useT()

  const handleStart = useCallback(() => {
    waves?.logo.hideLogo()
    waves?.fadeOut()
    router.push("/signin")
  }, [router])

  return (
    <div>
      <Button onClick={handleStart}>{t("app.home.startButton")}</Button>
    </div>
  )
}
