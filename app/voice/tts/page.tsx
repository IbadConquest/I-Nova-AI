"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  Volume2,
  Play,
  Pause,
  Download,
  Upload,
  Sparkles,
  Settings,
  Mic,
  Loader2,
  Copy,
  Save,
  RefreshCw,
  Wand2,
} from "lucide-react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const voiceModels = [
  { id: "rachel", name: "Rachel", description: "Professional, clear", accent: "American", category: "Professional" },
  { id: "drew", name: "Drew", description: "Warm, conversational", accent: "American", category: "Conversational" },
  { id: "clyde", name: "Clyde", description: "Authoritative, deep", accent: "American", category: "Narrator" },
  { id: "paul", name: "Paul", description: "Friendly, approachable", accent: "British", category: "Conversational" },
  { id: "domi", name: "Domi", description: "Energetic, young", accent: "American", category: "Creative" },
  { id: "dave", name: "Dave", description: "Smooth, sophisticated", accent: "British", category: "Professional" },
]

const presetTexts = [
  "Welcome to our revolutionary AI voice platform. Experience the future of audio content creation.",
  "Thank you for choosing our service. We're excited to help you bring your ideas to life with cutting-edge voice technology.",
  "Discover the power of AI-generated speech that sounds incredibly natural and human-like.",
]

export default function TextToSpeech() {
  const containerRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { toast } = useToast()

  const [text, setText] = useState("")
  const [selectedVoice, setSelectedVoice] = useState("rachel")
  const [speed, setSpeed] = useState([1.0])
  const [stability, setStability] = useState([0.75])
  const [clarity, setClarity] = useState([0.75])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [characterCount, setCharacterCount] = useState(0)

  useEffect(() => {
    if (typeof window === "undefined") return

    const ctx = gsap.context(() => {
      // Hero section animation
      gsap.fromTo(
        ".tts-hero",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      )

      // Input section animation
      gsap.fromTo(
        ".input-section",
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.3,
          ease: "power3.out",
        }
      )

      // Controls animation
      gsap.fromTo(
        ".controls-section",
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.6,
          ease: "power3.out",
        }
      )

      // Voice cards animation
      gsap.fromTo(
        ".voice-card",
        { y: 40, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.9,
          ease: "back.out(1.7)",
        }
      )

      // Floating animations
      gsap.to(".voice-icon", {
        y: -8,
        rotation: 5,
        duration: 3,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
      })

      gsap.to(".sparkle-icon", {
        scale: 1.2,
        rotation: 15,
        duration: 2,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    setCharacterCount(text.length)
  }, [text])

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to generate speech.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      const response = await fetch("/api/voice/tts/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("voice-auth-token")}`,
        },
        body: JSON.stringify({
          text,
          voice: selectedVoice,
          speed: speed[0],
          stability: stability[0],
          clarity: clarity[0],
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setAudioUrl(data.audioUrl)
        setGenerationProgress(100)
        
        toast({
          title: "Success!",
          description: "Your audio has been generated successfully.",
        })

        // Animate success
        gsap.to(".generation-success", {
          scale: 1.1,
          duration: 0.3,
          ease: "back.out(1.7)",
          yoyo: true,
          repeat: 1,
        })
      } else {
        throw new Error("Generation failed")
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating your audio. Please try again.",
        variant: "destructive",
      })
    } finally {
      clearInterval(progressInterval)
      setIsGenerating(false)
      setTimeout(() => setGenerationProgress(0), 2000)
    }
  }

  const handlePlay = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const handleDownload = () => {
    if (audioUrl) {
      const link = document.createElement("a")
      link.href = audioUrl
      link.download = `generated-speech-${Date.now()}.mp3`
      link.click()
    }
  }

  const insertPresetText = (preset: string) => {
    setText(preset)
    
    // Animate text insertion
    gsap.fromTo(
      ".text-area",
      { scale: 0.98, opacity: 0.8 },
      { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" }
    )
  }

  return (
    <div ref={containerRef} className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="tts-hero text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="voice-icon p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400">
            <Volume2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">Text to Speech</h1>
          <div className="sparkle-icon">
            <Sparkles className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Transform your text into natural, human-like speech using advanced AI voice models
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="input-section glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-primary" />
                Text Input
              </CardTitle>
              <CardDescription>
                Enter the text you want to convert to speech (max 5,000 characters)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Preset Text Buttons */}
              <div className="flex flex-wrap gap-2">
                {presetTexts.map((preset, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => insertPresetText(preset)}
                    className="text-xs hover:bg-primary/10"
                  >
                    Preset {index + 1}
                  </Button>
                ))}
              </div>

              <div className="relative">
                <Textarea
                  className="text-area min-h-[200px] text-base leading-relaxed resize-none"
                  placeholder="Enter your text here... Try something like: 'Welcome to the future of AI-powered voice generation. This technology will revolutionize how we create audio content.'"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  maxLength={5000}
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {characterCount}/5,000
                  </Badge>
                  {text && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setText("")}
                      className="h-6 w-6 p-0 hover:bg-destructive/20"
                    >
                      ×
                    </Button>
                  )}
                </div>
              </div>

              {/* Generation Progress */}
              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Generating audio...</span>
                    <span className="text-sm font-medium">{generationProgress}%</span>
                  </div>
                  <Progress value={generationProgress} className="h-2" />
                </div>
              )}

              {/* Generated Audio */}
              {audioUrl && (
                <div className="generation-success p-4 rounded-lg glass border border-green-500/30 bg-green-500/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePlay}
                        className="bg-green-500/20 border-green-500/30 hover:bg-green-500/30"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <span className="text-sm text-green-400 font-medium">Audio generated successfully!</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={handleDownload}>
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Save className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    onEnded={() => setIsPlaying(false)}
                    className="hidden"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Controls Section */}
        <div className="space-y-6">
          <Card className="controls-section glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Voice Settings
              </CardTitle>
              <CardDescription>Customize your AI voice generation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Voice Model Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Voice Model</label>
                <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {voiceModels.map((voice) => (
                      <SelectItem key={voice.id} value={voice.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{voice.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {voice.description} • {voice.accent}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Speed Control */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Speed</label>
                  <Badge variant="outline">{speed[0].toFixed(1)}x</Badge>
                </div>
                <Slider
                  value={speed}
                  onValueChange={setSpeed}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Stability Control */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Stability</label>
                  <Badge variant="outline">{Math.round(stability[0] * 100)}%</Badge>
                </div>
                <Slider
                  value={stability}
                  onValueChange={setStability}
                  min={0}
                  max={1}
                  step={0.05}
                  className="w-full"
                />
              </div>

              {/* Clarity Control */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Clarity</label>
                  <Badge variant="outline">{Math.round(clarity[0] * 100)}%</Badge>
                </div>
                <Slider
                  value={clarity}
                  onValueChange={setClarity}
                  min={0}
                  max={1}
                  step={0.05}
                  className="w-full"
                />
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !text.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 mr-2" />
                    Generate Speech
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Voice Models Preview */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-primary" />
                Available Voices
              </CardTitle>
              <CardDescription>Preview different AI voice models</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {voiceModels.slice(0, 4).map((voice, index) => (
                  <div
                    key={voice.id}
                    className={`voice-card p-3 rounded-lg border transition-all cursor-pointer ${
                      selectedVoice === voice.id
                        ? "border-primary bg-primary/10"
                        : "border-border/30 hover:border-border/50 hover:bg-secondary/30"
                    }`}
                    onClick={() => setSelectedVoice(voice.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm text-foreground">{voice.name}</p>
                        <p className="text-xs text-muted-foreground">{voice.description}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {voice.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}