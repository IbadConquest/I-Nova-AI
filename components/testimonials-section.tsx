"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    quote: "Nova is like an extra teammate who never gets tired of writing replies.",
    author: "Zoya, Support Lead",
  },
  {
    quote: "We've cut our response time by 80% since implementing Nova AI.",
    author: "Marcus, Customer Success",
  },
  {
    quote: "The tone matching is incredible. It sounds exactly like our brand voice.",
    author: "Sarah, Marketing Director",
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="animate-section py-16 lg:py-24 bg-muted/20 border-y border-border/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-12">People are shipping faster</h2>

        <Card className="glass border-border/50 p-8">
          <CardContent className="p-0">
            <blockquote className="text-xl text-foreground mb-6">"{testimonials[currentIndex].quote}"</blockquote>
            <div className="text-muted-foreground">— {testimonials[currentIndex].author}</div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-3 mt-6">
          {testimonials.map((_, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className={`w-3 h-3 rounded-full p-0 ${index === currentIndex ? "bg-primary" : "bg-muted"}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
