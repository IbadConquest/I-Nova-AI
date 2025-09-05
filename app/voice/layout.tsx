"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AuthGuard } from "@/components/auth-guard"
import { VoiceAuthProvider } from "@/components/voice-auth-provider"
import { AnimatedBackground } from "@/components/animated-background"
import { Button } from "@/components/ui/button"
import { 
  Mic, 
  Volume2, 
  Settings, 
  User, 
  Home,
  Headphones,
  PlayCircle,
  MicIcon,
  SpeakerIcon
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type React from "react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const voiceNavItems = [
  { href: "/voice", icon: Home, label: "Dashboard" },
  { href: "/voice/tts", icon: Volume2, label: "Text to Speech" },
  { href: "/voice/stt", icon: Mic, label: "Speech to Text" },
  { href: "/voice/dubbing", icon: Headphones, label: "Voice Dubbing" },
  { href: "/voice/profile", icon: User, label: "Profile" },
]

export default function VoiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === "undefined") return

    const ctx = gsap.context(() => {
      // Animate sidebar items
      gsap.fromTo(
        ".voice-nav-item",
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        }
      )

      // Animate main content
      gsap.fromTo(
        ".voice-content",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.3,
          ease: "power2.out",
        }
      )

      // Floating animation for voice elements
      gsap.to(".voice-float", {
        y: -10,
        duration: 2,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
      })

    }, containerRef)

    return () => ctx.revert()
  }, [pathname])

  return (
    <VoiceAuthProvider>
      <AuthGuard>
        <div
          ref={containerRef}
          className="min-h-screen bg-nova-gradient dark:bg-nova-gradient-dark relative"
        >
          <AnimatedBackground />
          <Navigation />

          <div className="flex min-h-[calc(100vh-4rem)]">
            {/* Sidebar */}
            <div
              ref={sidebarRef}
              className="w-64 glass-strong border-r border-border/50 hidden md:block"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-accent grid place-items-center shadow-lg voice-float">
                    <Volume2 className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="font-bold text-lg text-foreground">Voice Studio</h1>
                </div>

                <nav className="space-y-2">
                  {voiceNavItems.map((item, index) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`voice-nav-item flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                        }`}
                      >
                        <item.icon
                          className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                            isActive ? "text-primary-foreground" : ""
                          }`}
                        />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    )
                  })}
                </nav>

                <div className="mt-8 p-4 glass rounded-xl border border-border/30">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-muted-foreground">API Status</span>
                  </div>
                  <p className="text-xs text-green-400">ElevenLabs Connected</p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 voice-content">
              <div className="p-6 md:p-8">
                {children}
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </AuthGuard>
    </VoiceAuthProvider>
  )
}