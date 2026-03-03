"use client"

import { useEffect, useState } from "react"

import { Controls } from "./Controls"
import { Logo } from "@/components/Logo"
import { Sidebar } from "@/components/Sidebar"
import { cn } from "@/lib/utils"
import { Output } from "./Output"
import { waves } from "@/app/background"

type DashboardProps = {
  waterLevel: number
}

export default function Dashboard({ waterLevel }: DashboardProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    waves?.setWaterLevel(waterLevel)
  }, [waterLevel])

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
        <Controls waterLevel={waterLevel} />
      </div>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
    </div>
  )
}
