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

    const loader = new THREE.FontLoader()
    loader.load("/path/to/helvetiker_regular.typeface.json", (font) => {
      const textGeometry = new THREE.TextGeometry(text, {
        font: font,
        size: 0.1,
        height: 0.01,
      })
      const textMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 })
      this.textMesh = new THREE.Mesh(textGeometry, textMaterial)
      this.threeObject.add(this.textMesh)
    })
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

  getThreeObject(): THREE.Object3D | null {
    return this.threeObject
  }
}

