import * as THREE from "three"
import type { ARObject } from "./ARObject"

export class ARMarker {
  private threeObject: THREE.Object3D

  constructor(
    public id: string,
    public imageUrl: string,
  ) {
    this.threeObject = new THREE.Group()
  }

  setPosition(x: number, y: number, z: number): void {
    this.threeObject.position.set(x, y, z)
  }

  setRotation(x: number, y: number, z: number): void {
    this.threeObject.rotation.set(x, y, z)
  }

  addChild(object: ARObject): void {
    const childObject = object.getThreeObject()
    if (childObject) {
      this.threeObject.add(childObject)
    }
  }

  getThreeObject(): THREE.Object3D {
    return this.threeObject
  }
}

