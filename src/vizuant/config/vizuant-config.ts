export interface VizuantConfig {
  apiKey: string
  arSettings: {
    experienceType: "marker" | "location" | "surface"
    markerType: "image" | "object"
    maxSimultaneousTargets: number
    renderQuality: "low" | "medium" | "high"
    enableGestures: boolean
    performanceMode: "balanced" | "quality" | "performance"
  }
}

export const defaultConfig: VizuantConfig = {
  apiKey: "",
  arSettings: {
    experienceType: "marker",
    markerType: "image",
    maxSimultaneousTargets: 1,
    renderQuality: "medium",
    enableGestures: true,
    performanceMode: "balanced",
  },
}

