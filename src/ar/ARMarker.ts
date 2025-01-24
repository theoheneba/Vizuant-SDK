export class ARMarker {
  constructor(
    public id: string,
    public imageUrl: string,
  ) {}

  setPosition(x: number, y: number, z: number): void {
    console.log(`Setting position of marker ${this.id} to (${x}, ${y}, ${z})`)
    // Implement position setting logic here
  }

  setRotation(x: number, y: number, z: number): void {
    console.log(`Setting rotation of marker ${this.id} to (${x}, ${y}, ${z})`)
    // Implement rotation setting logic here
  }
}

