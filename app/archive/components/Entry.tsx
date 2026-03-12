import { useState } from "react"

import { EmojiIcon } from "@/components/EmojiIcon"
import { MAX_WATER_PER_DAY } from "@/lib/constants"
import { ArchiveEntry } from "@/lib/types"
import { EditIcon } from "@/assets/svg/icons/edit"
import { IconButton } from "@/components/IconButton"
import { ArrowDownIcon } from "@/assets/svg/icons/arrow-down"
import { ArrowUpIcon } from "@/assets/svg/icons/arrow-up"
import { ArrowBackIcon } from "@/assets/svg/icons/arrow-back"
import { SaveIcon } from "@/assets/svg/icons/save"
import { cn } from "@/lib/utils"
import { EntryDate } from "./EntryDate"
import { EntryAmount } from "./EntryAmount"

type EntryProps = {
  entry: ArchiveEntry
}

export const Entry = ({ entry }: EntryProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const waterLevel = Number(entry.amount)

  return (
    <div
      key={entry.date}
      className={cn(
        "text-blue-light-1 bg-blue-dark-2 flex items-center gap-2 rounded-full px-3 py-1",
        isEditing && "bg-blue-dark-1",
      )}
    >
      <EntryDate date={entry.date} />
      <EntryAmount amount={waterLevel} />
      <div className="flex items-center gap-1">
        {isEditing ? (
          <>
            <IconButton
              className="h-6 w-6"
              icon={<ArrowDownIcon />}
              onClick={() => {}}
            />
            <IconButton
              className="h-6 w-6"
              icon={<ArrowUpIcon />}
              onClick={() => {}}
            />
            <IconButton
              className="h-6 w-6"
              icon={<ArrowBackIcon />}
              onClick={() => {}}
            />
            <IconButton
              className="h-6 w-6"
              icon={<SaveIcon />}
              onClick={() => {}}
            />
          </>
        ) : (
          <IconButton
            className="h-6 w-6"
            icon={<EditIcon />}
            onClick={() => setIsEditing(true)}
          />
        )}
      </div>
      <EmojiIcon
        className="w-6"
        waterLevel={waterLevel}
        maxWaterPerDay={MAX_WATER_PER_DAY}
      />
    </div>
  )
}
