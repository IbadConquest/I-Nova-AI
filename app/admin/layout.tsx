"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AuthGuard } from "@/components/auth-guard"
import { AnimatedBackground } from "@/components/animated-background"
import { Button } from "@/components/ui/button"
import { 
  Settings, 
  Users, 
  Key, 
  Mail, 
  Image,
  BarChart3,
  Shield,
  Home,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type React from "react"

const adminNavItems = [
  { href: "/admin", icon: BarChart3, label: "Dashboard" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/api-keys", icon: Key, label: "API Keys" },
  { href: "/admin/contact-forms", icon: Mail, label: "Contact Forms" },
  { href: "/admin/image-configs", icon: Image, label: "Image Configs" },
]

export default function AdminLayout({
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
        ".admin-nav-item",
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
        ".admin-content",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.3,
          ease: "power2.out",
        }
      )

      // Floating animation for admin elements
      gsap.to(".admin-float", {
        y: -8,
        duration: 2.5,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
      })

    }, containerRef)

    return () => ctx.revert()
  }, [pathname])

  return (
    <AuthGuard>
      <div
        ref={containerRef}
        className="min-h-screen bg-nova-gradient dark:bg-nova-gradient-dark relative"
      >
        <AnimatedBackground />
        <Navigation />

        <div className="flex min-h-[calc(100vh-4rem)]">
          {/* Admin Sidebar */}
          <div
            ref={sidebarRef}
            className="w-64 glass-strong border-r border-border/50 hidden md:block"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-orange-400 grid place-items-center shadow-lg admin-float">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h1 className="font-bold text-lg text-foreground">Admin Panel</h1>
              </div>

              <nav className="space-y-2">
                {adminNavItems.map((item, index) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`admin-nav-item flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
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
                  <span className="text-sm text-muted-foreground">System Status</span>
                </div>
                <p className="text-xs text-green-400">All Services Online</p>
              </div>

              <div className="mt-4">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/">
                    <Home className="w-4 h-4 mr-2" />
                    Back to Site
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 admin-content">
            <div className="p-6 md:p-8">
              {children}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </AuthGuard>
  )
}