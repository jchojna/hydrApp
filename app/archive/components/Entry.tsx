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
        "flex items-center gap-2 rounded-full bg-blue-200/20 px-3 py-1 text-blue-300",
        isEditing && "bg-blue-500",
      )}
    >
      <EntryDate date={entry.date} />
      <EntryAmount amount={editedWaterLevel} glassVolume={glassVolume} />
      <div className="flex items-center gap-1">
        {isEditing ? (
          <>
            <IconButton
              className="h-6 w-6"
              icon={<ArrowDownIcon />}
              onClick={handleDecreaseWaterLevel}
              disabled={isSaving || editedWaterLevel <= 0}
            />
            <IconButton
              className="h-6 w-6"
              icon={<ArrowUpIcon />}
              onClick={handleIncreaseWaterLevel}
              disabled={isSaving || editedWaterLevel >= maxWaterPerDay}
            />
            <IconButton
              className="h-6 w-6"
              icon={<ArrowBackIcon />}
              onClick={handleCancelEditing}
              disabled={isSaving}
            />
            <IconButton
              className="h-6 w-6"
              icon={<SaveIcon />}
              onClick={handleSave}
              disabled={isSaving}
            />
          </>
        ) : (
          <IconButton
            className="h-6 w-6"
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
