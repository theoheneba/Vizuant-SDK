import type { ARScene } from "./ARScene"

export class CollaborationManager {
  private currentSession: string | null = null
  private socket: WebSocket | null = null

  constructor(private enabled: boolean) {}

  joinSession(sessionId: string, scene: ARScene): void {
    if (!this.enabled) {
      throw new Error("Collaboration is not enabled")
    }

    this.currentSession = sessionId
    this.socket = new WebSocket(`wss://your-collaboration-server.com/session/${sessionId}`)

    this.socket.onopen = () => {
      console.log(`Joined collaboration session: ${sessionId}`)
      this.sendSceneState(scene)
    }

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      this.handleCollaborationMessage(data, scene)
    }

    this.socket.onerror = (error) => {
      console.error("Collaboration WebSocket error:", error)
    }
  }

  leaveSession(): void {
    if (this.currentSession) {
      console.log(`Left collaboration session: ${this.currentSession}`)
      this.currentSession = null
      if (this.socket) {
        this.socket.close()
        this.socket = null
      }
    }
  }

  private sendSceneState(scene: ARScene): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const sceneState = {
        markers: scene.getMarkers().map((marker) => ({
          id: marker.id,
          position: marker.getPosition(),
          rotation: marker.getRotation(),
        })),
        objects: scene.getObjects().map((object) => ({
          id: object.id,
          position: object.getPosition(),
          rotation: object.getRotation(),
          scale: object.getScale(),
        })),
      }
      this.socket.send(JSON.stringify({ type: "sceneUpdate", data: sceneState }))
    }
  }

  private handleCollaborationMessage(message: any, scene: ARScene): void {
    switch (message.type) {
      case "sceneUpdate":
        this.updateSceneFromCollaborator(message.data, scene)
        break
      // Handle other message types as needed
    }
  }

  private updateSceneFromCollaborator(sceneState: any, scene: ARScene): void {
    sceneState.markers.forEach((markerData: any) => {
      const marker = scene.getMarkers().find((m) => m.id === markerData.id)
      if (marker) {
        marker.setPosition(markerData.position.x, markerData.position.y, markerData.position.z)
        marker.setRotation(markerData.rotation.x, markerData.rotation.y, markerData.rotation.z)
      }
    })

    sceneState.objects.forEach((objectData: any) => {
      const object = scene.getObjects().find((o) => o.id === objectData.id)
      if (object) {
        object.setPosition(objectData.position.x, objectData.position.y, objectData.position.z)
        object.setRotation(objectData.rotation.x, objectData.rotation.y, objectData.rotation.z)
        object.setScale(objectData.scale.x, objectData.scale.y, objectData.scale.z)
      }
    })
  }
}

