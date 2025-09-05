"use client"

import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"

interface VoiceUser {
  id: string
  email: string
  name: string
  voicePreferences?: {
    preferredModel?: string
    defaultSpeed?: number
    defaultPitch?: number
  }
}

interface VoiceAuthContextType {
  user: VoiceUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateVoicePreferences: (preferences: Partial<VoiceUser["voicePreferences"]>) => Promise<void>
}

const VoiceAuthContext = createContext<VoiceAuthContextType | undefined>(undefined)

export function VoiceAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<VoiceUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("voice-auth-token")
        if (token) {
          const response = await fetch("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          if (response.ok) {
            const userData = await response.json()
            setUser(userData)
          } else {
            localStorage.removeItem("voice-auth-token")
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        localStorage.removeItem("voice-auth-token")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("voice-auth-token", data.token)
        setUser(data.user)
        return true
      }
      return false
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("voice-auth-token")
    setUser(null)
  }

  const updateVoicePreferences = async (preferences: Partial<VoiceUser["voicePreferences"]>) => {
    try {
      const token = localStorage.getItem("voice-auth-token")
      const response = await fetch("/api/voice/preferences", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(preferences),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser)
      }
    } catch (error) {
      console.error("Failed to update preferences:", error)
    }
  }

  const contextValue: VoiceAuthContextType = {
    user,
    isLoading,
    login,
    logout,
    updateVoicePreferences,
  }

  return <VoiceAuthContext.Provider value={contextValue}>{children}</VoiceAuthContext.Provider>
}

export function useVoiceAuth() {
  const context = useContext(VoiceAuthContext)
  if (context === undefined) {
    throw new Error("useVoiceAuth must be used within a VoiceAuthProvider")
  }
  return context
}