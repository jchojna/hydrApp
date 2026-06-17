import { LOGO_VIEWBOX, LOGO } from "./utils/logo"

export class Logo {
  private logoPathA: Path2D
  private logoPathB: Path2D
  private isLogoVisible: boolean

  constructor(private context: CanvasRenderingContext2D) {
    this.logoPathA = new Path2D(LOGO.partA.path)
    this.logoPathB = new Path2D(LOGO.partB.path)
    this.isLogoVisible = true
  }

  public drawLogo = (width: number, height: number, translateY: number = 0) => {
    if (!this.isLogoVisible) return

    const targetWidth = Math.min(width * 0.6, 520)
    const scale = targetWidth / LOGO_VIEWBOX.width
    const logoWidth = LOGO_VIEWBOX.width * scale
    const logoHeight = LOGO_VIEWBOX.height * scale
    const x = (width - logoWidth) / 2
    const y = Math.max(16, height * 0.55 - logoHeight / 2)

    this.context.save()
    this.context.translate(x, y + translateY)
    this.context.scale(scale, scale)
    this.context.fillStyle = LOGO.partA.color
    this.context.fill(this.logoPathA)
    this.context.fillStyle = LOGO.partB.color
    this.context.fill(this.logoPathB)
    this.context.restore()
  }

  public hideLogo = () => {
    setTimeout(() => {
      this.isLogoVisible = false
    }, 1000)
  }
}
