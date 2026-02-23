import { cache } from "react"
import { cookies } from "next/headers"

import { createAuthToken, verifyAuthToken } from "./jwt"

const AUTH_COOKIE_NAME = "hydrapp_auth_token"

// Create a session using JWT
export async function createSession(userId: string) {
  try {
    // Create JWT with user data
    const token = await createAuthToken({ userId })

    // Store JWT in a cookie
    const cookieStore = await cookies()
    cookieStore.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
      sameSite: "lax",
    })

    return true
  } catch (error) {
    console.error("Error creating session:", error)
    return false
  }
}

// Get current session from JWT
export const getSession = cache(async () => {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value

    if (!token) return null
    const payload = await verifyAuthToken(token)

    return payload ? { userId: payload.userId } : null
  } catch (error) {
    // Handle the specific prerendering error
    if (
      error instanceof Error &&
      error.message.includes("During prerendering, `cookies()` rejects")
    ) {
      console.log(
        "Cookies not available during prerendering, returning null session",
      )
      return null
    }

    console.error("Error getting session:", error)
    return null
  }
})

// Delete session by clearing the JWT cookie
export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE_NAME)
}
