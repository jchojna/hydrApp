import { SignJWT, jwtVerify } from "jose"

import { getRequiredEnv } from "@/lib/env"

export const AUTH_COOKIE_NAME = "hydrapp_auth"
const AUTH_EXPIRATION = "7d" // 7 days - JWT expiration time
const AUTH_MAX_AGE_SECONDS = 60 * 60 * 24 * 7
const secret = new TextEncoder().encode(getRequiredEnv("JWT_SECRET"))

export type AuthTokenPayload = {
  userId: string
  [key: string]: string | number | boolean | null | undefined
}

// Generate a JWT token
export async function createAuthToken(payload: AuthTokenPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(AUTH_EXPIRATION)
    .sign(secret)
}

// Verify a JWT token
export async function verifyAuthToken(
  token: string,
): Promise<AuthTokenPayload | null> {
  try {
    const { payload } = await jwtVerify<AuthTokenPayload>(token, secret)
    return payload
  } catch (error) {
    console.error("JWT verification failed:", error)
    return null
  }
}

export function getAuthCookieConfig(): {
  httpOnly: true
  secure: boolean
  sameSite: "lax"
  path: string
  maxAge: number
} {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: AUTH_MAX_AGE_SECONDS,
  }
}

// Check if token needs refresh
export async function shouldRefreshToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      clockTolerance: 15, // 15 seconds tolerance for clock skew
    })

    // Get expiration time
    const exp = payload.exp as number
    const now = Math.floor(Date.now() / 1000)

    // If token expires within the threshold, refresh it
    return exp - now < AUTH_MAX_AGE_SECONDS
  } catch {
    // If verification fails, token is invalid or expired
    return false
  }
}
