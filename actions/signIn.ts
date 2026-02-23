"use server"

import { verifyPassword } from "@/lib/auth/password"
import { createSession } from "@/lib/auth/session"
import { getUserByEmail } from "@/lib/dal"
import { ActionResponse } from "./types"
import { SignInInput } from "@/lib/validations/auth"

export async function signInAction(
  input: SignInInput,
): Promise<ActionResponse> {
  try {
    const user = await getUserByEmail(input.email)
    if (!user) {
      return {
        success: false,
        message: "Invalid email or password",
      }
    }

    const isPasswordValid = await verifyPassword(input.password, user.password)
    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid email or password",
      }
    }

    await createSession(user.id)

    return {
      success: true,
      message: "Signed in successfully",
    }
  } catch (error) {
    console.error("Sign in error:", error)
    return {
      success: false,
      message: "An error occurred while signing in",
    }
  }
}
