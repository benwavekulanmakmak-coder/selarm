"use client"

import { useEffect, useRef } from "react"

export function Background() {
  const particlesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = particlesRef.current
    if (!container) return

    const particleCount = 50

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div")
      particle.className = "particle"
      particle.style.left = `${Math.random() * 100}%`
      particle.style.top = `${Math.random() * 100}%`
      const size = Math.random() * 3 + 1
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.animationDelay = `${Math.random() * 20}s`
      particle.style.animationDuration = `${Math.random() * 10 + 15}s`
      container.appendChild(particle)
    }

    return () => {
      container.innerHTML = ""
    }
  }, [])

  return (
    <div className="bg-wrap">
      <div className="bg-gradient bg-gradient-1" />
      <div className="bg-gradient bg-gradient-2" />
      <div className="bg-gradient bg-gradient-3" />
      <div className="bg-grid" />
      <div className="bg-glow" />
      <div ref={particlesRef} className="absolute inset-0" />
    </div>
  )
}
