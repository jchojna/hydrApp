"use client"

import { useEffect, useState, useTransition } from "react"

import { signOutAction } from "@/actions/signOut"
import {
  getUserSettingsAction,
  saveUserSettingAction,
} from "@/actions/settings"
import { ArrowDownIcon } from "@/assets/svg/icons/arrow-down"
import { ArrowUpIcon } from "@/assets/svg/icons/arrow-up"
import { IconButton } from "@/components/IconButton"
import { PaginationHeader } from "@/components/PaginationHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { GLASS_VOLUME, MAX_WATER_PER_DAY } from "@/lib/constants"
import { UserSettings } from "@/lib/types"
import { Setting } from "./components/Setting"

const DEFAULT_USER_SETTINGS: UserSettings = {
  username: "",
  age: 18,
  sex: "male",
  maxWaterPerDay: MAX_WATER_PER_DAY,
  glassVolume: GLASS_VOLUME,
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

const formatLitres = (value: string) => `${value} L`

const NumberEditor = ({
  value,
  onChange,
  min,
  max,
  step,
  isSaving,
}: {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  isSaving: boolean
}) => {
  return (
    <div className="flex items-center justify-end gap-1">
      <Input
        type="number"
        className="h-8 w-20 text-right"
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={isSaving}
        onChange={(event) => {
          const parsedValue = Number(event.target.value)
          if (Number.isNaN(parsedValue)) return

          onChange(clamp(parsedValue, min, max))
        }}
      />
      <IconButton
        className="h-6 w-6"
        icon={<ArrowDownIcon />}
        onClick={() => onChange(clamp(value - step, min, max))}
        disabled={isSaving || value <= min}
      />
      <IconButton
        className="h-6 w-6"
        icon={<ArrowUpIcon />}
        onClick={() => onChange(clamp(value + step, min, max))}
        disabled={isSaving || value >= max}
      />
    </div>
  )
}

export default function Settings() {
  const [isSigningOut, startSignOutTransition] = useTransition()
  const [isDeletingAccount, startDeleteAccountTransition] = useTransition()
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS)
  const [isLoadingSettings, setIsLoadingSettings] = useState(true)

  useEffect(() => {
    let isCancelled = false

    const loadSettings = async () => {
      const response = await getUserSettingsAction()

      if (!isCancelled && response.success) {
        setSettings(response.data)
      }

      if (!isCancelled) {
        setIsLoadingSettings(false)
      }
    }

    loadSettings()

    return () => {
      isCancelled = true
    }
  }, [])

  const handleSignOut = () => {
    startSignOutTransition(async () => {
      await signOutAction()
    })
  }

  const handleDeleteAccount = () => {
    startDeleteAccountTransition(async () => {
      // await deleteAccountAction() // TODO: implement
    })
  }

  return (
    <div className="flex w-full max-w-[400px] flex-col gap-4">
      <PaginationHeader title="Settings" />

      <ul className="flex flex-col gap-2 text-sm">
        <Setting
          label="Username"
          value={settings.username}
          renderValue={(value) => (
            <div className="text-blue-light-2 truncate text-right">
              {value || "Not set"}
            </div>
          )}
          renderEditor={({ value, setValue, isSaving }) => (
            <Input
              value={value}
              className="h-8"
              disabled={isSaving}
              onChange={(event) => setValue(event.target.value)}
            />
          )}
          onSave={async (value) => {
            const response = await saveUserSettingAction({
              key: "username",
              value,
            })

            if (!response.success) return false

            setSettings(response.data)
            return true
          }}
        />

        <Setting
          label="Age"
          value={settings.age}
          renderValue={(value) => (
            <div className="text-blue-light-2 text-right">{value}</div>
          )}
          renderEditor={({ value, setValue, isSaving }) => (
            <NumberEditor
              value={value}
              onChange={(nextValue) => setValue(Math.round(nextValue))}
              min={0}
              max={130}
              step={1}
              isSaving={isSaving}
            />
          )}
          onSave={async (value) => {
            const response = await saveUserSettingAction({
              key: "age",
              value,
            })

            if (!response.success) return false

            setSettings(response.data)
            return true
          }}
        />

        <Setting
          label="Sex"
          value={settings.sex}
          renderValue={(value) => (
            <div className="text-blue-light-2 text-right capitalize">
              {value}
            </div>
          )}
          renderEditor={({ value, setValue, isSaving }) => (
            <Select
              value={value}
              onValueChange={(nextValue) => {
                if (
                  nextValue === "male" ||
                  nextValue === "female" ||
                  nextValue === "other"
                ) {
                  setValue(nextValue)
                }
              }}
              disabled={isSaving}
            >
              <SelectTrigger className="h-8 w-full rounded-full text-right capitalize">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          )}
          onSave={async (value) => {
            const response = await saveUserSettingAction({
              key: "sex",
              value,
            })

            if (!response.success) return false

            setSettings(response.data)
            return true
          }}
        />

        <Setting
          label="Max Water / Day"
          value={settings.maxWaterPerDay}
          renderValue={(value) => (
            <div className="text-blue-light-2 text-right">
              {formatLitres(value)}
            </div>
          )}
          renderEditor={({ value, setValue, isSaving }) => (
            <NumberEditor
              value={value}
              onChange={setValue}
              min={0}
              max={10}
              step={0.25}
              isSaving={isSaving}
            />
          )}
          onSave={async (value) => {
            const response = await saveUserSettingAction({
              key: "maxWaterPerDay",
              value,
            })

            if (!response.success) return false

            setSettings(response.data)
            return true
          }}
        />

        <Setting
          label="Glass Volume"
          value={settings.glassVolume}
          renderValue={(value) => (
            <div className="text-blue-light-2 text-right">
              {formatLitres(value)}
            </div>
          )}
          renderEditor={({ value, setValue, isSaving }) => (
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-blue-light-2 text-right text-xs">
                {formatLitres(value)}
              </span>
              <Slider
                min={0}
                max={2}
                step={0.05}
                value={[value]}
                disabled={isSaving}
                onValueChange={(newValue) => {
                  if (!newValue.length) return

                  setValue(clamp(newValue[0], 0, 2))
                }}
              />
            </div>
          )}
          onSave={async (value) => {
            const response = await saveUserSettingAction({
              key: "glassVolume",
              value,
            })

            if (!response.success) return false

            setSettings(response.data)
            return true
          }}
        />

        {isLoadingSettings ? (
          <li className="text-blue-light-2 text-center">
            Loading settings...
          </li>
        ) : null}
      </ul>

      <div className="flex w-full items-center gap-2">
        <Button
          className="flex-1"
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? "Signing out..." : "Sign Out"}
        </Button>
        <Button
          className="bg-destructive/50 hover:bg-destructive flex-1 text-white"
          onClick={handleDeleteAccount}
          disabled={isDeletingAccount}
        >
          {isDeletingAccount ? "Deleting..." : "Delete Account"}
        </Button>
      </div>
    </div>
  )
}
