import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Image, Bot, Sparkles, Zap, Palette } from "lucide-react"

const features = [
  {
    icon: MessageSquare,
    title: "AI Chatbot",
    description: "Intelligent conversations with context-aware responses and instant help.",
  },
  {
    icon: Image,
    title: "Image Generation",
    description: "Create stunning AI-generated images from text descriptions.",
  },
  {
    icon: Bot,
    title: "Smart Assistant",
    description: "Get help with writing, coding, planning, and creative tasks.",
  },
  {
    icon: Sparkles,
    title: "Creative AI",
    description: "Unleash your creativity with advanced AI-powered tools.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Lightning-fast responses and image generation in seconds.",
  },
  {
    icon: Palette,
    title: "Multiple Styles",
    description: "Choose from realistic, artistic, digital, and many more art styles.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="animate-section py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the power of AI with our advanced chatbot and image generation tools. Create, communicate, and innovate.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="feature-card glass border-border/50 hover:border-primary/50 transition-all duration-300"
            >
              <CardHeader>
                <feature.icon className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
