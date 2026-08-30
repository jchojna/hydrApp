"use server"

import { verifyPassword } from "@/lib/auth/password"
import { createSession } from "@/lib/auth/session"
import { getUserByEmail } from "@/lib/dal/user"
import { ActionResponse } from "@/lib/types"
import { SignInInput } from "@/lib/auth/validation"

export async function signInAction(
  input: SignInInput,
): Promise<ActionResponse> {
  try {
    const user = await getUserByEmail(input.email)
    const isPasswordValid = user
      ? await verifyPassword(input.password, user.password)
      : false

    if (!user || !isPasswordValid) {
      return {
        success: false,
        message: "Invalid email or password",
      }
    }

    await createSession(user.id)

    return {
      success: true,
      message: "Signed in successfully",
      data: null,
    }
  } catch (error) {
    console.error("Sign in error:", error)
    return {
      success: false,
      message: "An error occurred while signing in",
    }
  }
}
