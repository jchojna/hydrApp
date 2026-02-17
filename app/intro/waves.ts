import { WAVES_DATA } from "./constants"
import { WaveData } from "./types"

export class Waves {
  private context: CanvasRenderingContext2D
  // private logoPathWhite: Path2D
  // private logoPathColor: Path2D

  constructor(private canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.context = canvas.getContext("2d") as CanvasRenderingContext2D
    // this.logoPathWhite = new Path2D(LOGO_WHITE_PATH)
    // this.logoPathColor = new Path2D(LOGO_COLOR_PATH)

    if (!this.context) {
      throw new Error("Failed to get canvas context")
    }
  }

  private drawWaves = (
    wave: WaveData,
    width: number,
    height: number,
    t: number,
  ) => {
    const waveHeight = width / wave.periods / 10
    const baseAmplitude = waveHeight * wave.amplitudeRatio
    const modulation = 0.7 + 0.4 * Math.sin(t * 0.001 + wave.phaseOffset * 5)
    const amplitude = baseAmplitude * modulation
    const baseLine = height * 0.6 - wave.yOffset
    const frequency = (Math.PI * 2 * wave.periods) / width
    const phase = t * wave.speed * 0.001 + wave.phaseOffset

    this.context.beginPath()
    this.context.moveTo(0, height)
    for (let x = 0; x <= width; x += 8) {
      const y = baseLine + Math.sin(frequency * x + phase) * amplitude
      this.context.lineTo(x, y)
    }
    this.context.lineTo(width, height)
    this.context.closePath()
    this.context.fillStyle = wave.color
    this.context.fill()
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
    const width = this.canvas.clientWidth
    const height = this.canvas.clientHeight

    this.context.clearRect(0, 0, width, height)
    this.drawWaves(WAVES_DATA[0], width, height, timestamp)
    this.drawWaves(WAVES_DATA[1], width, height, timestamp)
    // drawLogo(width, height)
    this.drawWaves(WAVES_DATA[2], width, height, timestamp)

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
