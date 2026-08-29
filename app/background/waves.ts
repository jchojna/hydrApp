import { WAVES_DATA, WAVES_PARAMS } from "./utils/constants"
import { WaveData } from "./types"
import { easeOutCubic, getAnimatedTransitionValue } from "./utils/animation"

// TODO: improve this class as in animated grid class
export class Waves {
  private context: CanvasRenderingContext2D
  private swingStartedAt: number | null = null
  private entryStartedAt: number | null = null
  private maxWaterPerDay: number
  private readonly swingDurationMs = 2000
  private readonly entryAnimationDurationMs = 1800
  private readonly entryAnimationStaggerMs = 150
  private readonly floatAmplitudePx = 30
  private readonly floatSpeed = 0.0015
  private readonly swingStrength = 0.5
  private readonly minWaterLevelOffset = 0.1
  private readonly maxWaterLevelOffset = 0.05
  private readonly introWaterLevel = 0.75
  private readonly waterLevelTransitionDurationMs = 1000
  private readonly fadeOutWaterLevelMultiplier = 1.2
  private waterLevel = this.introWaterLevel
  private renderedWaterLevel = this.introWaterLevel
  private waterLevelTransitionFrom = this.introWaterLevel
  private waterLevelTransitionStartedAt: number | null = null

  constructor(
    private canvas: HTMLCanvasElement,
    maxWaterPerDay: number = 3,
  ) {
    this.canvas = canvas
    this.context = canvas.getContext("2d") as CanvasRenderingContext2D
    this.maxWaterPerDay = maxWaterPerDay

    if (!this.context) {
      throw new Error("Failed to get canvas context")
    }
  }

  private drawWaves = (
    wave: WaveData,
    index: number,
    t: number,
    translateY: number = 0,
  ) => {
    const width = this.canvas.clientWidth
    const height = this.canvas.clientHeight
    const offset = 100
    const baseLine = this.getWaveBaseLine(index, t)
    const pivotX = width / 2
    const pivotY = (baseLine + height) / 2

    const waveHeight = (width / wave.periods) * 0.1
    const baseAmplitude = waveHeight * wave.amplitudeRatio
    // const modulation = 0.7 + 0.4 * Math.sin(t * 0.001 + wave.phaseOffset * 5)
    const amplitude = baseAmplitude
    const frequency = (Math.PI * 2 * wave.periods) / width
    const phase = t * wave.speed * 0.001 + wave.phaseOffset
    const rotation = this.getRotation(t, wave.phaseOffset)

    this.context.save()
    this.context.translate(0, translateY)
    this.context.translate(pivotX, pivotY)
    this.context.rotate(rotation)
    this.context.translate(-pivotX, -pivotY)
    this.context.beginPath()
    this.context.moveTo(0, height + offset)
    for (let x = -offset; x <= width + offset; x += 1) {
      const y = baseLine + Math.sin(frequency * x + phase) * amplitude
      this.context.lineTo(x, y)
    }
    this.context.lineTo(width, height + offset)
    this.context.closePath()
    this.context.fillStyle = wave.color
    this.context.fill()
    this.context.restore()
  }

  private getEntryOffset = (
    layer: number,
    timestamp: number,
    delayMs: number = 0,
  ) => {
    if (this.entryStartedAt === null) return 0

    const elapsed =
      timestamp -
      this.entryStartedAt -
      layer * this.entryAnimationStaggerMs -
      delayMs
    if (elapsed >= this.entryAnimationDurationMs) return 0

    const progress = Math.max(
      0,
      Math.min(1, elapsed / this.entryAnimationDurationMs),
    )
    const easedProgress = easeOutCubic(progress)
    const offscreenOffset = this.canvas.clientHeight * 1.15
    const peakOffset = -this.floatAmplitudePx

    return offscreenOffset + (peakOffset - offscreenOffset) * easedProgress
  }

  private getFloatOffset = (
    layer: number,
    timestamp: number,
    speed: number = this.floatSpeed,
    delayMs: number = 0,
    entryDelayMs: number = 0,
  ) => {
    if (this.entryStartedAt === null) return 0

    const elapsedAfterEntry =
      timestamp -
      this.entryStartedAt -
      layer * this.entryAnimationStaggerMs -
      entryDelayMs -
      this.entryAnimationDurationMs

    if (elapsedAfterEntry < 0) return 0

    const delayedElapsed = elapsedAfterEntry - delayMs
    if (delayedElapsed < 0) return -this.floatAmplitudePx

    return -Math.cos(delayedElapsed * speed) * this.floatAmplitudePx
  }

