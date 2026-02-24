"use client"

import { useState, useTransition } from "react"

import { signOutAction } from "@/actions/signOut"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/Logo"
import { IconButton } from "@/components/IconButton"
import { BurgerButton } from "@/components/BurgerButton"

export default function Dashboard() {
  const [isPending, startTransition] = useTransition()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleSignOut = () => {
    startTransition(async () => {
      await signOutAction()
    })
  }

  return (
    <div>
      <header className="fixed top-0 left-0 flex w-full items-center justify-between p-8">
        <Logo className="w-[200px]" />
        <BurgerButton onClick={() => setIsSidebarOpen((prev) => !prev)} />
      </header>
      <Button onClick={handleSignOut} disabled={isPending}>
        {isPending ? "Signing out..." : "Sign Out"}
      </Button>
    </div>
  )
}
