import { redirect } from "next/navigation"

import { getSession } from "@/lib/auth/session"
import SignInForm from "./SignInForm"

export default async function SignIn() {
  const session = await getSession()

  if (session) {
    redirect("/dashboard")
  }

  return <SignInForm />
}
