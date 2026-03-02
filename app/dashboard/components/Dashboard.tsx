"use client"

import { useState } from "react"

import { Controls } from "./Controls"
import { Logo } from "@/components/Logo"
import { Sidebar } from "@/components/Sidebar"
import { cn } from "@/lib/utils"
import { Output } from "./Output"
import { TOTAL_WATER_LEVELS } from "@/app/background/waves"

type DashboardProps = {
  waterLevel: number
}

export default function Dashboard({ waterLevel }: DashboardProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="relative flex h-full w-full flex-col justify-center">
      <header className="fixed top-0 left-0 flex w-full items-center justify-between p-8">
        <Logo className="w-[200px]" />
      </header>
      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center transition-[width] duration-300",
          isSidebarOpen && "w-2/3",
        )}
      >
        <Output waterLevel={waterLevel} />
        <Controls
          waterLevel={waterLevel}
          totalWaterLevels={TOTAL_WATER_LEVELS}
        />
      </div>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
    </div>
  )
}
