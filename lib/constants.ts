import { Emoji1 } from "@/assets/svg/emojis/emoji-1"
import { Emoji2 } from "@/assets/svg/emojis/emoji-2"
import { Emoji3 } from "@/assets/svg/emojis/emoji-3"
import { Emoji4 } from "@/assets/svg/emojis/emoji-4"
import { Emoji5 } from "@/assets/svg/emojis/emoji-5"
import { Emoji6 } from "@/assets/svg/emojis/emoji-6"
import { Emoji7 } from "@/assets/svg/emojis/emoji-7"
import { Emoji8 } from "@/assets/svg/emojis/emoji-8"
import { UserSex } from "./types"

export const USER_SEX_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
] satisfies Array<{ value: UserSex; label: string }>

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

export const RULER_TICK_HEIGHT = 24

export const ARCHIVE_LIMIT = 7
export const RANKING_ITEMS_PER_PAGE = 3

export const EMOJI_BAD_COLOR = "#c42349"
export const EMOJI_GOOD_COLOR = "#3fd5be"

export const MAX_USER_AGE = 100
export const MAX_WATER_LIMIT = 5 // liters
export const MAX_GLASS_VOLUME = 1 // liters
