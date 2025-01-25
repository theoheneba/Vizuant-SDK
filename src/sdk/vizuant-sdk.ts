class ConfigurationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ConfigurationError"
  }
}

import { type VizuantConfig, defaultConfig } from "../config/vizuant-config"
import { ARScene } from "../ar/ARScene"
import type { ARMarker } from "../ar/ARMarker"
import type { ARObject } from "../ar/ARObject"
import { GestureRecognizer } from "../ar/GestureRecognizer"
import { ARPersistenceManager } from "../ar/ARPersistenceManager"
import { CollaborationManager } from "../ar/CollaborationManager"
import { AnalyticsManager } from "../ar/AnalyticsManager"
import { ModelLoader } from "../ar/ModelLoader"
import { PerformanceOptimizer } from "../ar/PerformanceOptimizer"

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
    // Validate required configuration
    if (!config.apiKey) {
      throw new ConfigurationError("API key is required")
    }

    // Merge with default config
    this.config = this.mergeConfig(defaultConfig, config)

    // Initialize components with validated config
    try {
      this.gestureRecognizer = new GestureRecognizer(this.config.arSettings.enableGestures)
      this.persistenceManager = new ARPersistenceManager(this.config.arSettings.enablePersistence)
      this.collaborationManager = new CollaborationManager(this.config.arSettings.enableCollaboration)
      this.analyticsManager = new AnalyticsManager(this.config.arSettings.enableAnalytics)
      this.modelLoader = new ModelLoader(this.config.arSettings.supportedModelFormats)
      this.performanceOptimizer = new PerformanceOptimizer(this.config.arSettings.performanceMode)
    } catch (error) {
      throw new ConfigurationError(
        `Failed to initialize SDK components: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  private mergeConfig(defaultConfig: VizuantConfig, userConfig: Partial<VizuantConfig>): VizuantConfig {
    // Deep merge of AR settings
    const mergedArSettings = {
      ...defaultConfig.arSettings,
      ...userConfig.arSettings,
    }

    // Merge complete config
    return {
      ...defaultConfig,
      ...userConfig,
      arSettings: mergedArSettings,
    }
  }

  private validateConfig(config: VizuantConfig): void {
    // Validate API key
    if (!config.apiKey) {
      throw new ConfigurationError("API key is required")
    }

    // Validate AR settings
    const validExperienceTypes = ["marker", "location", "surface"]
    if (!validExperienceTypes.includes(config.arSettings.experienceType)) {
      throw new ConfigurationError(`Invalid experience type. Must be one of: ${validExperienceTypes.join(", ")}`)
    }

    const validMarkerTypes = ["image", "object"]
    if (!validMarkerTypes.includes(config.arSettings.markerType)) {
      throw new ConfigurationError(`Invalid marker type. Must be one of: ${validMarkerTypes.join(", ")}`)
    }

    const validRenderQualities = ["low", "medium", "high"]
    if (!validRenderQualities.includes(config.arSettings.renderQuality)) {
      throw new ConfigurationError(`Invalid render quality. Must be one of: ${validRenderQualities.join(", ")}`)
    }

    const validPerformanceModes = ["balanced", "quality", "performance"]
    if (!validPerformanceModes.includes(config.arSettings.performanceMode)) {
      throw new ConfigurationError(`Invalid performance mode. Must be one of: ${validPerformanceModes.join(", ")}`)
    }
  }

  initialize(): void {
    try {
      // Validate the complete configuration
      this.validateConfig(this.config)

      // Log initialization
      console.log("Initializing Vizuant SDK with config:", {
        version: this.config.version,
        experienceType: this.config.arSettings.experienceType,
        renderQuality: this.config.arSettings.renderQuality,
      })

      this.initialized = true
    } catch (error) {
      if (error instanceof ConfigurationError) {
        throw error
      } else {
        throw new ConfigurationError(`Initialization failed: ${error instanceof Error ? error.message : String(error)}`)
      }
    }
  }

  createARScene(containerId: string): ARScene {
    if (!this.initialized) {
      throw new Error("VizuantSDK must be initialized before creating an AR scene")
    }
    this.arScene = new ARScene(containerId, this.config.arSettings, this.gestureRecognizer, this.performanceOptimizer)
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

