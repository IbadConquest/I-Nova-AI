"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Volume2,
  Mic,
  Headphones,
  PlayCircle,
  PauseCircle,
  Download,
  Upload,
  Zap,
  Clock,
  Sparkles,
  TrendingUp,
  FileAudio,
  Users,
} from "lucide-react"
import Link from "next/link"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const statsData = [
  {
    title: "Audio Generated",
    value: "2.4k",
    unit: "minutes",
    icon: Volume2,
    change: "+12%",
    color: "text-blue-400",
  },
  {
    title: "Voice Models Used",
    value: "8",
    unit: "active",
    icon: Mic,
    change: "+3",
    color: "text-green-400",
  },
  {
    title: "Projects",
    value: "24",
    unit: "completed",
    icon: FileAudio,
    change: "+6",
    color: "text-purple-400",
  },
  {
    title: "Team Members",
    value: "5",
    unit: "active",
    icon: Users,
    change: "+1",
    color: "text-orange-400",
  },
]

const recentProjects = [
  {
    id: 1,
    name: "Marketing Podcast Intro",
    type: "TTS",
    duration: "2:34",
    status: "completed",
    voice: "Rachel (Professional)",
  },
  {
    id: 2,
    name: "Product Demo Voiceover",
    type: "Dubbing",
    duration: "5:42",
    status: "processing",
    voice: "Marcus (Conversational)",
  },
  {
    id: 3,
    name: "Customer Service Recording",
    type: "STT",
    duration: "8:15",
    status: "completed",
    voice: "Automated Transcription",
  },
]

const quickActions = [
  {
    title: "Generate Voice",
    description: "Create AI-powered speech from text",
    icon: Volume2,
    href: "/voice/tts",
    color: "from-blue-500 to-cyan-400",
  },
  {
    title: "Transcribe Audio",
    description: "Convert speech to accurate text",
    icon: Mic,
    href: "/voice/stt",
    color: "from-green-500 to-teal-400",
  },
  {
    title: "Voice Dubbing",
    description: "Replace voices in existing audio",
    icon: Headphones,
    href: "/voice/dubbing",
    color: "from-purple-500 to-pink-400",
  },
]

export default function VoiceDashboard() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [audioUsage, setAudioUsage] = useState(65)

  useEffect(() => {
    if (typeof window === "undefined") return

    const ctx = gsap.context(() => {
      // Hero animation
      gsap.fromTo(
        ".dashboard-hero",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      )

      // Stats cards animation
      gsap.fromTo(
        ".stats-card",
        { y: 40, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.3,
          ease: "back.out(1.7)",
        }
      )

      // Quick actions animation
      gsap.fromTo(
        ".quick-action",
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          delay: 0.6,
          ease: "power3.out",
        }
      )

      // Recent projects animation
      gsap.fromTo(
        ".project-item",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.9,
          ease: "power2.out",
        }
      )

      // Floating animations
      gsap.to(".float-slow", {
        y: -8,
        duration: 3,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
      })

      gsap.to(".float-fast", {
        y: -12,
        duration: 2,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
      })

      // Progress bar animation
      gsap.fromTo(
        ".usage-progress",
        { width: "0%" },
        {
          width: `${audioUsage}%`,
          duration: 2,
          delay: 1.2,
          ease: "power2.out",
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [audioUsage])

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto space-y-8">
      {/* Dashboard Header */}
      <div className="dashboard-hero">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-bold text-foreground">
            Voice Studio
            <span className="ml-3 text-2xl">🎙️</span>
          </h1>
          <Badge variant="secondary" className="px-3 py-1">
            <Sparkles className="w-3 h-3 mr-1" />
            Pro Plan
          </Badge>
        </div>
        <p className="text-xl text-muted-foreground mb-6">
          Transform your content with AI-powered voice technology
        </p>

        {/* Usage Overview */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Monthly Usage
            </CardTitle>
            <CardDescription>Audio generation quota for December 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Used: 65/100 hours</span>
                <span className="text-muted-foreground">35 hours remaining</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div
                  className="usage-progress h-full bg-gradient-to-r from-primary to-accent rounded-full"
                  style={{ width: "0%" }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <Card key={stat.title} className="stats-card glass hover:glass-strong transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <span className="text-sm text-muted-foreground">{stat.unit}</span>
                  </div>
                  <p className={`text-xs ${stat.color} flex items-center gap-1 mt-1`}>
                    <TrendingUp className="w-3 h-3" />
                    {stat.change} this month
                  </p>
                </div>
                <div className="float-slow">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-primary" />
            Quick Actions
          </CardTitle>
          <CardDescription>Start creating with these popular workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link key={action.title} href={action.href}>
                <div className="quick-action group p-6 rounded-xl glass hover:glass-strong transition-all cursor-pointer border border-border/30 hover:border-primary/50">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} p-3 mb-4 float-fast group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-full h-full text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Projects */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Recent Projects
          </CardTitle>
          <CardDescription>Your latest voice generation activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentProjects.map((project, index) => (
              <div
                key={project.id}
                className="project-item flex items-center justify-between p-4 rounded-lg glass hover:glass-strong transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    {project.type === "TTS" && <Volume2 className="w-5 h-5 text-primary" />}
                    {project.type === "Dubbing" && <Headphones className="w-5 h-5 text-purple-400" />}
                    {project.type === "STT" && <Mic className="w-5 h-5 text-green-400" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{project.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {project.voice} • {project.duration}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={project.status === "completed" ? "default" : "secondary"}
                    className={
                      project.status === "completed"
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    }
                  >
                    {project.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Button variant="outline">
              View All Projects
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}