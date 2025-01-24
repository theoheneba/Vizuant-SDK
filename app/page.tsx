"use client"

import { ARBusinessCard } from "../src/components/ARBusinessCard"

export default function SyntheticV0PageForDeployment() {
  return (
    <ARBusinessCard
      name="John Doe"
      title="Software Engineer"
      company="Tech Corp"
      email="john@example.com"
      phone="+1 234 567 8900"
      markerImage="https://example.com/marker.png"
    />
  )
}

