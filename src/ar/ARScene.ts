import * as THREE from "three"
import { ARToolkitSource, ARToolkitContext } from "@ar-js-org/ar.js/three.js/build/ar-threex.js"
import { ARMarker } from "./ARMarker"
import { ARObject } from "./ARObject"
import type { GestureRecognizer } from "./GestureRecognizer"
import type { PerformanceOptimizer } from "./PerformanceOptimizer"

export class ARScene {
  private container: HTMLElement
  private markers: Map<string, ARMarker> = new Map()
  private objects: Map<string, ARObject> = new Map()
  private scene: THREE.Scene
  private camera: THREE.Camera
  private renderer: THREE.WebGLRenderer
  private arToolkitSource: ARToolkitSource
  private arToolkitContext: ARToolkitContext

  constructor(
    containerId: string,
    private settings: any,
    private gestureRecognizer: GestureRecognizer,
    private performanceOptimizer: PerformanceOptimizer,
  ) {
    const container = document.getElementById(containerId)
    if (!container) {
      throw new Error(`Container with id ${containerId} not found`)
    }
    this.container = container

    try {
      this.initializeScene()
    } catch (error) {
      console.error("Failed to initialize AR scene:", error)
      this.showErrorMessage("Failed to initialize AR. Please check your device compatibility.")
    }
  }

  private initializeScene(): void {
    this.scene = new THREE.Scene()
    this.camera = new THREE.Camera()
    this.scene.add(this.camera)

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.container.appendChild(this.renderer.domElement)

    this.arToolkitSource = new ARToolkitSource({
      sourceType: "webcam",
    })

    this.arToolkitContext = new ARToolkitContext({
      cameraParametersUrl: "data/camera_para.dat",
      detectionMode: "mono",
    })

    window.addEventListener("resize", () => this.onResize())
  }

  createMarker(markerId: string, markerImage: string): ARMarker {
    try {
      const marker = new ARMarker(markerId, markerImage)
      this.markers.set(markerId, marker)

      const markerRoot = new THREE.Group()
      this.scene.add(markerRoot)
      const markerControls = new (window as any).THREEx.ArMarkerControls(this.arToolkitContext, markerRoot, {
        type: "pattern",
        patternUrl: markerImage,
      })

      return marker
    } catch (error) {
      console.error("Failed to create AR marker:", error)
      throw new Error("Failed to create AR marker. Please try again.")
    }
  }

  createObject(objectId: string, objectUrl: string): ARObject {
    try {
      const object = new ARObject(objectId, objectUrl)
      this.objects.set(objectId, object)

      const loader = new THREE.GLTFLoader()
      loader.load(
        objectUrl,
        (gltf) => {
          const model = gltf.scene
          this.scene.add(model)
          object.setThreeObject(model)
        },
        undefined,
        (error) => {
          console.error("Failed to load 3D object:", error)
          throw new Error("Failed to load 3D object. Please check the URL and try again.")
        },
      )

      return object
    } catch (error) {
      console.error("Failed to create AR object:", error)
      throw new Error("Failed to create AR object. Please try again.")
    }
  }

  start(): void {
    console.log("Starting AR session")
    this.performanceOptimizer.optimize(this)
    this.gestureRecognizer.attachToScene(this)

    this.arToolkitSource.init(
      () => {
        this.onResize()
      },
      (error: Error) => {
        console.error("Failed to initialize AR source:", error)
        this.showErrorMessage("Failed to access camera. Please check your permissions and try again.")
      },
    )

    this.arToolkitContext.init(() => {
      this.camera.projectionMatrix.copy(this.arToolkitContext.getProjectionMatrix())
    })

    this.animate()
  }

  stop(): void {
    console.log("Stopping AR session")
    this.gestureRecognizer.detachFromScene()
    cancelAnimationFrame(this.animationFrameId)
    this.renderer.dispose()
  }

  private animationFrameId = 0

  private animate(): void {
    this.animationFrameId = requestAnimationFrame(() => this.animate())
    if (this.arToolkitSource.ready) {
      this.arToolkitContext.update(this.arToolkitSource.domElement)
      this.scene.visible = true
    } else {
      this.scene.visible = false
    }
    this.renderer.render(this.scene, this.camera)
  }

  private onResize(): void {
    this.arToolkitSource.onResizeElement()
    this.arToolkitSource.copyElementSizeTo(this.renderer.domElement)
    if (this.arToolkitContext.arController !== null) {
      this.arToolkitSource.copyElementSizeTo(this.arToolkitContext.arController.canvas)
    }
  }

  private showErrorMessage(message: string): void {
    const errorElement = document.createElement("div")
    errorElement.style.position = "absolute"
    errorElement.style.top = "50%"
    errorElement.style.left = "50%"
    errorElement.style.transform = "translate(-50%, -50%)"
    errorElement.style.backgroundColor = "rgba(0, 0, 0, 0.7)"
    errorElement.style.color = "white"
    errorElement.style.padding = "20px"
    errorElement.style.borderRadius = "5px"
    errorElement.textContent = message
    this.container.appendChild(errorElement)
  }

  getMarkers(): ARMarker[] {
    return Array.from(this.markers.values())
  }

  getObjects(): ARObject[] {
    return Array.from(this.objects.values())
  }
}

