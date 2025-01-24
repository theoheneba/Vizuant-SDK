import type React from "react"
import { useEffect, useRef } from "react"
import { VizuantSDK } from "../sdk/vizuant-sdk"

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

      // Create a text object for the business card info
      const textObject = sdkRef.current.createARObject("business-card-text", "")
      textObject.setText(`${name}\n${title}\n${company}\n${email}\n${phone}`)
      textObject.setPosition(-0.5, 0, -0.5)
      textObject.setScale(0.1, 0.1, 0.1)

      marker.addChild(textObject)

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

