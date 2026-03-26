"use client"

import { useTransition } from "react"

import { signOutAction } from "@/actions/signOut"
import { Button } from "@/components/ui/button"
import {
  AgeSetting,
  GlassVolumeSetting,
  MaxWaterPerDaySetting,
  SexSetting,
  UsernameSetting,
} from "./components/settings"
import { SidebarSection } from "@/components/SidebarSection"

export default function Settings() {
  const [isSigningOut, startSignOutTransition] = useTransition()
  const [isDeletingAccount, startDeleteAccountTransition] = useTransition()

  const handleSignOut = () => {
    startSignOutTransition(async () => {
      await signOutAction()
    })
  }

  const handleDeleteAccount = () => {
    startDeleteAccountTransition(async () => {
      // await deleteAccountAction() // TODO: implement
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
        <Button
          className="bg-destructive/50 hover:bg-destructive flex-1 text-white"
          onClick={handleDeleteAccount}
          disabled={isDeletingAccount}
        >
          {isDeletingAccount ? "Deleting..." : "Delete Account"}
        </Button>
      </div>
    </SidebarSection>
  )
}
