import { WAVES_DATA, WAVES_PARAMS } from "./utils/constants"
import { WaveData } from "./types"
import { easeOutCubic, getAnimatedTransitionValue } from "./utils/animation"
import { Logo } from "./logo"

export class Waves {
  private context: CanvasRenderingContext2D
  private swingStartedAt: number | null = null
  private waterLevelsTotal: number
  private readonly swingDurationMs = 2000
  private readonly swingStrength = 0.5
  private readonly minWaterLevelOffset = 0.8
  private readonly maxWaterLevelOffset = 0.05
  private readonly waterLevelTransitionDurationMs = 1000
  private waterLevel = this.minWaterLevelOffset
  private renderedWaterLevel = this.minWaterLevelOffset
  private waterLevelTransitionFrom = this.minWaterLevelOffset
  private waterLevelTransitionStartedAt: number | null = null
  private waterLevelIncrement: number
  public logo: Logo

  constructor(
    private canvas: HTMLCanvasElement,
    waterLevelsTotal: number = 10,
  ) {
    this.canvas = canvas
    this.context = canvas.getContext("2d") as CanvasRenderingContext2D
    this.waterLevelsTotal = waterLevelsTotal
    this.waterLevelIncrement =
      (this.minWaterLevelOffset - this.maxWaterLevelOffset) /
      this.waterLevelsTotal
    this.logo = new Logo(this.context)

    if (!this.context) {
      throw new Error("Failed to get canvas context")
    }
  }

  private drawWaves = (wave: WaveData, index: number, t: number) => {
    const width = this.canvas.clientWidth
    const height = this.canvas.clientHeight
    const offset = 100
    const baseLine = this.getWaveBaseLine(index, t)
    const pivotX = width / 2
    const pivotY = (baseLine + height) / 2

    const waveHeight = (width / wave.periods) * 0.1
    const baseAmplitude = waveHeight * wave.amplitudeRatio
    const modulation = 0.7 + 0.4 * Math.sin(t * 0.001 + wave.phaseOffset * 5)
    const amplitude = baseAmplitude * modulation
    const frequency = (Math.PI * 2 * wave.periods) / width
    const phase = t * wave.speed * 0.001 + wave.phaseOffset
    const rotation = this.getRotation(t, wave.phaseOffset)

    this.context.save()
    this.context.translate(pivotX, pivotY)
    this.context.rotate(rotation)
    this.context.translate(-pivotX, -pivotY)
    this.context.beginPath()
    this.context.moveTo(0, height + offset)
    for (let x = -offset; x <= width + offset; x += 8) {
      const y = baseLine + Math.sin(frequency * x + phase) * amplitude
      this.context.lineTo(x, y)
    }
    this.context.lineTo(width, height + offset)
    this.context.closePath()
    this.context.fillStyle = wave.color
    this.context.fill()
    this.context.restore()
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
      delayMs: 100 * index,
      easing,
      onComplete: () => {
        this.waterLevelTransitionStartedAt = null
        this.waterLevelTransitionFrom = this.waterLevel
      },
    })

    return (height + WAVES_PARAMS.gap * index) * this.renderedWaterLevel
  }

  private setWaterLevel = (nextWaterLevel: number) => {
    if (nextWaterLevel === this.waterLevel) return

    this.waterLevelTransitionFrom = this.renderedWaterLevel
    this.waterLevel = nextWaterLevel
    this.waterLevelTransitionStartedAt = performance.now()
  }

  public swingWaves = () => {
    this.swingStartedAt = performance.now()
  }

  public decreaseWaterLevel = () => {
    const nextWaterLevel = Math.min(
      this.minWaterLevelOffset,
      this.waterLevel + this.waterLevelIncrement,
    )
    this.setWaterLevel(nextWaterLevel)
  }

  public increaseWaterLevel = () => {
    const nextWaterLevel = Math.max(
      this.maxWaterLevelOffset,
      this.waterLevel - this.waterLevelIncrement,
    )
    this.setWaterLevel(nextWaterLevel)
  }

  public fadeOut = () => {
    this.setWaterLevel(-0.2)
  }

  private drawFrame = (timestamp: number) => {
    this.context.clearRect(
      0,
      0,
      this.canvas.clientWidth,
      this.canvas.clientHeight,
    )
    this.drawWaves(WAVES_DATA[0], 0, timestamp)
    this.drawWaves(WAVES_DATA[1], 1, timestamp)
    this.logo.drawLogo(this.canvas.clientWidth, this.canvas.clientHeight)
    this.drawWaves(WAVES_DATA[2], 2, timestamp)

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
    requestAnimationFrame(this.drawFrame)
  }
}
