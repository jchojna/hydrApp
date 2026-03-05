import { Emoji1 } from "@/assets/svg/emojis/emoji-1"
import { Emoji2 } from "@/assets/svg/emojis/emoji-2"
import { Emoji3 } from "@/assets/svg/emojis/emoji-3"
import { Emoji4 } from "@/assets/svg/emojis/emoji-4"
import { Emoji5 } from "@/assets/svg/emojis/emoji-5"
import { Emoji6 } from "@/assets/svg/emojis/emoji-6"
import { Emoji7 } from "@/assets/svg/emojis/emoji-7"
import { Emoji8 } from "@/assets/svg/emojis/emoji-8"
import { ArchivePageInfo } from "@/lib/types"

export const SCORE_LEVELS = [
  {
    message: "Start now, sip by sip.",
    emoji: Emoji1,
  },
  {
    message: "Nice start. Keep going.",
    emoji: Emoji2,
  },
  {
    message: "Great progress. Stay on it.",
    emoji: Emoji3,
  },
  {
    message: "Strong habit. One glass at a time.",
    emoji: Emoji4,
  },
  {
    message: "Solid consistency today.",
    emoji: Emoji5,
  },
  {
    message: "Minimum goal reached. Great job.",
    emoji: Emoji6,
  },
  {
    message: "Almost there. Keep pushing.",
    emoji: Emoji7,
  },
  {
    message: "Goal complete. Excellent work.",
    emoji: Emoji8,
  },
]

export const GLASS_VOLUME = 0.25 // in litres
export const MAX_WATER_PER_DAY = 3 // 3 litres

export const RULER_TICK_HEIGHT = 6
export const RULER_TICK_WIDTH = 15

export const ARCHIVE_LIMIT = 7

export const DEFAULT_ARCHIVE_PAGE_INFO: ArchivePageInfo = {
  limit: ARCHIVE_LIMIT,
  offset: 0,
  hasPreviousPage: false,
  hasNextPage: false,
  previousOffset: 0,
  nextOffset: null,
}
