import React from 'react';
import { useEffect, useRef } from "react"
import { VizuantSDK } from "../sdk/vizuant-sdk"

interface ARBusinessCardProps {
  name: string
  title: string
  company: string
  email: string
  phone: string
  markerImage: string
  apiKey?: string
}

export const ARBusinessCard: React.FC<ARBusinessCardProps> = ({
  name,
  title,
  company,
  email,
  phone,
  markerImage,
  apiKey = process.env.NEXT_PUBLIC_VIZUANT_API_KEY,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sdkRef = useRef<VizuantSDK | null>(null)

  useEffect(() => {
    if (!apiKey) {
      console.error(
        "Vizuant API key is required. Please provide it as a prop or set NEXT_PUBLIC_VIZUANT_API_KEY environment variable.",
      )
      return
    }

    if (containerRef.current) {
      try {
        sdkRef.current = new VizuantSDK({
          apiKey,
          arSettings: {
            experienceType: "marker",
            markerType: "image",
            maxSimultaneousTargets: 1,
            renderQuality: "medium",
            enableGestures: true,
            enablePersistence: false,
            enableCollaboration: false,
            enableAnalytics: true,
            supportedModelFormats: ["glb", "gltf", "obj"],
            performanceMode: "balanced",
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
      } catch (error) {
        console.error("Failed to initialize Vizuant SDK:", error)
      }
    }
  }, [apiKey, markerImage, name, title, company, email, phone])

  return (
    <div className="relative">
      <div id="ar-business-card-container" ref={containerRef} className="w-full h-[400px] bg-gray-100 rounded-lg" />
      {!apiKey && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80">
          <p className="text-red-500">API key is required</p>
        </div>
      )}
    </div>
  )
}

