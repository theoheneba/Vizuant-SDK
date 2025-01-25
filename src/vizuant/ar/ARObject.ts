import type * as THREE from "three"

export class ARObject {
  private threeObject: THREE.Object3D | null = null

  constructor(
    public id: string,
    public objectUrl: string,
  ) {}

  setThreeObject(object: THREE.Object3D): void {
    this.threeObject = object
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

