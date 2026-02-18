import { WAVES_DATA, WAVES_PARAMS } from "./constants"
import { WaveData } from "./types"

export class Waves {
  private context: CanvasRenderingContext2D
  private swingStartedAt: number | null = null
  private waterLevelsTotal: number
  private readonly swingDurationMs = 2000
  private readonly swingStrength = 0.5
  private readonly minWaterLevelOffset = 0.8
  private readonly maxWaterLevelOffset = 0.05
  private waterLevel = this.minWaterLevelOffset
  private waterLevelIncrement: number
  // private logoPathWhite: Path2D
  // private logoPathColor: Path2D

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

    // this.logoPathWhite = new Path2D(LOGO_WHITE_PATH)
    // this.logoPathColor = new Path2D(LOGO_COLOR_PATH)

    if (!this.context) {
      throw new Error("Failed to get canvas context")
    }
  }

  private drawWaves = (wave: WaveData, index: number, t: number) => {
    const width = this.canvas.clientWidth
    const height = this.canvas.clientHeight
    const offset = 100
    const baseLine =
      height * this.waterLevel + WAVES_PARAMS.gap * index * this.waterLevel
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

    const elapsed = timestamp - this.swingStartedAt
    if (elapsed >= this.swingDurationMs) {
      this.swingStartedAt = null
      return 0
    }

    const progress = elapsed / this.swingDurationMs
    const envelope = (1 - progress) * (1 - progress)
    const oscillation = Math.sin(progress * Math.PI * 6 + phaseOffset * 0.35)
    const maxRotation = 0.15

    return oscillation * envelope * this.swingStrength * maxRotation
  }

  public swingWaves = () => {
    this.swingStartedAt = performance.now()
  }

  public decreaseWaterLevel = () => {
    this.waterLevel = Math.min(
      this.minWaterLevelOffset,
      this.waterLevel + this.waterLevelIncrement,
    )
  }

  public increaseWaterLevel = () => {
    this.waterLevel = Math.max(
      this.maxWaterLevelOffset,
      this.waterLevel - this.waterLevelIncrement,
    )
  }

  // private drawLogo = (width: number, height: number) => {
  //   const targetWidth = Math.min(width * 0.6, 520)
  //   const scale = targetWidth / LOGO_VIEWBOX.width
  //   const logoWidth = LOGO_VIEWBOX.width * scale
  //   const logoHeight = LOGO_VIEWBOX.height * scale
  //   const x = (width - logoWidth) / 2
  //   const y = Math.max(16, height * 0.55 - logoHeight / 2)

  //   this.context.save()
  //   this.context.translate(x, y)
  //   this.context.scale(scale, scale)
  //   this.context.fillStyle = "#155e75"
  //   this.context.fill(logoWhite)
  //   this.context.fillStyle = "#a5f3fc"
  //   this.context.fill(logoColor)
  //   this.context.restore()
  // }

  private drawFrame = (timestamp: number) => {
    this.context.clearRect(
      0,
      0,
      this.canvas.clientWidth,
      this.canvas.clientHeight,
    )
    this.drawWaves(WAVES_DATA[0], 0, timestamp)
    this.drawWaves(WAVES_DATA[1], 1, timestamp)
    // drawLogo(width, height)
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
