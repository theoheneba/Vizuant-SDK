import type React from "react"
import { useEffect, useRef } from "react"
import { VizuantSDK } from "../vizuant-sdk" // Update this import path

interface ARBusinessCardProps {
  name: string
  title: string
  company: string
  email: string
  phone: string
  markerImage: string
}

export const ARBusinessCard: React.FC<ARBusinessCardProps> = ({ name, title, company, email, phone, markerImage }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sdkRef = useRef<VizuantSDK | null>(null)

  useEffect(() => {
    if (containerRef.current) {
      sdkRef.current = new VizuantSDK({
        apiKey: "your-api-key-here",
        arSettings: {
          experienceType: "marker",
          enableGestures: true,
        },
      })

      sdkRef.current.initialize()
      const arScene = sdkRef.current.createARScene(containerRef.current.id)

      const marker = arScene.createMarker("business-card-marker", markerImage)

      // Create a simple 3D text object for the business card info
      const loader = new THREE.FontLoader()
      loader.load("/path/to/helvetiker_regular.typeface.json", (font) => {
        const textGeometry = new THREE.TextGeometry(`${name}\n${title}\n${company}\n${email}\n${phone}`, {
          font: font,
          size: 0.1,
          height: 0.01,
        })
        const textMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 })
        const textMesh = new THREE.Mesh(textGeometry, textMaterial)
        textMesh.position.set(-0.5, 0, -0.5)
        marker.add(textMesh)
      })

      sdkRef.current.startARSession()

      return () => {
        if (sdkRef.current) {
          sdkRef.current.stopARSession()
        }
      }
    }
  }, [markerImage, name, title, company, email, phone])

  return <div id="ar-business-card-container" ref={containerRef} style={{ width: "100%", height: "400px" }} />
}

