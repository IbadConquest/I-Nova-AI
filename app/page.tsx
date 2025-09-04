"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { PricingSection } from "@/components/pricing-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { UseCasesSection } from "@/components/use-cases-section"
import { FAQSection } from "@/components/faq-section"
import { CTASection } from "@/components/cta-section"
import { TrustedBySection } from "@/components/trusted-by-section"
import { LoadingScreen } from "@/components/loading-screen"
import { AnimatedBackground } from "@/components/animated-background"
import {
  createScrollAnimation,
  createStaggerAnimation,
  createFloatingAnimation,
  createMagneticEffect,
  createParallaxEffect,
  createHoverAnimations,
  animationPresets,
} from "@/lib/animations"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined" || isLoading) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-badge",
        { opacity: 0, y: 20, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
      )

      gsap.fromTo(
        ".hero-title",
        { opacity: 0, y: 50, rotateX: 15 },
        { opacity: 1, y: 0, rotateX: 0, duration: 1.2, delay: 0.2, ease: "power3.out" },
      )

      gsap.fromTo(
        ".hero-description",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: "power2.out" },
      )

      gsap.fromTo(
        ".hero-buttons",
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.7, ease: "back.out(1.7)" },
      )

      gsap.fromTo(
        ".hero-preview",
        { opacity: 0, x: 100, rotateY: 25, scale: 0.8 },
        { opacity: 1, x: 0, rotateY: 0, scale: 1, duration: 1.5, delay: 0.9, ease: "power3.out" },
      )

      createScrollAnimation(".animate-section", animationPresets.fadeInUp)
      createStaggerAnimation(".feature-card", animationPresets.scaleIn, 0.15)
      createStaggerAnimation(".pricing-card", animationPresets.slideInUp, 0.2)

      createFloatingAnimation(".float-card")

      createMagneticEffect(".magnetic-button")

      createParallaxEffect(".parallax-bg", 0.3)
      createParallaxEffect(".parallax-slow", 0.1)

      createHoverAnimations()

      gsap.utils.toArray(".testimonial-card").forEach((card: any, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, rotateY: 45, z: -100 },
          {
            opacity: 1,
            rotateY: 0,
            z: 0,
            duration: 1,
            delay: index * 0.3,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        )
      })

      gsap.utils.toArray(".faq-item").forEach((item: any, index) => {
        gsap.fromTo(
          item,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            delay: index * 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        )
      })

      gsap.to(".cta-glow", {
        scale: 1.1,
        opacity: 0.8,
        duration: 2,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
      })
    }, containerRef)

    return () => ctx.revert()
  }, [isLoading])

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-nova-gradient dark:bg-nova-gradient-dark relative">
      <AnimatedBackground />
      <Navigation />

      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <TrustedBySection />
        <UseCasesSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  )
}
