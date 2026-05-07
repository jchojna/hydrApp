import { useEffect, useState, useTransition } from "react"
import { useQueryClient } from "@tanstack/react-query"

import { EmojiIcon } from "@/components/EmojiIcon"
import { ArchiveEntry } from "@/lib/types"
import { EditIcon } from "@/assets/svg/icons/edit"
import { IconButton } from "@/components/IconButton"
import { ArrowDownIcon } from "@/assets/svg/icons/arrow-down"
import { ArrowUpIcon } from "@/assets/svg/icons/arrow-up"
import { ArrowBackIcon } from "@/assets/svg/icons/arrow-back"
import { SaveIcon } from "@/assets/svg/icons/save"
import { cn } from "@/lib/utils"
import { saveConsumptionAction } from "@/actions/consumption"
import { EntryDate } from "./EntryDate"
import { EntryAmount } from "./EntryAmount"
import { clampWaterLevel } from "@/app/[lng]/dashboard/utils/clampWaterLevel"

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

  return (
    <li
      className={cn(
        "flex items-center gap-2 rounded-full bg-blue-300/30 px-3 py-1 text-blue-300",
        isEditing && "bg-blue-600",
      )}
    >
      <EntryDate date={entry.date} />
      <EntryAmount amount={editedWaterLevel} glassVolume={glassVolume} />
      <div
        className={cn("flex items-center gap-1 transition-all duration-300")}
      >
        <IconButton
          className={cn(
            "h-6 w-0 text-blue-200 opacity-0 hover:text-blue-100",
            isEditing && "w-6 opacity-100",
          )}
          icon={<ArrowDownIcon />}
          onClick={handleDecreaseWaterLevel}
          disabled={isSaving || editedWaterLevel <= 0}
        />
        <IconButton
          className={cn(
            "h-6 w-0 text-blue-200 opacity-0 hover:text-blue-100",
            isEditing && "w-6 opacity-100",
          )}
          icon={<ArrowUpIcon />}
          onClick={handleIncreaseWaterLevel}
          disabled={isSaving || editedWaterLevel >= maxWaterPerDay}
        />
        <IconButton
          className={cn(
            "h-6 w-0 text-blue-200 opacity-0 hover:text-blue-100",
            isEditing && "w-6 opacity-100",
          )}
          icon={<ArrowBackIcon />}
          onClick={handleCancelEditing}
          disabled={isSaving}
        />
        {isEditing ? (
          <IconButton
            className={cn(
              "h-6 w-0 text-blue-200 opacity-0 hover:text-blue-100",
              isEditing && "w-6 opacity-100",
            )}
            icon={<SaveIcon />}
            onClick={handleSave}
            disabled={isSaving}
          />
        ) : (
          <IconButton
            className={cn(
              "h-6 w-6 text-blue-200 hover:text-blue-100",
              isEditing && "w-0",
            )}
            icon={<EditIcon />}
            onClick={() => {
              setEditedWaterLevel(entry.amount)
              setIsEditing(true)
            }}
          />
        )}
      </div>
      <EmojiIcon
        className="w-6"
        waterLevel={editedWaterLevel}
        maxWaterPerDay={maxWaterPerDay}
      />
    </li>
  )
}
