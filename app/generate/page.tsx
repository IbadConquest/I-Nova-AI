"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AuthGuard } from "@/components/auth-guard"
import { AnimatedBackground } from "@/components/animated-background"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import {
  Sparkles,
  MessageSquare,
  Image,
  Send,
  Download,
  Copy,
  RefreshCw,
  Loader2,
  Wand2,
  Palette,
  Settings,
  Zap,
  Bot,
  Camera,
  Save,
  Share,
} from "lucide-react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const imageStyles = [
  { id: "realistic", name: "Realistic", description: "Photorealistic images" },
  { id: "artistic", name: "Artistic", description: "Artistic and creative style" },
  { id: "cartoon", name: "Cartoon", description: "Cartoon and animated style" },
  { id: "digital", name: "Digital Art", description: "Modern digital artwork" },
  { id: "oil", name: "Oil Painting", description: "Classic oil painting style" },
  { id: "watercolor", name: "Watercolor", description: "Soft watercolor effects" },
]

const chatPrompts = [
  "Write a professional email for me",
  "Explain quantum physics in simple terms", 
  "Create a marketing strategy for my business",
  "Help me plan a trip to Japan",
  "Write creative story ideas",
  "Generate code snippets",
]

export default function AIGenerator() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Chat state
  const [chatMessages, setChatMessages] = useState<{role: string; content: string}[]>([])
  const [chatInput, setChatInput] = useState("")
  const [isChatLoading, setIsChatLoading] = useState(false)

  // Image generation state
  const [imagePrompt, setImagePrompt] = useState("")
  const [imageStyle, setImageStyle] = useState("realistic")
  const [imageSize, setImageSize] = useState([1])
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [isImageLoading, setIsImageLoading] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const ctx = gsap.context(() => {
      // Hero animation
      gsap.fromTo(
        ".ai-hero",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      )

      // Tabs animation
      gsap.fromTo(
        ".ai-tabs",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.3, ease: "power2.out" }
      )

      // Cards animation
      gsap.fromTo(
        ".ai-card",
        { y: 40, opacity: 0, scale: 0.95 },
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

      // Floating animations
      gsap.to(".ai-icon", {
        y: -8,
        rotation: 5,
        duration: 3,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
      })

      gsap.to(".sparkle-icon", {
        scale: 1.1,
        rotation: 15,
        duration: 2,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  const handleChatSend = async () => {
    if (!chatInput.trim()) return

    const userMessage = { role: "user", content: chatInput }
    setChatMessages(prev => [...prev, userMessage])
    setChatInput("")
    setIsChatLoading(true)

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: chatInput,
          messages: [...chatMessages, userMessage]
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setChatMessages(prev => [...prev, { role: "assistant", content: data.response }])
        
        toast({
          title: "Response Generated!",
          description: "AI has responded to your message.",
        })
      } else {
        throw new Error("Failed to get response")
      }
    } catch (error) {
      toast({
        title: "Chat Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsChatLoading(false)
    }
  }

  const handleImageGenerate = async () => {
    if (!imagePrompt.trim()) {
      toast({
        title: "Missing Prompt",
        description: "Please enter a description for your image.",
        variant: "destructive",
      })
      return
    }

    setIsImageLoading(true)

    try {
      const response = await fetch("/api/image/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: imagePrompt,
          style: imageStyle,
          size: imageSize[0] === 0 ? "512x512" : imageSize[0] === 1 ? "1024x1024" : "1536x1536",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setGeneratedImages(prev => [data.imageUrl, ...prev])
        
        toast({
          title: "Image Generated!",
          description: "Your AI image has been created successfully.",
        })

        // Animate new image
        gsap.fromTo(
          ".generated-image:first-child",
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
        )
      } else {
        throw new Error("Failed to generate image")
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsImageLoading(false)
    }
  }

  const insertChatPrompt = (prompt: string) => {
    setChatInput(prompt)
    
    gsap.fromTo(
      ".chat-textarea",
      { scale: 0.98 },
      { scale: 1, duration: 0.2, ease: "power2.out" }
    )
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Content copied to clipboard.",
    })
  }

  return (
    <AuthGuard>
      <div
        ref={containerRef}
        className="min-h-screen bg-nova-gradient dark:bg-nova-gradient-dark relative"
      >
        <AnimatedBackground />
        <Navigation />

        <main className="container mx-auto px-4 py-8 space-y-8">
          {/* Header */}
          <div className="ai-hero text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="ai-icon p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-400">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">AI Generator</h1>
              <div className="sparkle-icon">
                <Wand2 className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Unleash the power of AI with our advanced chatbot and image generation tools. 
              Create, communicate, and innovate with cutting-edge artificial intelligence.
            </p>
          </div>

          {/* AI Tools Tabs */}
          <div className="ai-tabs max-w-6xl mx-auto">
            <Tabs defaultValue="chat" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 glass">
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  AI Chatbot
                </TabsTrigger>
                <TabsTrigger value="image" className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Image Generator
                </TabsTrigger>
              </TabsList>

              {/* Chat Tab */}
              <TabsContent value="chat" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card className="ai-card glass h-[600px] flex flex-col">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-primary" />
                          AI Assistant
                        </CardTitle>
                        <CardDescription>
                          Chat with our advanced AI for help, ideas, and insights
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col">
                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 rounded-lg bg-secondary/20">
                          {chatMessages.length === 0 ? (
                            <div className="text-center py-8">
                              <Bot className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                              <p className="text-muted-foreground">
                                Start a conversation with our AI assistant
                              </p>
                            </div>
                          ) : (
                            chatMessages.map((message, index) => (
                              <div
                                key={index}
                                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                              >
                                <div
                                  className={`max-w-[80%] p-3 rounded-lg ${
                                    message.role === "user"
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-secondary text-secondary-foreground"
                                  }`}
                                >
                                  <p className="text-sm">{message.content}</p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(message.content)}
                                    className="mt-1 h-6 px-2"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            ))
                          )}
                          {isChatLoading && (
                            <div className="flex justify-start">
                              <div className="bg-secondary text-secondary-foreground p-3 rounded-lg">
                                <Loader2 className="w-4 h-4 animate-spin" />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Chat Input */}
                        <div className="flex gap-2">
                          <Textarea
                            className="chat-textarea flex-1 resize-none"
                            placeholder="Ask me anything..."
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                handleChatSend()
                              }
                            }}
                            rows={2}
                          />
                          <Button
                            onClick={handleChatSend}
                            disabled={isChatLoading || !chatInput.trim()}
                            className="bg-gradient-to-r from-purple-500 to-pink-400 hover:from-purple-600 hover:to-pink-500"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Chat Prompts */}
                  <div className="space-y-6">
                    <Card className="ai-card glass">
                      <CardHeader>
                        <CardTitle className="text-lg">Quick Prompts</CardTitle>
                        <CardDescription>Try these conversation starters</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {chatPrompts.map((prompt, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            onClick={() => insertChatPrompt(prompt)}
                            className="w-full justify-start text-left h-auto p-3"
                          >
                            <span className="text-sm">{prompt}</span>
                          </Button>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="ai-card glass">
                      <CardHeader>
                        <CardTitle className="text-lg">Chat Features</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-primary" />
                          <span className="text-sm">Instant responses</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 text-primary" />
                          <span className="text-sm">Context awareness</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Copy className="w-4 h-4 text-primary" />
                          <span className="text-sm">Easy copy responses</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Save className="w-4 h-4 text-primary" />
                          <span className="text-sm">Save conversations</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Image Generation Tab */}
              <TabsContent value="image" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Image Generation Form */}
                    <Card className="ai-card glass">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Image className="w-5 h-5 text-primary" />
                          Create AI Images
                        </CardTitle>
                        <CardDescription>
                          Generate stunning images from text descriptions using advanced AI
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Image Description</label>
                          <Textarea
                            placeholder="Describe the image you want to create... e.g., 'A serene mountain landscape at sunset with snow-capped peaks reflecting in a crystal clear lake'"
                            value={imagePrompt}
                            onChange={(e) => setImagePrompt(e.target.value)}
                            rows={4}
                            className="resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Art Style</label>
                            <Select value={imageStyle} onValueChange={setImageStyle}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {imageStyles.map((style) => (
                                  <SelectItem key={style.id} value={style.id}>
                                    <div className="flex flex-col">
                                      <span className="font-medium">{style.name}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {style.description}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium">Image Size</label>
                              <Badge variant="outline">
                                {imageSize[0] === 0 ? "512×512" : imageSize[0] === 1 ? "1024×1024" : "1536×1536"}
                              </Badge>
                            </div>
                            <Slider
                              value={imageSize}
                              onValueChange={setImageSize}
                              max={2}
                              step={1}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Small</span>
                              <span>Large</span>
                              <span>XL</span>
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={handleImageGenerate}
                          disabled={isImageLoading || !imagePrompt.trim()}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                          size="lg"
                        >
                          {isImageLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Generating Image...
                            </>
                          ) : (
                            <>
                              <Wand2 className="w-4 h-4 mr-2" />
                              Generate Image
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Generated Images */}
                    {generatedImages.length > 0 && (
                      <Card className="ai-card glass">
                        <CardHeader>
                          <CardTitle>Generated Images</CardTitle>
                          <CardDescription>Your AI-created artwork</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {generatedImages.map((imageUrl, index) => (
                              <div key={index} className="generated-image group relative">
                                <img
                                  src={imageUrl}
                                  alt={`Generated image ${index + 1}`}
                                  className="w-full h-64 object-cover rounded-lg border border-border/50"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                                  <Button variant="secondary" size="sm">
                                    <Download className="w-4 h-4" />
                                  </Button>
                                  <Button variant="secondary" size="sm">
                                    <Share className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Image Settings & Features */}
                  <div className="space-y-6">
                    <Card className="ai-card glass">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Settings className="w-5 h-5 text-primary" />
                          Style Guide
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="p-3 rounded-lg bg-secondary/20">
                          <h4 className="font-medium text-sm mb-2">Realistic</h4>
                          <p className="text-xs text-muted-foreground">
                            Perfect for portraits, landscapes, and lifelike scenes
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/20">
                          <h4 className="font-medium text-sm mb-2">Artistic</h4>
                          <p className="text-xs text-muted-foreground">
                            Creative interpretations with artistic flair
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/20">
                          <h4 className="font-medium text-sm mb-2">Digital Art</h4>
                          <p className="text-xs text-muted-foreground">
                            Modern digital artwork with vibrant colors
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="ai-card glass">
                      <CardHeader>
                        <CardTitle className="text-lg">Pro Tips</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <div>
                          <strong>Be Descriptive:</strong> Include details about colors, lighting, and mood
                        </div>
                        <div>
                          <strong>Specify Style:</strong> Mention artistic styles or references
                        </div>
                        <div>
                          <strong>Set the Scene:</strong> Describe the environment and context
                        </div>
                        <div>
                          <strong>Add Emotion:</strong> Include feelings or atmosphere
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="ai-card glass">
                      <CardHeader>
                        <CardTitle className="text-lg">Image Features</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Palette className="w-4 h-4 text-primary" />
                          <span className="text-sm">Multiple art styles</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Settings className="w-4 h-4 text-primary" />
                          <span className="text-sm">Customizable sizes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Download className="w-4 h-4 text-primary" />
                          <span className="text-sm">High-res downloads</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-primary" />
                          <span className="text-sm">Fast generation</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <Footer />
      </div>
    </AuthGuard>
  )
}