import { useTransition } from "react"

import { cn } from "@/lib/utils"

import { signOutAction } from "@/actions/signOut"
import { Button } from "@/components/ui/button"
import { BurgerCircleIcon } from "@/assets/svg/icons/burger-circle"
import { IconButton } from "./IconButton"

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
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
          "bg-blue-dark-4 fixed top-0 right-0 h-full w-1/3 translate-x-full transition-transform duration-300",
          isOpen && "translate-x-0",
        )}
      >
        <Button onClick={handleSignOut} disabled={isPending}>
          {isPending ? "Signing out..." : "Sign Out"}
        </Button>
      </div>
    </div>
  )
}
