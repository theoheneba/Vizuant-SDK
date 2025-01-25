import * as THREE from "three"
import { ARMarker } from "./ARMarker"
import { ARObject } from "./ARObject"

export class ARScene {
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer
  private markers: Map<string, ARMarker> = new Map()
  private objects: Map<string, ARObject> = new Map()

  constructor(
    private containerId: string,
    private settings: any,
  ) {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    const container = document.getElementById(containerId)
    if (container) {
      container.appendChild(this.renderer.domElement)
    } else {
      throw new Error(`Container with id ${containerId} not found`)
    }

    this.camera.position.z = 5
  }

  createMarker(markerId: string, markerImage: string): ARMarker {
    const marker = new ARMarker(markerId, markerImage)
    this.markers.set(markerId, marker)
    this.scene.add(marker.getThreeObject())
    return marker
  }

  createObject(objectId: string, objectUrl: string): ARObject {
    const object = new ARObject(objectId, objectUrl)
    this.objects.set(objectId, object)
    return object
  }

  start(): void {
    this.animate()
  }

  stop(): void {
    cancelAnimationFrame(this.animationFrameId)
  }

  private animationFrameId = 0

  private animate(): void {
    this.animationFrameId = requestAnimationFrame(() => this.animate())
    this.renderer.render(this.scene, this.camera)
  }
}

