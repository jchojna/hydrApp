"use client"

import { useTransition } from "react"
import { toast } from "sonner"

import { signOutAction } from "@/actions/signOut"
import { deleteAccountAction } from "@/actions/settings"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Toaster } from "@/components/ui/sonner"
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
      const response = await deleteAccountAction()

      if (!response.success) {
        toast.error(response.message)
      }
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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="bg-destructive/50 hover:bg-destructive flex-1 text-white"
              disabled={isDeletingAccount}
            >
              {isDeletingAccount ? "Deleting..." : "Delete Account"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete account?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Your account and all related data
                will be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeletingAccount}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount}
              >
                {isDeletingAccount ? "Deleting..." : "Delete Account"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Toaster position="bottom-right" richColors closeButton />
    </SidebarSection>
  )
}
