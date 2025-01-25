import { type VizuantConfig, defaultConfig } from "../config/vizuant-config"
import { ARScene } from "../ar/ARScene"
import type { ARMarker } from "../ar/ARMarker"
import type { ARObject } from "../ar/ARObject"

export class VizuantSDK {
  private config: VizuantConfig
  private arScene: ARScene | null = null

  constructor(config: Partial<VizuantConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
  }

  initialize(): void {
    console.log("Initializing Vizuant SDK with config:", this.config)
  }

  createARScene(containerId: string): ARScene {
    this.arScene = new ARScene(containerId, this.config.arSettings)
    return this.arScene
  }

  createARMarker(markerId: string, markerImage: string): ARMarker {
    if (!this.arScene) {
      throw new Error("AR Scene must be created before adding markers")
    }
    return this.arScene.createMarker(markerId, markerImage)
  }

  createARObject(objectId: string, objectUrl: string): ARObject {
    if (!this.arScene) {
      throw new Error("AR Scene must be created before adding objects")
    }
    return this.arScene.createObject(objectId, objectUrl)
  }

  startARSession(): void {
    if (!this.arScene) {
      throw new Error("AR Scene must be created before starting a session")
    }
    this.arScene.start()
  }

  stopARSession(): void {
    if (this.arScene) {
      this.arScene.stop()
    }
  }
}

