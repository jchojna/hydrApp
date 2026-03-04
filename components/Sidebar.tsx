import { useTransition } from "react"

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
import { ArchiveEntry } from "@/lib/types"

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  archiveEntries: ArchiveEntry[]
}

export const Sidebar = ({
  isOpen,
  setIsOpen,
  archiveEntries,
}: SidebarProps) => {
  const [isPending, startTransition] = useTransition()

  const handleSignOut = () => {
    startTransition(async () => {
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
              {archiveEntries.length ? (
                <div className="flex flex-col gap-2 text-sm">
                  {archiveEntries.map((entry) => (
                    <div
                      key={entry.date}
                      className="text-blue-light-1 flex items-center justify-between"
                    >
                      <span>{entry.date}</span>
                      <span>{entry.amount}</span>
                    </div>
                  ))}
                </div>
              ) : (
                "No archive entries."
              )}
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
              <Button onClick={handleSignOut} disabled={isPending}>
                {isPending ? "Signing out..." : "Sign Out"}
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
