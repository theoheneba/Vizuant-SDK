export interface VizuantConfig {
  apiKey: string
  baseUrl: string
  version: string
  arSettings: {
    experienceType: "marker" | "location" | "surface"
    markerType: "image" | "object"
    maxSimultaneousTargets: number
    renderQuality: "low" | "medium" | "high"
    enableGestures: boolean
    enablePersistence: boolean
    enableCollaboration: boolean
    enableAnalytics: boolean
    supportedModelFormats: string[]
    performanceMode: "balanced" | "quality" | "performance"
  }
}

export const defaultConfig: VizuantConfig = {
  apiKey: "",
  baseUrl: "https://api.vizuant.com",
  version: "1.0.0",
  arSettings: {
    experienceType: "marker",
    markerType: "image",
    maxSimultaneousTargets: 1,
    renderQuality: "medium",
    enableGestures: true,
    enablePersistence: false,
    enableCollaboration: false,
    enableAnalytics: true,
    supportedModelFormats: ["glb", "gltf", "obj"],
    performanceMode: "balanced",
  },
}

