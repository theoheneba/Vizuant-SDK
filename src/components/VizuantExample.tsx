"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { VizuantSDK } from "../sdk/vizuant-sdk"
import { Button } from "@/components/ui/button"

export const VizuantExample: React.FC = () => {
  const sdkRef = useRef<VizuantSDK | null>(null)
  const [sceneId, setSceneId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isARJSLoaded, setIsARJSLoaded] = useState(false)

  useEffect(() => {
    const checkARJSLoaded = () => {
      if (window.AFRAME && window.AFRAME.scenes[0] && window.AFRAME.scenes[0].hasLoaded) {
        setIsARJSLoaded(true)
      } else {
        setTimeout(checkARJSLoaded, 100) // Check again after 100ms
      }
    }

    window.addEventListener("load", checkARJSLoaded)
    return () => window.removeEventListener("load", checkARJSLoaded)
  }, [])

  useEffect(() => {
    if (!isARJSLoaded) return

    const initializeAR = async () => {
      try {
        // Check for camera permissions
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        stream.getTracks().forEach((track) => track.stop()) // Stop the stream after permission check

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

        const arScene = sdkRef.current.createARScene("ar-container")

        const markerUrl = "https://example.com/path/to/marker/image.png" // Replace with your actual marker URL
        const marker = arScene.createMarker("marker1", markerUrl)
        marker.setPosition(0, 0, -5)

        // Verify marker image accessibility
        const markerImg = new Image()
        markerImg.onload = () => {
          console.log("Marker image loaded successfully")
        }
        markerImg.onerror = () => {
          throw new Error("Failed to load marker image. Please check the URL.")
        }
        markerImg.src = markerUrl

        sdkRef.current
          .loadModel("https://example.com/path/to/3d/model.glb")
          .then((object) => {
            object.setPosition(0, 1, -5)
            object.setScale(1, 1, 1)
          })
          .catch((error) => {
            console.error("Failed to load 3D model:", error)
            setError("Failed to load 3D model. Please check the URL and try again.")
          })

        sdkRef.current.startARSession()
      } catch (error) {
        console.error("Failed to initialize AR experience:", error)
        setError(`Failed to initialize AR experience: ${error.message}`)
      }
    }

    initializeAR()

    return () => {
      if (sdkRef.current) {
        sdkRef.current.stopARSession()
      }
    }
  }, [isARJSLoaded])

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
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : !isARJSLoaded ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Loading: </strong>
          <span className="block sm:inline">Waiting for AR.js to load...</span>
        </div>
      ) : (
        <div id="ar-container" className="w-full h-[400px] border border-gray-300 mb-4"></div>
      )}
      <div className="space-y-2">
        <Button onClick={handleSaveScene} disabled={!isARJSLoaded}>
          Save Scene
        </Button>
        <Button onClick={handleLoadScene} disabled={!isARJSLoaded || !sceneId}>
          Load Scene
        </Button>
        <Button onClick={handleJoinCollaboration} disabled={!isARJSLoaded}>
          Join Collaboration
        </Button>
        <Button onClick={handleLeaveCollaboration} disabled={!isARJSLoaded}>
          Leave Collaboration
        </Button>
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Performance Mode</h2>
        <div className="space-x-2">
          <Button onClick={() => handleSetPerformanceMode("balanced")} disabled={!isARJSLoaded}>
            Balanced
          </Button>
          <Button onClick={() => handleSetPerformanceMode("quality")} disabled={!isARJSLoaded}>
            Quality
          </Button>
          <Button onClick={() => handleSetPerformanceMode("performance")} disabled={!isARJSLoaded}>
            Performance
          </Button>
        </div>
      </div>
    </div>
  )
}

