"use client"

import { useTransition } from "react"

import { signOutAction } from "@/actions/signOut"
import { PaginationHeader } from "@/components/PaginationHeader"
import { Button } from "@/components/ui/button"

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
    <div className="flex w-full max-w-[400px] flex-col gap-4">
      <PaginationHeader title="Settings" />
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
    </div>
  )
}
