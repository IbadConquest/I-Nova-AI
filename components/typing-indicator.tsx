"use client"

import { useEffect, useRef } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { gsap } from "gsap"

export function TypingIndicator() {
  const dotsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (dotsRef.current) {
      const dots = dotsRef.current.children

      gsap.to(dots, {
        y: -4,
        duration: 0.6,
        ease: "power2.inOut",
        stagger: 0.1,
        repeat: -1,
        yoyo: true,
      })
    }
  }, [])

  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className="bg-muted">AI</AvatarFallback>
      </Avatar>

      <div className="glass-strong border border-border/50 rounded-2xl px-4 py-3">
        <div ref={dotsRef} className="flex gap-1">
          <div className="w-2 h-2 bg-muted-foreground rounded-full" />
          <div className="w-2 h-2 bg-muted-foreground rounded-full" />
          <div className="w-2 h-2 bg-muted-foreground rounded-full" />
        </div>
      </div>
    </div>
  )
}
