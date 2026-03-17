"use client"

import { useState, useTransition } from "react"
import { useQuery } from "@tanstack/react-query"

import { cn } from "@/lib/utils"

import { signOutAction } from "@/actions/signOut"
import { getStatsDataAction } from "@/actions/stats"
import { Button } from "@/components/ui/button"
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
import { PlusCrossIcon } from "@/assets/svg/icons/plus-cross"
import Stats from "@/app/stats"

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
      <div className="font-mnedium w-full text-center text-4xl">{title}</div>
      <PlusCrossIcon className="pointer-events-none size-10 shrink-0 translate-y-0.5 text-inherit transition-transform duration-200" />
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
  const [isSigningOut, startSignOutTransition] = useTransition()
  const [openItems, setOpenItems] = useState<string[]>([])

  const isStatsOpen = openItems.includes("stats")
  const statsQuery = useQuery({
    queryKey: ["stats"],
    enabled: isStatsOpen,
    queryFn: async () => {
      const response = await getStatsDataAction()
      if (!response.success) {
        throw new Error(response.message)
      }
      return response.data
    },
  })

  const handleSignOut = () => {
    startSignOutTransition(async () => {
      await signOutAction()
    })
  }

  return (
    <div className="absolute top-0 right-0">
      <div className="relative z-50 p-8">
        <IconButton
          icon={<BurgerCircleIcon />}
          className={cn(isOpen && "rotate-180 transform")}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      <div
        className={cn(
          "bg-blue-dark-4 fixed top-0 right-0 flex h-full w-1/3 translate-x-full flex-col items-center justify-center overflow-auto transition-transform duration-300",
          isOpen && "translate-x-0",
        )}
      >
        <Accordion
          type="multiple"
          className="w-full"
          value={openItems}
          onValueChange={setOpenItems}
        >
          <AccordionItem value="archive">
            <AccordionHeader title="Archive" />
            <AccordionContent>
              <Archive entries={archiveEntries} pageInfo={archivePageInfo} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="stats">
            <AccordionHeader title="Stats" />
            <AccordionContent>
              {statsQuery.isLoading && <div>Loading stats...</div>}
              {statsQuery.isError && (
                <div className="text-red-200">
                  Error:{" "}
                  {statsQuery.error instanceof Error
                    ? statsQuery.error.message
                    : "Failed to load stats"}
                </div>
              )}
              {statsQuery.isSuccess && (
                <Stats
                  averageWaterLevel={averageWaterLevel}
                  records={statsQuery.data.records}
                  totals={statsQuery.data.totals}
                />
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="ranking">
            <AccordionHeader title="Ranking" />
            <AccordionContent>Ranking content.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="settings">
            <AccordionHeader title="Settings" />
            <AccordionContent>
              <Button onClick={handleSignOut} disabled={isSigningOut}>
                {isSigningOut ? "Signing out..." : "Sign Out"}
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
