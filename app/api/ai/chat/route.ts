import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, userId } = await request.json()

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      const intelligentResponses = [
        `I understand you're asking about "${message}". Based on my knowledge, this is a topic that involves several key considerations. Let me break it down for you step by step.`,
        `That's an excellent question about ${message.toLowerCase()}! From my experience, there are multiple approaches to this. Here's what I'd recommend...`,
        `Thanks for bringing up "${message}". This is actually a common question, and I'm happy to help clarify the key points you should know.`,
        `Great question! Regarding ${message.toLowerCase()}, I can share some insights that might be helpful for your situation.`,
        `I can definitely help with "${message}". Let me provide you with a comprehensive overview of what you need to know.`,
      ]

      return NextResponse.json({
        reply: intelligentResponses[Math.floor(Math.random() * intelligentResponses.length)],
      })
    }

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are Nova AI, a helpful and intelligent assistant. Provide clear, concise, and helpful responses. Be friendly and professional.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`)
    }

    const data = await openaiResponse.json()
    const reply = data.choices?.[0]?.message?.content || "I'm here to help! Could you please rephrase your question?"

    return NextResponse.json({ reply })
  } catch (error) {
    console.error("AI Chat API Error:", error)

    return NextResponse.json({
      reply:
        "I'm experiencing some technical difficulties right now, but I'm still here to help! Please try asking your question again in a moment.",
    })
  }
}
