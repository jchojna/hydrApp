import { redirect } from "next/navigation"

import SignInForm from "./SignInForm"
import { getCurrentUser } from "@/lib/dal/user"

export default async function SignIn() {
  const currentUser = await getCurrentUser()

  if (currentUser) {
    redirect("/dashboard")
  }

  return <SignInForm />
}
