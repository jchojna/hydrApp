export const getDigits = (
  waterLevel: number,
  glassVolume: number,
): string[] => {
  return (waterLevel / glassVolume).toString().padStart(2, "0").split("")
}
