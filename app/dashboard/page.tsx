"use client"

import { useTransition } from "react"

import { signOutAction } from "@/actions/signOut"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/Logo"
import { Sidebar } from "@/components/Sidebar"

export default function Dashboard() {
  const [isPending, startTransition] = useTransition()

  const handleSignOut = () => {
    startTransition(async () => {
      await signOutAction()
    })
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center">
      <header className="fixed top-0 left-0 flex w-full items-center justify-between p-8">
        <Logo className="w-[200px]" />
      </header>
      <Sidebar />
      <Button onClick={handleSignOut} disabled={isPending}>
        {isPending ? "Signing out..." : "Sign Out"}
      </Button>
    </div>
  )
}
