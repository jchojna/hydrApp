"use client"

import { Controls } from "./components/Controls"
import { Logo } from "@/components/Logo"
import { Sidebar } from "@/components/Sidebar"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Output } from "./components/Output"
import { TOTAL_WATER_LEVELS } from "../background/waves"

export default function Dashboard() {
  const [waterLevel, setWaterLevel] = useState(0)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="relative flex h-full w-full flex-col justify-center">
      <header className="fixed top-0 left-0 flex w-full items-center justify-between p-8">
        <Logo className="w-[200px]" />
      </header>
      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center border border-red-500 transition-[width] duration-300",
          isSidebarOpen && "w-2/3",
        )}
      >
        <Output waterLevel={waterLevel} />
        <Controls
          waterLevel={waterLevel}
          totalWaterLevels={TOTAL_WATER_LEVELS}
          setWaterLevel={setWaterLevel}
        />
      </div>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
    </div>
  )
}
