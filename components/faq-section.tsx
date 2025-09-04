import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "Do you store my messages?",
    answer:
      'No. Your data stays private—we don’t keep or share your messages.',
  },
  {
    question: "What integrations are supported?",
    answer: "Nova works with popular platforms and tools, plus you can connect directly to AI.",
  },
  {
    question: "Does Nova adapt to different communication styles?",
    answer: "Yes! You can adjust style, tone, and personality to match your brand voice.",
  },
  {
    question: "Can I use Nova without technical setup?",
    answer:
      "Absolutely. Just sign in, connect to AI, and start generating replies instantly.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes, you can try Nova free before upgrading.",
  },
]

export function FAQSection() {
  return (
    <section className="animate-section py-16 lg:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Frequently asked</h2>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="glass border-border/50 rounded-xl px-6">
              <AccordionTrigger className="text-left font-medium hover:no-underline">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
