"use client"

import { useTransition } from "react"

import { signOutAction } from "@/actions/signOut"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import {
  AgeSetting,
  GlassVolumeSetting,
  MaxWaterPerDaySetting,
  SexSetting,
  UsernameSetting,
} from "./components/settings"
import { SidebarSection } from "@/components/SidebarSection"
import { DeleteAccountButton } from "./components/DeleteAccountButton"

export default function Settings() {
  const [isSigningOut, startSignOutTransition] = useTransition()

  const handleSignOut = () => {
    startSignOutTransition(async () => {
      await signOutAction()
    })
  }

  return (
    <SidebarSection>
      <ul className="flex flex-col gap-2 text-sm">
        <UsernameSetting />
        <AgeSetting />
        <SexSetting />
        <MaxWaterPerDaySetting />
        <GlassVolumeSetting />
      </ul>

      <div className="flex w-full items-center gap-2">
        <Button
          className="flex-1"
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? "Signing out..." : "Sign Out"}
        </Button>
        <DeleteAccountButton />
      </div>
      <Toaster position="bottom-right" richColors closeButton />
    </SidebarSection>
  )
}
