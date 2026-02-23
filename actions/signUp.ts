"use server"

import { createSession } from "@/lib/auth/session"
import { createUser } from "@/lib/auth/user"
import { getUserByEmail } from "@/lib/dal"
import { ActionResponse } from "./types"
import { SignUpInput } from "@/lib/validations/auth"

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
    if (!user) {
      return {
        success: false,
        message: "Failed to create user",
      }
    }

    await createSession(user.id)

    return {
      success: true,
      message: "Account created successfully",
    }
  } catch (error) {
    console.error("Sign up error:", error)
    return {
      success: false,
      message: "An error occurred while creating your account",
    }
  }
}
