export const easeOutCubic = (progress: number) => 1 - (1 - progress) ** 3

export const getAnimatedTransitionValue = ({
  timestamp,
  from,
  to,
  startedAt,
  durationMs,
  delayMs = 0,
  easing = (progress: number) => progress,
  onComplete,
}: {
  timestamp: number
  from: number
  to: number
  startedAt: number | null
  durationMs: number
  delayMs?: number
  easing?: (progress: number) => number
  onComplete?: () => void
}) => {
  if (startedAt === null || durationMs <= 0) return to

  const elapsed = timestamp - startedAt
  if (elapsed >= durationMs) {
    onComplete?.()
    return to
  }

  const progress = Math.max(0, Math.min(1, (elapsed - delayMs) / durationMs))
  const easedProgress = easing(progress)

  return from + (to - from) * easedProgress
}
