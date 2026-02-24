import { redirect } from "next/navigation"

import { getSession } from "@/lib/auth/session"
import SignUpForm from "./SignUpForm"

export default async function SignUp() {
  const session = await getSession()

  if (session) {
    redirect("/dashboard")
  }

  return <SignUpForm />
}
