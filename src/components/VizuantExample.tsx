"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { VizuantSDK } from "../vizuant-sdk"
import { Button } from "@/components/ui/button"

export const VizuantExample: React.FC = () => {
  const sdkRef = useRef<VizuantSDK | null>(null)
  const [sceneId, setSceneId] = useState<string | null>(null)

  useEffect(() => {
    sdkRef.current = new VizuantSDK({
      apiKey: "your-api-key-here",
      arSettings: {
        experienceType: "marker",
        enableGestures: true,
        enablePersistence: true,
        enableCollaboration: true,
        enableAnalytics: true,
        performanceMode: "balanced",
      },
    })
    sdkRef.current.initialize()

    const arScene = sdkRef.current.createARScene("ar-container")

    const marker = arScene.createMarker("marker1", "path/to/marker/image.png")
    marker.setPosition(0, 0, -5)

    sdkRef.current.loadModel("path/to/3d/model.glb").then((object) => {
      object.setPosition(0, 1, -5)
      object.setScale(1, 1, 1)
    })

    sdkRef.current.startARSession()

    return () => {
      if (sdkRef.current) {
        sdkRef.current.stopARSession()
      }
    }
  }, [])

  const handleSaveScene = async () => {
    if (sdkRef.current) {
      const newSceneId = `scene-${Date.now()}`
      await sdkRef.current.saveARScene(newSceneId)
      setSceneId(newSceneId)
    }
  }

  const handleLoadScene = async () => {
    if (sdkRef.current && sceneId) {
      await sdkRef.current.loadARScene(sceneId)
    }
  }

  const handleJoinCollaboration = () => {
    if (sdkRef.current) {
      sdkRef.current.joinCollaborationSession("demo-session")
    }
  }

  const handleLeaveCollaboration = () => {
    if (sdkRef.current) {
      sdkRef.current.leaveCollaborationSession()
    }
  }

  const handleSetPerformanceMode = (mode: "balanced" | "quality" | "performance") => {
    if (sdkRef.current) {
      sdkRef.current.setPerformanceMode(mode)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Vizuant SDK AR Example</h1>
      <div id="ar-container" className="w-full h-[400px] border border-gray-300 mb-4"></div>
      <div className="space-y-2">
        <Button onClick={handleSaveScene}>Save Scene</Button>
        <Button onClick={handleLoadScene} disabled={!sceneId}>
          Load Scene
        </Button>
        <Button onClick={handleJoinCollaboration}>Join Collaboration</Button>
        <Button onClick={handleLeaveCollaboration}>Leave Collaboration</Button>
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Performance Mode</h2>
        <div className="space-x-2">
          <Button onClick={() => handleSetPerformanceMode("balanced")}>Balanced</Button>
          <Button onClick={() => handleSetPerformanceMode("quality")}>Quality</Button>
          <Button onClick={() => handleSetPerformanceMode("performance")}>Performance</Button>
        </div>
      </div>
    </div>
  )
}

