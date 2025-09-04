import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-primary/10 via-transparent to-transparent parallax-bg" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-accent/5 via-transparent to-primary/5 parallax-slow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <Badge variant="secondary" className="hero-badge mb-6 text-primary hover-card">
              New • n8n-ready
            </Badge>

            <h1 className="hero-title text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight text-balance">
              Turn every message into a{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                polished, on‑brand reply
              </span>
            </h1>

            <p className="hero-description mt-6 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Plug Nova AI into your n8n webhook or your own API. Drafts are fast, accurate, and match your tone.
            </p>

            <div className="hero-buttons mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="text-lg px-8 magnetic-button hover-button">
                <Link href="/chat">Try the Assistant</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-8 magnetic-button hover-button bg-transparent"
              >
                <Link href="#features">Explore Features</Link>
              </Button>
            </div>
          </div>

          <div className="hero-preview relative">
            <div className="glass rounded-3xl shadow-2xl p-6 float-card hover-card">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="ml-2">Live Preview</span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="p-3 rounded-2xl bg-muted w-fit max-w-[80%] hover-card">
                  New message: "Can you send me more details?"
                </div>
                <div className="p-3 rounded-2xl bg-primary text-primary-foreground w-fit max-w-[80%] ml-auto hover-card">
                  AI draft: "Of course! Here’s a clear breakdown of the information you requested."
                </div>
                <div className="p-3 rounded-2xl bg-muted w-fit max-w-[80%] hover-card">You: "Approve & send."</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
