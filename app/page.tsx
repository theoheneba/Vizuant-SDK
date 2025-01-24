"use client"

import { ARBusinessCard } from "@/components/ARBusinessCard"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-4 bg-background">
      <h1 className="text-4xl font-bold mb-8">Vizuant SDK Demo</h1>
      <ARBusinessCard
        name="John Doe"
        title="Software Engineer"
        company="Tech Corp"
        email="john@example.com"
        phone="+1 234 567 8900"
        markerImage="https://example.com/marker.png"
      />
    </div>
  )
}

