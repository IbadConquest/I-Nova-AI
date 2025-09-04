import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="animate-section py-20 lg:py-32 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="relative glass rounded-3xl p-10 lg:p-16 border border-primary/30 bg-gradient-to-br from-primary/10 to-accent/10 hover-card">
          <div className="cta-glow absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-xl -z-10" />

          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Reply 10× faster with Nova</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect directly to AI and deliver polished, on-brand responses instantly.
          </p>
          <Button asChild size="lg" className="text-lg px-8 magnetic-button hover-button">
            <Link href="/chat">Open the Assistant</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
