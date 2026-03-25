export const clamp = (value: number, min: number = 0, max: number) =>
  Math.min(Math.max(value, min), max)
