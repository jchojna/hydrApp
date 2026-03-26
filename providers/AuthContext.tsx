"use client"

import { createContext, useContext } from "react"
import type { PropsWithChildren } from "react"

import type { AuthUser } from "@/lib/auth/types"

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

type AuthProviderProps = {
  user: AuthUser | null
}

export function AuthProvider({
  children,
  user,
}: PropsWithChildren<AuthProviderProps>) {
  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }

  return context
}
