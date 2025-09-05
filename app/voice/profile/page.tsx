"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  User,
  Settings,
  Volume2,
  Mic,
  Save,
  Upload,
  Bell,
  Shield,
  CreditCard,
  Activity,
  Sparkles,
  Crown,
  Zap,
  Clock,
  Globe,
  Palette,
} from "lucide-react"

const voiceModels = [
  { id: "rachel", name: "Rachel", category: "Professional" },
  { id: "drew", name: "Drew", category: "Conversational" },
  { id: "clyde", name: "Clyde", category: "Narrator" },
  { id: "paul", name: "Paul", category: "British" },
]

const usageStats = [
  { label: "Audio Generated", value: "2.4k minutes", color: "text-blue-400" },
  { label: "Projects Created", value: "24", color: "text-green-400" },
  { label: "Characters Used", value: "180k", color: "text-purple-400" },
  { label: "API Calls", value: "1,247", color: "text-orange-400" },
]

export default function VoiceProfile() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "",
    preferredVoice: "rachel",
    defaultSpeed: 1.0,
    defaultStability: 0.75,
    autoSave: true,
    emailNotifications: true,
    qualityPreference: "high",
    language: "en",
    timezone: "America/New_York",
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const ctx = gsap.context(() => {
      // Hero animation
      gsap.fromTo(
        ".profile-hero",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      )

      // Profile card animation
      gsap.fromTo(
        ".profile-card",
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.3,
          ease: "power3.out",
        }
      )

      // Settings cards animation
      gsap.fromTo(
        ".settings-card",
        { y: 40, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.6,
          ease: "back.out(1.7)",
        }
      )

      // Stats animation
      gsap.fromTo(
        ".stat-item",
        { x: 30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          delay: 0.9,
          ease: "power3.out",
        }
      )

      // Floating animations
      gsap.to(".user-icon", {
        y: -8,
        duration: 3,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
      })

      gsap.to(".crown-icon", {
        rotation: 10,
        duration: 2,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const response = await fetch("/api/voice/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("voice-auth-token")}`,
        },
        body: JSON.stringify(profile),
      })

      if (response.ok) {
        toast({
          title: "Profile Updated",
          description: "Your settings have been saved successfully.",
        })
        setIsEditing(false)

        // Animate success
        gsap.to(".save-success", {
          scale: 1.05,
          duration: 0.2,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        })
      } else {
        throw new Error("Failed to update profile")
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setProfile({ ...profile, avatar: url })
      setIsEditing(true)
      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been changed.",
      })
    }
  }

  return (
    <div ref={containerRef} className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="profile-hero text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="user-icon p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-400">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">Voice Profile</h1>
          <div className="crown-icon">
            <Crown className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Manage your account settings, voice preferences, and usage statistics
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="profile-card glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar & Basic Info */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/20 to-accent/20">
                      {profile.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute -bottom-2 -right-2 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
                      <Upload className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </label>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black">
                      <Crown className="w-3 h-3 mr-1" />
                      Pro Plan
                    </Badge>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{profile.name}</h3>
                  <p className="text-muted-foreground">{profile.email}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => {
                      setProfile({ ...profile, name: e.target.value })
                      setIsEditing(true)
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => {
                      setProfile({ ...profile, email: e.target.value })
                      setIsEditing(true)
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={profile.language}
                    onValueChange={(value) => {
                      setProfile({ ...profile, language: value })
                      setIsEditing(true)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                      <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                      <SelectItem value="fr">🇫🇷 French</SelectItem>
                      <SelectItem value="de">🇩🇪 German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={profile.timezone}
                    onValueChange={(value) => {
                      setProfile({ ...profile, timezone: value })
                      setIsEditing(true)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voice Preferences */}
          <Card className="settings-card glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-primary" />
                Voice Preferences
              </CardTitle>
              <CardDescription>Set your default voice generation settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Preferred Voice Model</Label>
                  <Select
                    value={profile.preferredVoice}
                    onValueChange={(value) => {
                      setProfile({ ...profile, preferredVoice: value })
                      setIsEditing(true)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {voiceModels.map((voice) => (
                        <SelectItem key={voice.id} value={voice.id}>
                          <div className="flex items-center gap-2">
                            <span>{voice.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {voice.category}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quality Preference</Label>
                  <Select
                    value={profile.qualityPreference}
                    onValueChange={(value) => {
                      setProfile({ ...profile, qualityPreference: value })
                      setIsEditing(true)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="high">High Quality</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="space-y-4 pt-4 border-t border-border/50">
                <h4 className="font-medium text-foreground">Notification Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-muted-foreground" />
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={profile.emailNotifications}
                      onCheckedChange={(checked) => {
                        setProfile({ ...profile, emailNotifications: checked })
                        setIsEditing(true)
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Save className="w-4 h-4 text-muted-foreground" />
                      <Label htmlFor="auto-save">Auto-save Projects</Label>
                    </div>
                    <Switch
                      id="auto-save"
                      checked={profile.autoSave}
                      onCheckedChange={(checked) => {
                        setProfile({ ...profile, autoSave: checked })
                        setIsEditing(true)
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          {isEditing && (
            <div className="save-success">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-green-500 to-teal-400 hover:from-green-600 hover:to-teal-500"
                size="lg"
              >
                {isSaving ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Usage Statistics */}
          <Card className="settings-card glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Usage Statistics
              </CardTitle>
              <CardDescription>Your voice generation activity this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usageStats.map((stat, index) => (
                  <div key={stat.label} className="stat-item flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                    <span className={`font-semibold ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Plan Information */}
          <Card className="settings-card glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Subscription Plan
              </CardTitle>
              <CardDescription>Manage your Nova AI Voice plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-400/20 to-orange-400/20">
                  <Crown className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Pro Plan</h4>
                  <p className="text-sm text-muted-foreground">100 hours/month</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Used this month</span>
                  <span>65/100 hours</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="w-[65%] h-full bg-gradient-to-r from-primary to-accent rounded-full" />
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Upgrade Plan
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="settings-card glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Globe className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Privacy Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Palette className="w-4 h-4 mr-2" />
                Theme Preferences
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}