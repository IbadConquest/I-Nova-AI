import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Inbox, Bot, Puzzle, Shield, Settings, Edit } from "lucide-react"

const features = [
  {
    icon: Inbox,
    title: "Smart Inbox",
    description: "Capture name, email and message. Validate automatically.",
  },
  {
    icon: Bot,
    title: "AI Drafts",
    description: "Generate polished replies with your tone and policies.",
  },
  {
    icon: Puzzle,
    title: "Plug & Play",
    description: "Point to your webhook URL — no rebuilds required.",
  },
  {
    icon: Shield,
    title: "Private by default",
    description: "Requests stay between your browser and your endpoint.",
  },
  {
    icon: Settings,
    title: "Configurable",
    description: "Demo, n8n webhook, or custom proxy — your choice.",
  },
  {
    icon: Edit,
    title: "One‑click edit",
    description: "Tone buttons: friendly, formal, concise.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="animate-section py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Collect messages, draft answers with AI, approve, and send — all from one page.
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
