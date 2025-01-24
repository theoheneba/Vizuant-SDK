import type { ARScene } from "./ARScene"

export class ARPersistenceManager {
  constructor(private enabled: boolean) {}

  async saveScene(sceneId: string, scene: ARScene): Promise<void> {
    if (!this.enabled) {
      throw new Error("Persistence is not enabled")
    }

    const sceneData = {
      markers: scene.getMarkers().map((marker) => ({
        id: marker.id,
        imageUrl: marker.imageUrl,
        position: marker.getPosition(),
        rotation: marker.getRotation(),
      })),
      objects: scene.getObjects().map((object) => ({
        id: object.id,
        objectUrl: object.objectUrl,
        position: object.getPosition(),
        rotation: object.getRotation(),
        scale: object.getScale(),
      })),
    }

    try {
      localStorage.setItem(`ar-scene-${sceneId}`, JSON.stringify(sceneData))
      console.log(`Saved AR scene with ID: ${sceneId}`)
    } catch (error) {
      console.error("Failed to save AR scene:", error)
      throw new Error("Failed to save AR scene. Please try again.")
    }
  }

  async loadScene(sceneId: string): Promise<any> {
    if (!this.enabled) {
      throw new Error("Persistence is not enabled")
    }

    try {
      const sceneDataString = localStorage.getItem(`ar-scene-${sceneId}`)
      if (!sceneDataString) {
        throw new Error(`No saved scene found with ID: ${sceneId}`)
      }
      const sceneData = JSON.parse(sceneDataString)
      console.log(`Loaded AR scene with ID: ${sceneId}`)
      return sceneData
    } catch (error) {
      console.error("Failed to load AR scene:", error)
      throw new Error("Failed to load AR scene. Please try again.")
    }
  }
}

