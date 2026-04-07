export const getColorFromRange = (
  percentage: number,
  startColor: string,
  endColor: string,
) => {
  const normalizedPercentage = Math.min(Math.max(percentage, 0), 1)

  const parseHexColor = (color: string) => {
    const sanitized = color.replace("#", "")
    const hex =
      sanitized.length === 3
        ? sanitized
            .split("")
            .map((char) => char + char)
            .join("")
        : sanitized

    if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
      throw new Error(`Invalid hex color provided: ${color}`)
    }

    return {
      r: Number.parseInt(hex.slice(0, 2), 16),
      g: Number.parseInt(hex.slice(2, 4), 16),
      b: Number.parseInt(hex.slice(4, 6), 16),
    }
  }

  const toHex = (value: number) => value.toString(16).padStart(2, "0")
  const start = parseHexColor(startColor)
  const end = parseHexColor(endColor)

  const r = Math.round(start.r + (end.r - start.r) * normalizedPercentage)
  const g = Math.round(start.g + (end.g - start.g) * normalizedPercentage)
  const b = Math.round(start.b + (end.b - start.b) * normalizedPercentage)

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}
