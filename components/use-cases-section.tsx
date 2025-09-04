import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Briefcase, Navigation } from "lucide-react"

const useCases = [
  {
    icon: Mail,
    title: "Customer support",
    description: "Turn long emails into clear, friendly replies that match your style.",
  },
  {
    icon: Briefcase,
    title: "Sales follow‑ups",
    description: "Send crisp, persuasive follow‑ups with your value props baked in.",
  },
  {
    icon: Navigation,
    title: "Internal replies",
    description: "Draft quick answers for Slack/Teams threads without breaking flow.",
  },
]

export function UseCasesSection() {
  return (
    <section className="animate-section py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">What can you do with Nova?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Here are a few ways teams use Nova every day.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <Card
              key={index}
              className="feature-card glass border-border/50 hover:border-primary/50 transition-all duration-300 float-card"
            >
              <CardHeader>
                <useCase.icon className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">{useCase.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">{useCase.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