  private getRotation = (timestamp: number, phaseOffset: number) => {
    if (this.swingStartedAt === null) return 0

    const progress = getAnimatedTransitionValue({
      timestamp,
      from: 0,
      to: 1,
      startedAt: this.swingStartedAt,
      durationMs: this.swingDurationMs,
      onComplete: () => {
        this.swingStartedAt = null
      },
    })
    const envelope = (1 - progress) * (1 - progress)
    const oscillation = Math.sin(progress * Math.PI * 6 + phaseOffset * 0.35)
    const maxRotation = 0.15

    return oscillation * envelope * this.swingStrength * maxRotation
  }

  private getWaveBaseLine = (
    index: number,
    timestamp: number,
    easing: (progress: number) => number = easeOutCubic,
  ) => {
    const height = this.canvas.clientHeight
    this.renderedWaterLevel = getAnimatedTransitionValue({
      timestamp,
      from: this.waterLevelTransitionFrom,
      to: this.waterLevel,
      startedAt: this.waterLevelTransitionStartedAt,
      durationMs: this.waterLevelTransitionDurationMs,
      // delayMs: 100 * index, // TODO: fix issue when delay is applied
      delayMs: 0,
      easing,
      onComplete: () => {
        this.waterLevelTransitionStartedAt = null
        this.waterLevelTransitionFrom = this.waterLevel
      },
    })

    return (
      (height - (WAVES_PARAMS.gap * index * (8 - index)) / 8) *
      this.renderedWaterLevel
    )
  }

  private normalizeWaterLevel = (waterLevel: number) => {
    const range = 1 - this.minWaterLevelOffset - this.maxWaterLevelOffset
    const normalizedWaterLevel =
      (waterLevel / this.maxWaterPerDay) * range + this.minWaterLevelOffset

    return 1 - normalizedWaterLevel
  }

  public setWaterLevel = (nextWaterLevel: number) => {
    if (nextWaterLevel === this.waterLevel) return
    const normalizedWaterLevel = this.normalizeWaterLevel(nextWaterLevel)

    this.waterLevelTransitionFrom = this.renderedWaterLevel
    this.waterLevel = normalizedWaterLevel
    this.waterLevelTransitionStartedAt = performance.now()
  }

  public setMaxWaterPerDay = (maxWaterPerDay: number) => {
    this.maxWaterPerDay = maxWaterPerDay
  }

  public swingWaves = () => {
    this.swingStartedAt = performance.now()
  }

  public fadeOut = () => {
    this.setWaterLevel(this.maxWaterPerDay * this.fadeOutWaterLevelMultiplier)
  }

  private drawFrame = (timestamp: number) => {
    this.context.clearRect(
      0,
      0,
      this.canvas.clientWidth,
      this.canvas.clientHeight,
    )

    this.drawWaves(
      WAVES_DATA[0],
      3,
      timestamp,
      this.getEntryOffset(0, timestamp) + this.getFloatOffset(0, timestamp),
    )
    this.drawWaves(
      WAVES_DATA[1],
      2,
      timestamp,
      this.getEntryOffset(1, timestamp) + this.getFloatOffset(1, timestamp),
    )
    this.drawWaves(
      WAVES_DATA[2],
      1,
      timestamp,
      this.getEntryOffset(3, timestamp) + this.getFloatOffset(3, timestamp),
    )
    this.drawWaves(
      WAVES_DATA[3],
      0,
      timestamp,
      this.getEntryOffset(4, timestamp) + this.getFloatOffset(4, timestamp),
    )

    requestAnimationFrame(this.drawFrame)
  }

  public resizeCanvas = () => {
    const width = window.innerWidth
    const height = window.innerHeight
    const dpr = window.devicePixelRatio || 1

    this.canvas.width = Math.max(1, Math.floor(width * dpr))
    this.canvas.height = Math.max(1, Math.floor(height * dpr))
    this.context.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  public start() {
    this.resizeCanvas()
    this.entryStartedAt = performance.now()
    requestAnimationFrame(this.drawFrame)
  }
}
