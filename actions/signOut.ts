"use server"

import { redirect } from "next/navigation"

import { deleteSession } from "@/lib/auth/session"

export async function signOutAction(): Promise<void> {
  try {
    await deleteSession()
  } catch (error) {
    console.error("Sign out error:", error)
    throw new Error("Failed to sign out")
  } finally {
    redirect("/signin")
  }
}
