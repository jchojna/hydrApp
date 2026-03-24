"use client"

import { useEffect, useState } from "react"

import { Controls } from "./Controls"
import { Logo } from "@/components/Logo"
import { Sidebar } from "@/components/Sidebar"
import { cn } from "@/lib/utils"
import { Output } from "./Output"
import { waves } from "@/app/background"
import { Ruler } from "@/app/dashboard/components/ruler"
import { ArchiveEntry, ArchivePageInfo, UserSettings } from "@/lib/types"

type DashboardProps = {
  waterLevel: number
  averageWaterLevel: number
  archiveEntries: ArchiveEntry[]
  archivePageInfo: ArchivePageInfo
  userSettings: UserSettings
}

export default function Dashboard({
  waterLevel,
  averageWaterLevel,
  archiveEntries,
  archivePageInfo,
  userSettings,
}: DashboardProps) {
  // TODO: use context for storing user settings
  const glassVolume = userSettings.glassVolume
  const maxWaterPerDay = userSettings.maxWaterPerDay
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [optimisticWaterLevel, setOptimisticWaterLevel] = useState(waterLevel)

  useEffect(() => {
    setOptimisticWaterLevel(waterLevel)
  }, [waterLevel])

  useEffect(() => {
    waves?.setMaxWaterPerDay(maxWaterPerDay)
  }, [maxWaterPerDay])

  useEffect(() => {
    waves?.setWaterLevel(optimisticWaterLevel)
  }, [optimisticWaterLevel])

  return (
    <div className="relative flex h-full w-full flex-col justify-center">
      <header
        className={cn(
          "fixed top-0 left-0 flex w-full items-center justify-center p-8 transition-[width] duration-300",
          isSidebarOpen && "w-2/3",
        )}
      >
        <Logo className="w-[200px]" />
      </header>
      <Ruler
        waterLevel={optimisticWaterLevel}
        averageWaterLevel={averageWaterLevel}
        glassVolume={glassVolume}
        maxWaterPerDay={maxWaterPerDay}
      />
      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center transition-[width] duration-300",
          isSidebarOpen && "w-2/3",
        )}
      >
        <Output
          waterLevel={optimisticWaterLevel}
          glassVolume={glassVolume}
          maxWaterPerDay={maxWaterPerDay}
        />
        <Controls
          waterLevel={optimisticWaterLevel}
          onWaterLevelChange={setOptimisticWaterLevel}
          glassVolume={glassVolume}
          maxWaterPerDay={maxWaterPerDay}
        />
      </div>
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        archiveEntries={archiveEntries}
        archivePageInfo={archivePageInfo}
        averageWaterLevel={averageWaterLevel}
        userSettings={userSettings}
      />
    </div>
  )
}
