"use client"

import { useEffect, useState } from "react"

import { Sidebar } from "@/components/Sidebar"
import { cn } from "@/lib/utils"
import { Output } from "./Output"
import { waves } from "@/app/background"
import { Ruler } from "@/app/[lng]/dashboard/components/ruler"
import { ArchiveEntry, ArchivePageInfo, UserSettings } from "@/lib/types"
import { SettingsProvider, useSettings } from "@/providers/SettingsContext"
import { Header } from "./header"

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
  return (
    <SettingsProvider initialSettings={userSettings}>
      <DashboardContent
        waterLevel={waterLevel}
        averageWaterLevel={averageWaterLevel}
        archiveEntries={archiveEntries}
        archivePageInfo={archivePageInfo}
      />
    </SettingsProvider>
  )
}

type DashboardContentProps = Omit<DashboardProps, "userSettings">

function DashboardContent({
  waterLevel,
  averageWaterLevel,
  archiveEntries,
  archivePageInfo,
}: DashboardContentProps) {
  const {
    settings: { maxWaterPerDay },
  } = useSettings()
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
    <div className="flex h-full w-full flex-col justify-center">
      <div
        className={cn(
          "relative h-full w-full overflow-hidden transition-[width] duration-300",
          isSidebarOpen &&
            "w-0 md:w-[calc(100%-400px)] lg:w-[calc(100%-500px)]",
        )}
      >
        <Ruler
          waterLevel={optimisticWaterLevel}
          averageWaterLevel={averageWaterLevel}
        />
        <div
          className={cn(
            "relative flex h-full w-full flex-col items-center p-2",
          )}
        >
          <Header
            waterLevel={optimisticWaterLevel}
            onWaterLevelChange={setOptimisticWaterLevel}
            isSidebarOpen={isSidebarOpen}
            onSidebarOpenChange={setIsSidebarOpen}
          />
          <Output waterLevel={optimisticWaterLevel} />
        </div>
      </div>
      <Sidebar
        isOpen={isSidebarOpen}
        archiveEntries={archiveEntries}
        archivePageInfo={archivePageInfo}
        averageWaterLevel={averageWaterLevel}
      />
    </div>
  )
}
