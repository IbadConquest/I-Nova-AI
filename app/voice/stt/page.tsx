"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  Upload,
  Download,
  Copy,
  Save,
  Loader2,
  FileAudio,
  Clock,
  Volume2,
  Languages,
  Sparkles,
} from "lucide-react"

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
]

export default function SpeechToText() {
  const containerRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const { toast } = useToast()

  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [transcript, setTranscript] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [transcriptionProgress, setTranscriptionProgress] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  useEffect(() => {
    if (typeof window === "undefined") return

    const ctx = gsap.context(() => {
      // Hero animation
      gsap.fromTo(
        ".stt-hero",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      )

      // Recording section animation
      gsap.fromTo(
        ".recording-section",
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          delay: 0.3,
          ease: "back.out(1.7)",
        }
      )

      // Controls animation
      gsap.fromTo(
        ".controls-grid",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.6,
          ease: "power3.out",
        }
      )

      // Floating animations
      gsap.to(".mic-icon", {
        scale: 1.1,
        duration: 2,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
      })

      gsap.to(".pulse-ring", {
        scale: 1.5,
        opacity: 0,
        duration: 1.5,
        ease: "power2.out",
        repeat: -1,
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const audioChunks: BlobPart[] = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: "audio/wav" })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Animate recording state
      gsap.to(".recording-pulse", {
        scale: 1.2,
        duration: 0.8,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
      })

      toast({
        title: "Recording Started",
        description: "Speak clearly into your microphone.",
      })
    } catch (error) {
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // Stop recording animations
      gsap.killTweensOf(".recording-pulse")
      gsap.set(".recording-pulse", { scale: 1 })

      toast({
        title: "Recording Stopped",
        description: "Your audio is ready for transcription.",
      })
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

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAudioBlob(file)
      setAudioUrl(URL.createObjectURL(file))
      toast({
        title: "File Uploaded",
        description: "Audio file loaded successfully.",
      })
    }
  }

  const handleTranscribe = async () => {
    if (!audioBlob) {
      toast({
        title: "No Audio",
        description: "Please record or upload audio first.",
        variant: "destructive",
      })
      return
    }

    setIsTranscribing(true)
    setTranscriptionProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setTranscriptionProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 15
      })
    }, 300)

    try {
      const formData = new FormData()
      formData.append("audio", audioBlob)
      formData.append("language", selectedLanguage)

      const response = await fetch("/api/voice/stt/transcribe", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("voice-auth-token")}`,
        },
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setTranscript(data.transcript)
        setTranscriptionProgress(100)

        // Animate success
        gsap.fromTo(
          ".transcript-result",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
        )

        toast({
          title: "Transcription Complete!",
          description: "Your audio has been converted to text.",
        })
      } else {
        throw new Error("Transcription failed")
      }
    } catch (error) {
      toast({
        title: "Transcription Failed",
        description: "There was an error processing your audio.",
        variant: "destructive",
      })
    } finally {
      clearInterval(progressInterval)
      setIsTranscribing(false)
      setTimeout(() => setTranscriptionProgress(0), 2000)
    }
  }

  const copyTranscript = () => {
    if (transcript) {
      navigator.clipboard.writeText(transcript)
      toast({
        title: "Copied!",
        description: "Transcript copied to clipboard.",
      })
    }
  }

  return (
    <div ref={containerRef} className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="stt-hero text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="mic-icon p-3 rounded-2xl bg-gradient-to-br from-green-500 to-teal-400">
            <Mic className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">Speech to Text</h1>
          <div className="sparkle-icon">
            <Sparkles className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Convert spoken audio into accurate text transcriptions using advanced AI speech recognition
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recording Section */}
        <Card className="recording-section glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileAudio className="w-5 h-5 text-primary" />
              Audio Input
            </CardTitle>
            <CardDescription>Record new audio or upload an existing file</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Recording Controls */}
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                {isRecording && (
                  <div className="pulse-ring absolute inset-0 rounded-full border-4 border-red-500"></div>
                )}
                <Button
                  variant={isRecording ? "destructive" : "default"}
                  size="lg"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`recording-pulse w-20 h-20 rounded-full ${
                    isRecording
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gradient-to-br from-green-500 to-teal-400 hover:from-green-600 hover:to-teal-500"
                  }`}
                >
                  {isRecording ? <Square className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </Button>
              </div>

              {isRecording && (
                <div className="text-center">
                  <Badge variant="destructive" className="mb-2 animate-pulse">
                    🔴 Recording
                  </Badge>
                  <div className="flex items-center gap-2 text-lg font-mono">
                    <Clock className="w-4 h-4" />
                    {formatTime(recordingTime)}
                  </div>
                </div>
              )}

              <div className="w-full border-t border-border/50 pt-4">
                <label className="block w-full">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleUpload}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center p-6 border-2 border-dashed border-border/50 rounded-xl hover:border-border/70 transition-colors cursor-pointer">
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Or drag and drop an audio file here
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Supports MP3, WAV, M4A, OGG
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Audio Player */}
            {audioUrl && (
              <div className="p-4 rounded-lg glass border border-green-500/30 bg-green-500/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-green-400">Audio Ready</span>
                  <Badge variant="secondary">
                    {recordingTime > 0 ? formatTime(recordingTime) : "Uploaded"}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePlay}
                    className="bg-green-500/20 border-green-500/30 hover:bg-green-500/30"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <div className="flex-1 text-sm text-green-300">
                    Click play to preview your audio
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

        {/* Transcription Section */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="w-5 h-5 text-primary" />
              Transcription Settings
            </CardTitle>
            <CardDescription>Configure language and processing options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Language Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Language</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Transcription Progress */}
            {isTranscribing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Processing audio...</span>
                  <span className="text-sm font-medium">{transcriptionProgress}%</span>
                </div>
                <Progress value={transcriptionProgress} className="h-2" />
              </div>
            )}

            {/* Transcribe Button */}
            <Button
              onClick={handleTranscribe}
              disabled={isTranscribing || !audioBlob}
              className="w-full bg-gradient-to-r from-green-500 to-teal-400 hover:from-green-600 hover:to-teal-500"
              size="lg"
            >
              {isTranscribing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Transcribing...
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Start Transcription
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Transcript Result */}
      {transcript && (
        <Card className="transcript-result glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileAudio className="w-5 h-5 text-primary" />
              Transcription Result
            </CardTitle>
            <CardDescription>Your audio converted to text</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-secondary/30 border border-border/30 min-h-[150px]">
                <p className="text-foreground leading-relaxed">{transcript}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={copyTranscript}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Text
                </Button>
                <Button variant="outline">
                  <Save className="w-4 h-4 mr-2" />
                  Save Transcript
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}