import type { ARScene } from "./ARScene"

export class PerformanceOptimizer {
  constructor(private mode: "balanced" | "quality" | "performance") {}

  setMode(mode: "balanced" | "quality" | "performance"): void {
    this.mode = mode
    console.log(`Performance mode set to: ${mode}`)
  }

  optimize(scene: ARScene): void {
    console.log(`Optimizing scene for ${this.mode} mode`)

    const renderer = scene["renderer"]
    const camera = scene["camera"]

    switch (this.mode) {
      case "quality":
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(window.innerWidth, window.innerHeight)
        camera.fov = 60
        break
      case "performance":
        renderer.setPixelRatio(1)
        renderer.setSize(window.innerWidth / 2, window.innerHeight / 2)
        camera.fov = 80
        break
      case "balanced":
      default:
        renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1)
        renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8)
        camera.fov = 70
        break
    }

    camera.updateProjectionMatrix()

    if (this.isMobileDevice()) {
      this.optimizeForMobile(scene)
    }
  }

  private isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  private optimizeForMobile(scene: ARScene): void {
    const renderer = scene["renderer"]
    renderer.setPixelRatio(1)
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
}

