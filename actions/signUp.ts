"use server"

import { createSession } from "@/lib/auth/session"
import { createUser } from "@/lib/auth/user"
import { getUserByEmail } from "@/lib/dal/user"
import { ActionResponse } from "@/lib/types"
import { SignUpInput } from "@/lib/auth/validation"
import { unauthorizedActionResponse } from "@/lib/errors"

export async function signUpAction(
  input: SignUpInput,
): Promise<ActionResponse> {
  try {
    const existingUser = await getUserByEmail(input.email)
    if (existingUser) {
      return {
        success: false,
        message: "User with this email already exists",
      }
    }

    const user = await createUser(input.email, input.password)
    if (!user) return unauthorizedActionResponse

    await createSession(user.id)

    return {
      success: true,
      message: "Account created successfully",
      data: null,
    }
  } catch (error) {
    console.error("Sign up error:", error)
    return {
      success: false,
      message: "An error occurred while creating your account",
    }
  }
}
