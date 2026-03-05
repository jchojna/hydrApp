import { useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"

import { signOutAction } from "@/actions/signOut"
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

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  archiveEntries: ArchiveEntry[]
  archivePageInfo: ArchivePageInfo
}

export const Sidebar = ({
  isOpen,
  setIsOpen,
  archiveEntries,
  archivePageInfo,
}: SidebarProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSigningOut, startSignOutTransition] = useTransition()

  const navigateToArchiveOffset = (offset: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (offset <= 0) {
      params.delete("archiveOffset")
    } else {
      params.set("archiveOffset", offset.toString())
    }
    const query = params.toString()
    router.push(query ? `/dashboard?${query}` : "/dashboard")
  }

  const handleNextArchivePage = () => {
    if (!archivePageInfo.hasNextPage) return
    navigateToArchiveOffset(archivePageInfo.offset + archivePageInfo.limit)
  }

  const handlePreviousArchivePage = () => {
    if (archivePageInfo.offset <= 0) return
    navigateToArchiveOffset(
      Math.max(0, archivePageInfo.offset - archivePageInfo.limit),
    )
  }

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
          "bg-blue-dark-4 fixed top-0 right-0 flex h-full w-1/3 translate-x-full flex-col items-center justify-center transition-transform duration-300",
          isOpen && "translate-x-0",
        )}
      >
        <Accordion
          type="multiple"
          className="w-full"
          defaultValue={["notifications"]}
        >
          <AccordionItem value="archive">
            <AccordionTrigger>Archive</AccordionTrigger>
            <AccordionContent>
              <Archive
                archiveEntries={archiveEntries}
                onNext={handleNextArchivePage}
                onPrevious={handlePreviousArchivePage}
                disableNext={!archivePageInfo.hasNextPage}
                disablePrevious={archivePageInfo.offset <= 0}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="stats">
            <AccordionTrigger>Stats</AccordionTrigger>
            <AccordionContent>Stats content.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="ranking">
            <AccordionTrigger>Ranking</AccordionTrigger>
            <AccordionContent>Ranking content.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="settings">
            <AccordionTrigger>Settings</AccordionTrigger>
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
