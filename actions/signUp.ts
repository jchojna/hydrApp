"use server"

import { z } from "zod"

import { createSession } from "@/lib/auth/session"
import { createUser } from "@/lib/auth/user"
import { getUserByEmail } from "@/lib/dal"
import { ActionResponse } from "./types"

const SignUpSchema = z
  .object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export type SignUpData = z.infer<typeof SignUpSchema>

export async function signUp(formData: FormData): Promise<ActionResponse> {
  try {
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    }

    const validationResult = SignUpSchema.safeParse(data)
    if (!validationResult.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    const existingUser = await getUserByEmail(data.email)
    if (existingUser) {
      return {
        success: false,
        message: "User with this email already exists",
        errors: {
          email: ["User with this email already exists"],
        },
      }
    }

    const user = await createUser(data.email, data.password)
    if (!user) {
      return {
        success: false,
        message: "Failed to create user",
        error: "Failed to create user",
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
      error: "Failed to create account",
    }
  }
}
