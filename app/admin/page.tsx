"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  Key,
  Mail,
  Image,
  Activity,
  TrendingUp,
  Server,
  Database,
  Shield,
  Zap,
  Clock,
  AlertCircle,
} from "lucide-react"

const statsData = [
  {
    title: "Total Users",
    value: "1,247",
    change: "+12%",
    icon: Users,
    color: "text-blue-400",
  },
  {
    title: "API Requests",
    value: "24.6k",
    change: "+8%",
    icon: Activity,
    color: "text-green-400",
  },
  {
    title: "Active Sessions",
    value: "89",
    change: "+15%",
    icon: Zap,
    color: "text-purple-400",
  },
  {
    title: "System Uptime",
    value: "99.9%",
    change: "0%",
    icon: Server,
    color: "text-orange-400",
  },
]

const recentActivity = [
  { id: 1, action: "New user registration", user: "john.doe@example.com", time: "2 minutes ago", type: "user" },
  { id: 2, action: "API key generated", user: "admin@nova.ai", time: "5 minutes ago", type: "api" },
  { id: 3, action: "Image config updated", user: "sarah.wilson@example.com", time: "10 minutes ago", type: "config" },
  { id: 4, action: "Contact form submitted", user: "contact@example.com", time: "15 minutes ago", type: "contact" },
  { id: 5, action: "User login", user: "mike.johnson@example.com", time: "20 minutes ago", type: "auth" },
]

const systemHealth = [
  { service: "API Gateway", status: "healthy", uptime: "99.9%" },
  { service: "Database", status: "healthy", uptime: "99.8%" },
  { service: "File Storage", status: "healthy", uptime: "100%" },
  { service: "Authentication", status: "healthy", uptime: "99.9%" },
  { service: "Voice Engine", status: "warning", uptime: "98.5%" },
]

export default function AdminDashboard() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const ctx = gsap.context(() => {
      // Hero animation
      gsap.fromTo(
        ".admin-hero",
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

      // Activity animation
      gsap.fromTo(
        ".activity-section",
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.6,
          ease: "power3.out",
        }
      )

      // Health section animation
      gsap.fromTo(
        ".health-section",
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.9,
          ease: "power3.out",
        }
      )

      // Floating animations
      gsap.to(".admin-icon", {
        y: -8,
        rotation: 5,
        duration: 3,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user": return <Users className="w-4 h-4 text-blue-400" />
      case "api": return <Key className="w-4 h-4 text-green-400" />
      case "config": return <Image className="w-4 h-4 text-purple-400" />
      case "contact": return <Mail className="w-4 h-4 text-orange-400" />
      case "auth": return <Shield className="w-4 h-4 text-red-400" />
      default: return <Activity className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "text-green-400 bg-green-500/20 border-green-500/30"
      case "warning": return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30"
      case "error": return "text-red-400 bg-red-500/20 border-red-500/30"
      default: return "text-gray-400 bg-gray-500/20 border-gray-500/30"
    }
  }

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="admin-hero">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
            <div className="admin-icon">
              <Shield className="w-10 h-10 text-red-400" />
            </div>
            Admin Dashboard
          </h1>
          <Badge variant="secondary" className="px-3 py-1">
            <Database className="w-3 h-3 mr-1" />
            Live Data
          </Badge>
        </div>
        <p className="text-xl text-muted-foreground">
          Monitor and manage your Nova AI platform
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <Card key={stat.title} className="stats-card glass hover:glass-strong transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className={`text-xs ${stat.color} flex items-center gap-1 mt-1`}>
                    <TrendingUp className="w-3 h-3" />
                    {stat.change} vs last month
                  </p>
                </div>
                <div className="admin-icon">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className="activity-section glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest system events and user actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-3 rounded-lg glass hover:glass-strong transition-all"
                >
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground truncate">{activity.user}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm">
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="health-section glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              System Health
            </CardTitle>
            <CardDescription>Monitor service status and uptime</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealth.map((service, index) => (
                <div
                  key={service.service}
                  className="flex items-center justify-between p-3 rounded-lg glass"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="font-medium text-foreground">{service.service}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{service.uptime}</span>
                    <Badge
                      className={`text-xs ${getStatusColor(service.status)}`}
                    >
                      {service.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-yellow-400">1 service needs attention</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Users className="w-5 h-5" />
              <span className="text-sm">Manage Users</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Key className="w-5 h-5" />
              <span className="text-sm">API Keys</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Mail className="w-5 h-5" />
              <span className="text-sm">Contact Forms</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Image className="w-5 h-5" />
              <span className="text-sm">Image Configs</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}