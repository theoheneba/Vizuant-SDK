import { type VizuantConfig, defaultConfig } from "./config/vizuant-config"
import { ARScene } from "./ar/ARScene"
import type { ARMarker } from "./ar/ARMarker"
import type { ARObject } from "./ar/ARObject"
import { GestureRecognizer } from "./ar/GestureRecognizer"
import { ARPersistenceManager } from "./ar/ARPersistenceManager"
import { CollaborationManager } from "./ar/CollaborationManager"
import { AnalyticsManager } from "./ar/AnalyticsManager"
import { ModelLoader } from "./ar/ModelLoader"
import { PerformanceOptimizer } from "./ar/PerformanceOptimizer"

export class VizuantSDK {
  private config: VizuantConfig
  private arScene: ARScene | null = null
  private gestureRecognizer: GestureRecognizer
  private persistenceManager: ARPersistenceManager
  private collaborationManager: CollaborationManager
  private analyticsManager: AnalyticsManager
  private modelLoader: ModelLoader
  private performanceOptimizer: PerformanceOptimizer
  private initialized = false

  constructor(config: Partial<VizuantConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
    this.gestureRecognizer = new GestureRecognizer(this.config.arSettings.enableGestures)
    this.persistenceManager = new ARPersistenceManager(this.config.arSettings.enablePersistence)
    this.collaborationManager = new CollaborationManager(this.config.arSettings.enableCollaboration)
    this.analyticsManager = new AnalyticsManager(this.config.arSettings.enableAnalytics)
    this.modelLoader = new ModelLoader(this.config.arSettings.supportedModelFormats)
    this.performanceOptimizer = new PerformanceOptimizer(this.config.arSettings.performanceMode)
  }

  initialize(): void {
    console.log("Initializing Vizuant SDK with config:", this.config)
    this.initialized = true
  }

  createARScene(containerId: string): ARScene {
    try {
      this.arScene = new ARScene(containerId, this.config.arSettings, this.gestureRecognizer, this.performanceOptimizer)
      return this.arScene
    } catch (error) {
      console.error("Failed to create AR scene:", error)
      throw new Error(`Failed to create AR scene: ${error.message}`)
    }
  }

  createARMarker(markerId: string, markerImage: string): ARMarker {
    if (!this.arScene) {
      throw new Error("AR Scene must be created before adding markers")
    }
    try {
      return this.arScene.createMarker(markerId, markerImage)
    } catch (error) {
      console.error("Error creating AR marker:", error)
      throw error
    }
  }

  createARObject(objectId: string, objectUrl: string): ARObject {
    if (!this.arScene) {
      throw new Error("AR Scene must be created before adding objects")
    }
    try {
      return this.arScene.createObject(objectId, objectUrl)
    } catch (error) {
      console.error("Error creating AR object:", error)
      throw error
    }
  }

  startARSession(): void {
    if (!this.arScene) {
      throw new Error("AR Scene must be created before starting a session")
    }
    this.arScene.start()
    if (this.analyticsManager) {
      this.analyticsManager.trackSessionStart()
    }
  }

  stopARSession(): void {
    if (this.arScene) {
      this.arScene.stop()
      if (this.analyticsManager) {
        this.analyticsManager.trackSessionEnd()
      }
    }
  }

  saveARScene(sceneId: string): Promise<void> {
    if (!this.persistenceManager) {
      throw new Error("Persistence is not enabled")
    }
    return this.persistenceManager.saveScene(sceneId, this.arScene!)
  }

  loadARScene(sceneId: string): Promise<ARScene> {
    if (!this.persistenceManager) {
      throw new Error("Persistence is not enabled")
    }
    return this.persistenceManager.loadScene(sceneId)
  }

  joinCollaborationSession(sessionId: string): void {
    if (!this.collaborationManager) {
      throw new Error("Collaboration is not enabled")
    }
    this.collaborationManager.joinSession(sessionId, this.arScene!)
  }

  leaveCollaborationSession(): void {
    if (this.collaborationManager) {
      this.collaborationManager.leaveSession()
    }
  }

  loadModel(modelUrl: string): Promise<ARObject> {
    if (!this.modelLoader) {
      throw new Error("Model loader is not initialized")
    }
    return this.modelLoader.loadModel(modelUrl).then((model) => {
      return this.createARObject(model.id, model.url)
    })
  }

  setPerformanceMode(mode: "balanced" | "quality" | "performance"): void {
    if (this.performanceOptimizer) {
      this.performanceOptimizer.setMode(mode)
    }
  }
}

