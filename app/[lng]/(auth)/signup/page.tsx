import { redirect } from "next/navigation"

import SignUpForm from "./SignUpForm"
import { getCurrentUser } from "@/lib/dal/user"

export default async function SignUp() {
  const currentUser = await getCurrentUser()

  if (currentUser) {
    redirect("/dashboard")
  }

  return <SignUpForm />
}
