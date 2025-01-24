import { VizuantSDK } from "./sdk/vizuant-sdk"
import type { ARScene } from "./ar/ARScene"
import type { ARMarker } from "./ar/ARMarker"
import type { ARObject } from "./ar/ARObject"
import type { GestureRecognizer } from "./ar/GestureRecognizer"
import type { ARPersistenceManager } from "./ar/ARPersistenceManager"
import type { CollaborationManager } from "./ar/CollaborationManager"
import type { AnalyticsManager } from "./ar/AnalyticsManager"
import type { ModelLoader } from "./ar/ModelLoader"
import type { PerformanceOptimizer } from "./ar/PerformanceOptimizer"
import type { VizuantConfig } from "./config/vizuant-config"

// Re-export the main SDK class
export { VizuantSDK }

// Re-export types and interfaces
export type {
  VizuantConfig,
  ARScene,
  ARMarker,
  ARObject,
  GestureRecognizer,
  ARPersistenceManager,
  CollaborationManager,
  AnalyticsManager,
  ModelLoader,
  PerformanceOptimizer,
}

// Export a function to initialize AR.js
export function initializeARJS(): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = "https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Failed to load AR.js"))
    document.head.appendChild(script)
  })
}

// Export a helper function to check if the browser supports WebGL
export function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement("canvas")
    return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")))
  } catch (e) {
    return false
  }
}

