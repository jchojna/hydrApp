import { Pane } from "tweakpane"

import { WAVES_DATA, WAVES_PARAMS } from "../constants"

export const addTweakpane = (pane: Pane) => {
  WAVES_DATA.forEach((wave, index) => {
    const waveFolder = pane.addFolder({
      title: `Wave ${index + 1}`,
      expanded: true,
    })
    waveFolder.addBinding(wave, "amplitudeRatio", {
      min: 0,
      max: 3,
      step: 0.01,
    })
    waveFolder.addBinding(wave, "periods", {
      min: 1,
      max: 10,
      step: 1,
    })
    waveFolder.addBinding(wave, "speed", {
      min: 0,
      max: 5,
      step: 0.1,
    })
    waveFolder.addBinding(wave, "phaseOffset", {
      min: 0,
      max: Math.PI / 2,
      step: 0.01,
    })
  })
  pane.addBinding(WAVES_PARAMS, "rotation", {
    min: 0,
    max: 0.2,
    step: 0.01,
  })
  pane.addBinding(WAVES_PARAMS, "gap", {
    min: 0,
    max: 200,
    step: 1,
  })
}
