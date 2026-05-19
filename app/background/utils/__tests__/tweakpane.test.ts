import { describe, expect, it, vi } from "vitest"
import type { Pane } from "tweakpane"

import { WAVES_DATA, WAVES_PARAMS } from "../constants"
import { addTweakpane } from "../tweakpane"

describe("addTweakpane", () => {
  it("creates folders and bindings for all waves and global params", () => {
    const addBindingOnFolder = vi.fn()
    const addFolder = vi.fn(() => ({
      addBinding: addBindingOnFolder,
    }))
    const addBindingOnPane = vi.fn()
    const pane = {
      addFolder,
      addBinding: addBindingOnPane,
    } as unknown as Pane

    addTweakpane(pane)

    expect(addFolder).toHaveBeenCalledTimes(WAVES_DATA.length)
    expect(addBindingOnFolder).toHaveBeenCalledTimes(WAVES_DATA.length * 4)
    expect(addBindingOnPane).toHaveBeenCalledTimes(2)

    expect(addBindingOnPane).toHaveBeenNthCalledWith(
      1,
      WAVES_PARAMS,
      "rotation",
      {
        min: 0,
        max: 0.2,
        step: 0.01,
      },
    )
    expect(addBindingOnPane).toHaveBeenNthCalledWith(2, WAVES_PARAMS, "gap", {
      min: 0,
      max: 200,
      step: 1,
    })
  })
})
