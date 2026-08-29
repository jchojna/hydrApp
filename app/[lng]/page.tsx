import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/dal/user"

export default async function Home() {
  const currentUser = await getCurrentUser()

  redirect(currentUser ? "/dashboard" : "/signin")
}
