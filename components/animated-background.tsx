"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const particles = containerRef.current.querySelectorAll(".particle")

    particles.forEach((particle, index) => {
      gsap.set(particle, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        scale: Math.random() * 0.5 + 0.5,
      })

      gsap.to(particle, {
        x: `+=${Math.random() * 200 - 100}`,
        y: `+=${Math.random() * 200 - 100}`,
        rotation: 360,
        duration: 10 + Math.random() * 20,
        ease: "none",
        repeat: -1,
        yoyo: true,
        delay: index * 0.1,
      })

      gsap.to(particle, {
        opacity: Math.random() * 0.5 + 0.3,
        duration: 2 + Math.random() * 3,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
        delay: Math.random() * 2,
      })
    })
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="particle absolute w-2 h-2 bg-primary/20 rounded-full" />
      ))}
    </div>
  )
}
