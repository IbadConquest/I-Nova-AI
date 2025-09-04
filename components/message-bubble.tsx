"use client"

import { useEffect, useRef } from "react"
import type { Message } from "@/lib/messages"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { gsap } from "gsap"
import { formatDistanceToNow } from "date-fns"

interface MessageBubbleProps {
  message: Message
  isUser: boolean
  animate?: boolean
}

export function MessageBubble({ message, isUser, animate = false }: MessageBubbleProps) {
  const bubbleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (animate && bubbleRef.current) {
      gsap.fromTo(
        bubbleRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out" },
      )
    }
  }, [animate])

  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    } catch {
      return "now"
    }
  }

  return (
    <div ref={bubbleRef} className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className={isUser ? "bg-primary text-primary-foreground" : "bg-muted"}>
          {isUser ? "U" : "AI"}
        </AvatarFallback>
      </Avatar>

      <div className={`flex flex-col gap-1 max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl px-4 py-2 ${
            isUser ? "bg-primary text-primary-foreground" : "glass-strong border border-border/50"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>

        <span className="text-xs text-muted-foreground px-2">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  )
}
