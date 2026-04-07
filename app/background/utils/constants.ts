import type { WaveData } from "../types"

export const WAVES_DATA: WaveData[] = [
  {
    amplitudeRatio: 0.4,
    speed: 1,
    phaseOffset: Math.PI / 2,
    periods: 5,
    color: "#3f7ea0",
  },
  {
    amplitudeRatio: 0.5,
    speed: 1.3,
    phaseOffset: Math.PI / 3,
    periods: 4,
    color: "#2e6484",
  },
  {
    amplitudeRatio: 0.65,
    speed: 1.8,
    phaseOffset: Math.PI / 4,
    periods: 3,
    color: "#164d6b",
  },
  {
    amplitudeRatio: 0.8,
    speed: 2.2,
    phaseOffset: 0,
    periods: 2,
    color: "#12344c",
  },
]
export const WAVES_PARAMS = { rotation: 0.03, gap: 100 }
