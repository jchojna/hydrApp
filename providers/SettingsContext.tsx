"use client"

import { createContext, useContext, useMemo, useState } from "react"
import type { PropsWithChildren } from "react"

import type { UserSettings } from "@/lib/types"

type SettingsContextValue = {
  settings: UserSettings
  setSettings: (nextSettings: UserSettings) => void
}

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined,
)

type SettingsProviderProps = {
  initialSettings: UserSettings
}

export function SettingsProvider({
  children,
  initialSettings,
}: PropsWithChildren<SettingsProviderProps>) {
  const [settings, setSettings] = useState<UserSettings>(initialSettings)

  const value = useMemo(
    () => ({
      settings,
      setSettings,
    }),
    [settings],
  )

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext)

  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider")
  }

  return context
}
