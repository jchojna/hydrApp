"use server"

import { redirect } from "next/navigation"

import { deleteSession } from "@/lib/auth/session"
import { getCurrentUser } from "@/lib/dal/user"
import { unauthorizedActionResponse } from "@/lib/errors"
import { ActionResponse } from "@/lib/types"

export async function signOutAction(): Promise<ActionResponse> {
  const user = await getCurrentUser()
  if (!user) return unauthorizedActionResponse

  try {
    await deleteSession()
  } catch (error) {
    console.error("Sign out error:", error)
    throw new Error("Failed to sign out")
  } finally {
    redirect("/signin")
  }
}
