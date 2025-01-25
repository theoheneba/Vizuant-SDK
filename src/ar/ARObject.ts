import * as THREE from "three"

export class ARObject {
  private threeObject: THREE.Object3D | null = null
  private textMesh: THREE.Mesh | null = null

  constructor(
    public id: string,
    public objectUrl: string,
  ) {}

  setThreeObject(object: THREE.Object3D): void {
    this.threeObject = object
  }

  setText(text: string): void {
    if (!this.threeObject) {
      this.threeObject = new THREE.Group()
    }

    if (this.textMesh) {
      this.threeObject.remove(this.textMesh)
    }

    // Note: FontLoader and TextGeometry are not available in Three.js core
    // You may need to import them separately or use a different approach for text rendering
    const geometry = new THREE.PlaneGeometry(1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0x000000 })
    this.textMesh = new THREE.Mesh(geometry, material)
    this.threeObject.add(this.textMesh)

    // You would need to implement text rendering here
    console.log(`Setting text: ${text}`)
  }

  setPosition(x: number, y: number, z: number): void {
    if (this.threeObject) {
      this.threeObject.position.set(x, y, z)
    }
  }

  setRotation(x: number, y: number, z: number): void {
    if (this.threeObject) {
      this.threeObject.rotation.set(x, y, z)
    }
  }

  setScale(x: number, y: number, z: number): void {
    if (this.threeObject) {
      this.threeObject.scale.set(x, y, z)
    }
  }

  getPosition(): THREE.Vector3 {
    return this.threeObject ? this.threeObject.position : new THREE.Vector3()
  }

  getRotation(): THREE.Euler {
    return this.threeObject ? this.threeObject.rotation : new THREE.Euler()
  }

  getScale(): THREE.Vector3 {
    return this.threeObject ? this.threeObject.scale : new THREE.Vector3()
  }

  getThreeObject(): THREE.Object3D | null {
    return this.threeObject
  }
}

