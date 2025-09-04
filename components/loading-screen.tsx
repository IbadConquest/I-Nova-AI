"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

interface LoadingScreenProps {
  onComplete?: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !progressRef.current) return

    const tl = gsap.timeline({
      onComplete: () => {
        onComplete?.()
      },
    })

    // Animate logo entrance
    tl.fromTo(
      ".loading-logo",
      { opacity: 0, scale: 0.5, rotateY: 180 },
      { opacity: 1, scale: 1, rotateY: 0, duration: 1, ease: "back.out(1.7)" },
    )
      // Animate progress bar
      .to(progressRef.current, {
        width: "100%",
        duration: 2,
        ease: "power2.inOut",
      })
      // Animate text
      .fromTo(".loading-text", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=1.5")
      // Exit animation
      .to(containerRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        ease: "power2.inOut",
        delay: 0.5,
      })

    return () => {
      tl.kill()
    }
  }, [onComplete])

  return (
    <div
      ref={containerRef}
      className="loading-screen fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      <div className="text-center">
        <div className="loading-logo w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent grid place-items-center mx-auto mb-8">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M12 3l8.66 5v8L12 21l-8.66-5V8L12 3z" stroke="white" strokeWidth="1.6" />
          </svg>
        </div>

        <div className="loading-text mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Nova AI</h2>
          <p className="text-muted-foreground">Initializing your assistant...</p>
        </div>

        <div className="w-64 h-1 bg-muted rounded-full overflow-hidden mx-auto">
          <div
            ref={progressRef}
            className="loading-bar h-full bg-gradient-to-r from-primary to-accent rounded-full w-0"
          />
        </div>
      </div>
    </div>
  )
}
