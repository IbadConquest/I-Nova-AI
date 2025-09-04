import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for trying out Nova AI",
    features: ["Demo AI (client‑side)", "Configurable webhook", "Unlimited drafts"],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/mo",
    description: "Best for growing teams",
    features: ["Use your API (n8n/OpenAI proxy)", "Custom tone presets", "Local history"],
    highlighted: true,
  },
  {
    name: "Team",
    price: "Custom",
    description: "For enterprise needs",
    features: ["Shared style guide", "Role‑based presets", "SLA & support"],
    highlighted: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="animate-section py-16 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Pricing</h2>
          <p className="text-lg text-muted-foreground">Choose the plan that fits your needs</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`pricing-card relative ${
                plan.highlighted ? "border-primary shadow-lg shadow-primary/20 scale-105" : "glass border-border/50"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground ml-1">{plan.period}</span>}
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button className="w-full" variant={plan.highlighted ? "default" : "outline"}>
                  {plan.name === "Team" ? "Contact Sales" : "Get Started"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
