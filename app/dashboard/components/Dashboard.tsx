"use client"

import { useEffect, useState } from "react"

import { Controls } from "./Controls"
import { Logo } from "@/components/Logo"
import { Sidebar } from "@/components/Sidebar"
import { cn } from "@/lib/utils"
import { Output } from "./Output"
import { waves } from "@/app/background"
import { Ruler } from "./Ruler"

type DashboardProps = {
  waterLevel: number
}

export default function Dashboard({ waterLevel }: DashboardProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [optimisticWaterLevel, setOptimisticWaterLevel] = useState(waterLevel)

  useEffect(() => {
    setOptimisticWaterLevel(waterLevel)
  }, [waterLevel])

  useEffect(() => {
    waves?.setWaterLevel(optimisticWaterLevel)
  }, [optimisticWaterLevel])

  return (
    <div className="relative flex h-full w-full flex-col justify-center">
      <header className="fixed top-0 left-0 flex w-full items-center justify-between p-8">
        <Logo className="w-[200px]" />
      </header>
      <Ruler waterLevel={optimisticWaterLevel} />
      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center transition-[width] duration-300",
          isSidebarOpen && "w-2/3",
        )}
      >
        <Output waterLevel={optimisticWaterLevel} />
        <Controls
          waterLevel={optimisticWaterLevel}
          onWaterLevelChange={setOptimisticWaterLevel}
        />
      </div>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
    </div>
  )
}
