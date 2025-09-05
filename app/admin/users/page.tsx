"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Mail,
  Calendar,
  Shield,
  UserCheck,
  UserX,
  Crown,
} from "lucide-react"

const userData = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "User",
    status: "active",
    joinDate: "2024-01-15",
    lastLogin: "2 hours ago",
    avatar: "",
  },
  {
    id: "2", 
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    role: "Pro",
    status: "active",
    joinDate: "2024-01-10",
    lastLogin: "1 day ago",
    avatar: "",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@example.com", 
    role: "Admin",
    status: "active",
    joinDate: "2023-12-20",
    lastLogin: "30 minutes ago",
    avatar: "",
  },
  {
    id: "4",
    name: "Emma Davis",
    email: "emma.davis@example.com",
    role: "User", 
    status: "inactive",
    joinDate: "2024-01-05",
    lastLogin: "1 week ago",
    avatar: "",
  },
  {
    id: "5",
    name: "Alex Chen",
    email: "alex.chen@example.com",
    role: "Pro",
    status: "active", 
    joinDate: "2023-11-30",
    lastLogin: "3 hours ago",
    avatar: "",
  },
]

export default function UsersManagement() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState(userData)

  useEffect(() => {
    if (typeof window === "undefined") return

    const ctx = gsap.context(() => {
      // Hero animation
      gsap.fromTo(
        ".users-hero",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      )

      // Search section animation
      gsap.fromTo(
        ".search-section",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: "power2.out" }
      )

      // User cards animation
      gsap.fromTo(
        ".user-card",
        { y: 40, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.4,
          ease: "back.out(1.7)",
        }
      )

      // Floating animations
      gsap.to(".users-icon", {
        y: -8,
        duration: 3,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin": return "text-red-400 bg-red-500/20 border-red-500/30"
      case "Pro": return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30" 
      case "User": return "text-blue-400 bg-blue-500/20 border-blue-500/30"
      default: return "text-gray-400 bg-gray-500/20 border-gray-500/30"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-400 bg-green-500/20 border-green-500/30"
      case "inactive": return "text-gray-400 bg-gray-500/20 border-gray-500/30"
      default: return "text-gray-400 bg-gray-500/20 border-gray-500/30"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin": return <Shield className="w-3 h-3" />
      case "Pro": return <Crown className="w-3 h-3" />
      case "User": return <UserCheck className="w-3 h-3" />
      default: return <UserCheck className="w-3 h-3" />
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="users-hero">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
            <div className="users-icon">
              <Users className="w-10 h-10 text-blue-400" />
            </div>
            Users Management
          </h1>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
        <p className="text-xl text-muted-foreground">
          Manage user accounts, roles, and permissions
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="search-section glass">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user, index) => (
          <Card key={user.id} className="user-card glass hover:glass-strong transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20">
                      {user.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Role</span>
                  <Badge className={getRoleColor(user.role)}>
                    {getRoleIcon(user.role)}
                    <span className="ml-1">{user.role}</span>
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className={getStatusColor(user.status)}>
                    {user.status === "active" ? <UserCheck className="w-3 h-3 mr-1" /> : <UserX className="w-3 h-3 mr-1" />}
                    {user.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Joined</span>
                  <span className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {user.joinDate}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Login</span>
                  <span className="text-sm text-green-400">{user.lastLogin}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
                <Button variant="outline" size="sm" className="flex-1">
                  <Mail className="w-3 h-3 mr-1" />
                  Message
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>Overview of user statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{filteredUsers.length}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {filteredUsers.filter(u => u.status === "active").length}
              </div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {filteredUsers.filter(u => u.role === "Pro").length}
              </div>
              <div className="text-sm text-muted-foreground">Pro Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {filteredUsers.filter(u => u.role === "Admin").length}
              </div>
              <div className="text-sm text-muted-foreground">Admins</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}