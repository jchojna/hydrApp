"use server"

import { deleteSession } from "@/lib/auth/session"
import { redirect } from "next/navigation"

export async function signOut(): Promise<void> {
  try {
    await deleteSession()
  } catch (error) {
    console.error("Sign out error:", error)
    throw new Error("Failed to sign out")
  } finally {
    redirect("/signin")
  }
}
