"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

const companies = ["NovaWorks", "OrbitLab", "Polaro", "BlueWhale", "Lockify", "Shipr", "MixLabs", "TechFlow"]

export function TrustedBySection() {
  const marqueeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!marqueeRef.current) return

    const marquee = marqueeRef.current
    const marqueeContent = marquee.querySelector(".marquee-content")

    if (marqueeContent) {
      const contentWidth = marqueeContent.scrollWidth

      gsap.to(marqueeContent, {
        x: -contentWidth / 2,
        duration: 20,
        ease: "none",
        repeat: -1,
      })
    }
  }, [])

  return (
    <section className="animate-section py-16 bg-muted/20 border-y border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-foreground">Trusted by fast-moving teams</h2>
          <span className="text-muted-foreground text-sm">Demo logos</span>
        </div>

        <div ref={marqueeRef} className="overflow-hidden">
          <div className="marquee-content flex items-center gap-12 text-muted-foreground">
            {[...companies, ...companies].map((company, index) => (
              <div key={index} className="flex items-center gap-2 whitespace-nowrap">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">{company.charAt(0)}</span>
                </div>
                <span className="font-medium">{company}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
