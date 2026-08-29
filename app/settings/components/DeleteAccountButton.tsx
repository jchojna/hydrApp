import { useTransition } from "react"
import { toast } from "sonner"

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
import { Button } from "@/components/ui/button"
import { deleteAccountAction } from "@/actions/settings"

export const DeleteAccountButton = () => {
  const [isDeletingAccount, startDeleteAccountTransition] = useTransition()

  const handleDeleteAccount = () => {
    startDeleteAccountTransition(async () => {
      const response = await deleteAccountAction()

      if (!response.success) {
        toast.error(response.message)
      }
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="flex-1"
          variant="destructive"
          disabled={isDeletingAccount}
        >
          {isDeletingAccount ? "Deleting..." : "Delete Account"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border-none bg-blue-200">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-blue-800">
            Delete account?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-blue-700">
            This action cannot be undone. Your account and all related data will
            be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="border-none bg-blue-100 text-blue-800"
            disabled={isDeletingAccount}
          >
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
  )
}
