"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { cn } from "@/lib/utils"

import { getStatsDataAction } from "@/actions/stats"
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
import { GlassContainer } from "./GlassContainer"

interface SidebarProps {
  isOpen: boolean | null
  archiveEntries: ArchiveEntry[]
  archivePageInfo: ArchivePageInfo
  averageWaterLevel: number
}

const AccordionHeader = ({ title }: { title: string }) => {
  return (
    <AccordionTrigger className="text-blue-100 transition-colors duration-200 hover:bg-blue-500/30">
      <ChevronDown className="pointer-events-none size-10 shrink-0 translate-y-0.5 text-inherit transition-transform duration-200" />
      <div className="font-mnedium w-full text-4xl">{title}</div>
    </AccordionTrigger>
  )
}

export const Sidebar = ({
  isOpen,
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
    <div
      className={cn(
        "pointer-events-none fixed top-0 right-0 h-full w-full p-2 pt-20",
        "md:max-w-[400px] md:p-2 lg:max-w-[500px]",
      )}
    >
      <div className="h-full overflow-hidden">
        <GlassContainer
          className={cn(
            "flex h-full w-full translate-x-full items-start overflow-auto rounded-2xl bg-blue-600/20 shadow-none",
            "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            "pointer-events-auto transition-transform duration-300",
            isOpen !== false && "md:translate-x-0",
            isOpen === true && "translate-x-0",
          )}
        >
          <Accordion
            type="multiple"
            className="my-auto w-full"
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
                <Ranking
                  ranking={ranking}
                  isLoading={isLoading}
                  error={error}
                />
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
        </GlassContainer>
      </div>
    </div>
  )
}
