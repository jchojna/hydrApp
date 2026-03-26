"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { cn } from "@/lib/utils"

import { getStatsDataAction } from "@/actions/stats"
import { BurgerCircleIcon } from "@/assets/svg/icons/burger-circle"
import { IconButton } from "./IconButton"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion"
import { ArchiveEntry, ArchivePageInfo } from "@/lib/types"
import Archive from "@/app/archive"
import Stats from "@/app/stats"
import Ranking from "@/app/ranking"
import Settings from "@/app/settings"
import { getRanking } from "@/lib/utils/getRanking"
import { useSettings } from "@/providers/SettingsContext"
import { ChevronDown } from "lucide-react"

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  archiveEntries: ArchiveEntry[]
  archivePageInfo: ArchivePageInfo
  averageWaterLevel: number
}

const AccordionHeader = ({ title }: { title: string }) => {
  return (
    <AccordionTrigger className="text-blue-light-2">
      <ChevronDown className="pointer-events-none size-10 shrink-0 translate-y-0.5 text-inherit transition-transform duration-200" />
      <div className="font-mnedium w-full text-4xl">{title}</div>
    </AccordionTrigger>
  )
}

export const Sidebar = ({
  isOpen,
  setIsOpen,
  archiveEntries,
  archivePageInfo,
  averageWaterLevel,
}: SidebarProps) => {
  const [openItems, setOpenItems] = useState<string[]>([])
  const {
    settings: { maxWaterPerDay },
  } = useSettings()

  const isStatsOpen = openItems.includes("stats")
  const isRankingOpen = openItems.includes("ranking")

  const { data, isLoading, error } = useQuery({
    queryKey: ["stats"],
    enabled: isStatsOpen || isRankingOpen,
    queryFn: async () => {
      const response = await getStatsDataAction()
      if (!response.success) {
        throw new Error(response.message)
      }
      return response.data
    },
  })

  const ranking = getRanking(data?.totals, maxWaterPerDay)

  return (
    <div className="absolute top-0 right-0 z-10">
      <div className="relative z-50 p-8">
        <IconButton
          icon={<BurgerCircleIcon />}
          className={cn(isOpen && "rotate-180 transform")}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      <div
        className={cn(
          "bg-blue-dark-4 fixed top-0 right-0 flex h-full w-full translate-x-full flex-col items-center overflow-auto py-[calc((100vh-400px)/2)] transition-transform duration-300 md:max-w-[400px] lg:max-w-[500px]",
          isOpen && "translate-x-0",
        )}
      >
        <Accordion
          type="multiple"
          className="w-full"
          value={openItems}
          onValueChange={setOpenItems}
        >
          {/* Archive */}
          <AccordionItem value="archive">
            <AccordionHeader title="Archive" />
            <AccordionContent>
              <Archive entries={archiveEntries} pageInfo={archivePageInfo} />
            </AccordionContent>
          </AccordionItem>
          {/* Stats */}
          <AccordionItem value="stats">
            <AccordionHeader title="Stats" />
            <AccordionContent>
              <Stats
                averageWaterLevel={averageWaterLevel}
                records={data?.records}
                ranking={ranking}
                isLoading={isLoading}
                error={error}
              />
            </AccordionContent>
          </AccordionItem>
          {/* Ranking */}
          <AccordionItem value="ranking">
            <AccordionHeader title="Ranking" />
            <AccordionContent>
              <Ranking ranking={ranking} isLoading={isLoading} error={error} />
            </AccordionContent>
          </AccordionItem>
          {/* Settings */}
          <AccordionItem value="settings">
            <AccordionHeader title="Settings" />
            <AccordionContent>
              <Settings />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
