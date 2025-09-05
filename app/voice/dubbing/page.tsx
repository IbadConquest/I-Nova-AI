"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import {
  Headphones,
  Play,
  Pause,
  Upload,
  Download,
  Save,
  Loader2,
  FileAudio,
  Volume2,
  Waveform,
  Settings,
  Sparkles,
  RefreshCw,
  Zap,
  Clock,
} from "lucide-react"

const voiceOptions = [
  { id: "preserve", name: "Preserve Original", description: "Keep original voice characteristics" },
  { id: "enhance", name: "Voice Enhancement", description: "Improve clarity and quality" },
  { id: "replace-male", name: "Replace with Male Voice", description: "Professional male voice" },
  { id: "replace-female", name: "Replace with Female Voice", description: "Professional female voice" },
  { id: "custom", name: "Custom Voice Model", description: "Use trained voice model" },
]

const dubbingProjects = [
  { id: 1, name: "Product Demo Video", status: "completed", duration: "3:24", language: "English" },
  { id: 2, name: "Training Material", status: "processing", duration: "8:15", language: "Spanish" },
  { id: 3, name: "Marketing Presentation", status: "completed", duration: "5:42", language: "French" },
]

export default function VoiceDubbing() {
  const containerRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { toast } = useToast()

  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [dubbedUrl, setDubbedUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [selectedVoiceOption, setSelectedVoiceOption] = useState("enhance")
  const [voiceStrength, setVoiceStrength] = useState([0.8])
  const [noiseReduction, setNoiseReduction] = useState([0.7])
  const [preserveMusic, setPreserveMusic] = useState([0.9])

  useEffect(() => {
    if (typeof window === "undefined") return

    const ctx = gsap.context(() => {
      // Hero animation
      gsap.fromTo(
        ".dubbing-hero",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      )

      // Upload section animation
      gsap.fromTo(
        ".upload-section",
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.3,
          ease: "power3.out",
        }
      )

      // Settings animation
      gsap.fromTo(
        ".settings-section",
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.6,
          ease: "power3.out",
        }
      )

      // Projects animation
      gsap.fromTo(
        ".project-card",
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
      gsap.to(".headphones-icon", {
        rotateY: 15,
        duration: 3,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
      })

      gsap.to(".waveform-icon", {
        scaleX: 1.2,
        duration: 2,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setOriginalFile(file)
      setOriginalUrl(URL.createObjectURL(file))
      toast({
        title: "File Uploaded",
        description: "Audio file loaded successfully for dubbing.",
      })

      // Animate upload success
      gsap.fromTo(
        ".upload-success",
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      )
    }
  }

  const handlePlay = (isOriginal: boolean = true) => {
    const url = isOriginal ? originalUrl : dubbedUrl
    if (audioRef.current && url) {
      audioRef.current.src = url
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const handleProcessDubbing = async () => {
    if (!originalFile) {
      toast({
        title: "No File Selected",
        description: "Please upload an audio file first.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setProcessingProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 400)

    try {
      const formData = new FormData()
      formData.append("audio", originalFile)
      formData.append("voiceOption", selectedVoiceOption)
      formData.append("voiceStrength", voiceStrength[0].toString())
      formData.append("noiseReduction", noiseReduction[0].toString())
      formData.append("preserveMusic", preserveMusic[0].toString())

      const response = await fetch("/api/voice/dubbing/process", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("voice-auth-token")}`,
        },
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setDubbedUrl(data.dubbedAudioUrl)
        setProcessingProgress(100)

        // Animate success
        gsap.fromTo(
          ".dubbing-result",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
        )

        toast({
          title: "Dubbing Complete!",
          description: "Your audio has been processed successfully.",
        })
      } else {
        throw new Error("Dubbing failed")
      }
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: "There was an error processing your audio.",
        variant: "destructive",
      })
    } finally {
      clearInterval(progressInterval)
      setIsProcessing(false)
      setTimeout(() => setProcessingProgress(0), 2000)
    }
  }

  const handleDownload = () => {
    if (dubbedUrl) {
      const link = document.createElement("a")
      link.href = dubbedUrl
      link.download = `dubbed-audio-${Date.now()}.mp3`
      link.click()
    }
  }

  return (
    <div ref={containerRef} className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="dubbing-hero text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="headphones-icon p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-400">
            <Headphones className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">Voice Dubbing</h1>
          <div className="sparkle-icon">
            <Sparkles className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Replace, enhance, or modify voices in your audio content using AI-powered voice dubbing technology
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload & Processing Section */}
        <div className="space-y-6">
          <Card className="upload-section glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileAudio className="w-5 h-5 text-primary" />
                Audio Upload
              </CardTitle>
              <CardDescription>Upload the audio file you want to dub or enhance</CardDescription>
            </CardHeader>
            <CardContent>
              <label className="block w-full">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex items-center justify-center p-8 border-2 border-dashed border-border/50 rounded-xl hover:border-border/70 transition-colors cursor-pointer">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium text-foreground mb-2">
                      Drop your audio file here
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supports MP3, WAV, M4A, OGG files up to 50MB
                    </p>
                  </div>
                </div>
              </label>

              {originalUrl && (
                <div className="upload-success mt-6 p-4 rounded-lg glass border border-purple-500/30 bg-purple-500/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-purple-400">Original Audio</span>
                    <Badge variant="secondary">{originalFile?.name}</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePlay(true)}
                      className="bg-purple-500/20 border-purple-500/30 hover:bg-purple-500/30"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <div className="flex-1">
                      <div className="waveform-icon flex items-center gap-1">
                        {[...Array(12)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 bg-purple-400/60 rounded-full animate-pulse"
                            style={{ height: `${Math.random() * 20 + 4}px` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Processing Progress */}
          {isProcessing && (
            <Card className="glass">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span className="font-medium">Processing Audio...</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Analyzing voice patterns</span>
                      <span>{processingProgress}%</span>
                    </div>
                    <Progress value={processingProgress} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Dubbed Result */}
          {dubbedUrl && (
            <Card className="dubbing-result glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Dubbed Audio
                </CardTitle>
                <CardDescription>Your processed audio with voice modifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg glass border border-green-500/30 bg-green-500/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-green-400">Processing Complete</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Ready
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePlay(false)}
                      className="bg-green-500/20 border-green-500/30 hover:bg-green-500/30"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <div className="flex-1 text-sm text-green-300">
                      Click to preview dubbed audio
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Save Project
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Settings Section */}
        <div className="space-y-6">
          <Card className="settings-section glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Dubbing Settings
              </CardTitle>
              <CardDescription>Configure voice processing options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Voice Option Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Voice Processing Mode</label>
                <Select value={selectedVoiceOption} onValueChange={setSelectedVoiceOption}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {voiceOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{option.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {option.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Voice Strength */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Voice Strength</label>
                  <Badge variant="outline">{Math.round(voiceStrength[0] * 100)}%</Badge>
                </div>
                <Slider
                  value={voiceStrength}
                  onValueChange={setVoiceStrength}
                  min={0}
                  max={1}
                  step={0.05}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  How strongly to apply voice modifications
                </p>
              </div>

              {/* Noise Reduction */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Noise Reduction</label>
                  <Badge variant="outline">{Math.round(noiseReduction[0] * 100)}%</Badge>
                </div>
                <Slider
                  value={noiseReduction}
                  onValueChange={setNoiseReduction}
                  min={0}
                  max={1}
                  step={0.05}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Remove background noise and improve clarity
                </p>
              </div>

              {/* Preserve Background Music */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Preserve Music</label>
                  <Badge variant="outline">{Math.round(preserveMusic[0] * 100)}%</Badge>
                </div>
                <Slider
                  value={preserveMusic}
                  onValueChange={setPreserveMusic}
                  min={0}
                  max={1}
                  step={0.05}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Keep background music and sound effects intact
                </p>
              </div>

              {/* Process Button */}
              <Button
                onClick={handleProcessDubbing}
                disabled={isProcessing || !originalFile}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-400 hover:from-purple-600 hover:to-pink-500"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Headphones className="w-4 h-4 mr-2" />
                    Start Dubbing
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Projects */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Recent Dubbing Projects
          </CardTitle>
          <CardDescription>Your latest voice dubbing activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dubbingProjects.map((project, index) => (
              <div
                key={project.id}
                className="project-card p-4 rounded-lg glass hover:glass-strong transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-400/20 flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-foreground truncate">{project.name}</h4>
                    <p className="text-xs text-muted-foreground">{project.language}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge
                    variant={project.status === "completed" ? "default" : "secondary"}
                    className={
                      project.status === "completed"
                        ? "bg-green-500/20 text-green-400 border-green-500/30 text-xs"
                        : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs"
                    }
                  >
                    {project.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{project.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
    </div>
  )
}