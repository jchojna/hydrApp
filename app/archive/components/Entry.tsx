import { useEffect, useState, useTransition } from "react"
import { useQueryClient } from "@tanstack/react-query"

import { EmojiIcon } from "@/components/EmojiIcon"
import { ArchiveEntry } from "@/lib/types"
import { EditIcon } from "@/assets/svg/icons/edit"
import { ArrowDownIcon } from "@/assets/svg/icons/arrow-down"
import { ArrowUpIcon } from "@/assets/svg/icons/arrow-up"
import { ArrowBackIcon } from "@/assets/svg/icons/arrow-back"
import { SaveIcon } from "@/assets/svg/icons/save"
import { SidebarItemWrapper } from "@/components/SidebarItemWrapper"
import { cn, parseDate } from "@/lib/utils"
import { saveConsumptionAction } from "@/actions/consumption"
import { clampWaterLevel } from "@/app/[lng]/dashboard/utils/clampWaterLevel"
import { Text } from "@/components/Text"
import { SidebarIconButton } from "@/components/SidebarIconButton"

type EntryProps = {
  entry: ArchiveEntry
  glassVolume: number
  maxWaterPerDay: number
}

export const Entry = ({ entry, glassVolume, maxWaterPerDay }: EntryProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, startSaveTransition] = useTransition()
  const [editedWaterLevel, setEditedWaterLevel] = useState(entry.amount)
  const queryClient = useQueryClient()

  useEffect(() => {
    setEditedWaterLevel(entry.amount)
  }, [entry])

  const handleDecreaseWaterLevel = () => {
    setEditedWaterLevel((currentValue) =>
      clampWaterLevel(currentValue - glassVolume, maxWaterPerDay),
    )
  }

  const handleIncreaseWaterLevel = () => {
    setEditedWaterLevel((currentValue) =>
      clampWaterLevel(currentValue + glassVolume, maxWaterPerDay),
    )
  }

  const handleCancelEditing = () => {
    setEditedWaterLevel(entry.amount)
    setIsEditing(false)
  }

  const handleSave = () => {
    if (editedWaterLevel === entry.amount) {
      setIsEditing(false)
      return
    }

    startSaveTransition(async () => {
      const response = await saveConsumptionAction({
        amount: editedWaterLevel,
        date: entry.date,
      })

      if (!response.success) return
      queryClient.invalidateQueries({ queryKey: ["stats"] })

      setIsEditing(false)
    })
  }

  const parsedDate = parseDate(entry.date)
  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: "UTC",
  }).format(parsedDate)

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(parsedDate)

  const waterInGlasses = editedWaterLevel / glassVolume
  const glassLabel = `${waterInGlasses.toFixed(0)} glass${
    waterInGlasses === 1 ? "" : "es"
  }`

  return (
    <SidebarItemWrapper as="li" isEditMode={isEditing} className="pr-1.5">
      <Text primary={formattedDate} secondary={weekday} className="flex-1" />
      <Text
        primary={`${editedWaterLevel} L`}
        secondary={glassLabel}
        className="min-w-16"
      />
      <div
        className={cn("flex items-center gap-1 transition-all duration-300")}
      >
        <SidebarIconButton
          isVisible={isEditing}
          icon={<ArrowDownIcon />}
          onClick={handleDecreaseWaterLevel}
          disabled={isSaving || editedWaterLevel <= 0}
        />
        <SidebarIconButton
          isVisible={isEditing}
          icon={<ArrowUpIcon />}
          onClick={handleIncreaseWaterLevel}
          disabled={isSaving || editedWaterLevel >= maxWaterPerDay}
        />
        <SidebarIconButton
          isVisible={isEditing}
          icon={<ArrowBackIcon />}
          onClick={handleCancelEditing}
          disabled={isSaving}
        />
        {isEditing ? (
          <SidebarIconButton
            isVisible={isEditing}
            icon={<SaveIcon />}
            onClick={handleSave}
            disabled={isSaving}
          />
        ) : (
          <SidebarIconButton
            icon={<EditIcon />}
            onClick={() => {
              setEditedWaterLevel(entry.amount)
              setIsEditing(true)
            }}
          />
        )}
      </div>
      <EmojiIcon
        className="w-8"
        waterLevel={editedWaterLevel}
        maxWaterPerDay={maxWaterPerDay}
      />
    </SidebarItemWrapper>
  )
}
