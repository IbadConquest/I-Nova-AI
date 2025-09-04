import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary to-accent grid place-items-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3l8.66 5v8L12 21l-8.66-5V8L12 3z" stroke="white" strokeWidth="1.6" />
                </svg>
              </div>
              <div className="font-semibold text-foreground text-lg">Nova AI</div>
            </div>
            <p className="text-sm max-w-md text-muted-foreground mb-6">
              Smart AI replies made simple. Integrate with n8n or your own proxy—no hassle, just results.
            </p>
            <div className="flex gap-3 text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.29 20c7.55 0 11.68-6.26 11.68-11.69v-.53A8.36 8.36 0 0 0 22 5.92a8.2 8.2 0 0 1-2.36.65 4.12 4.12 0 0 0 1.8-2.27 8.23 8.23 0 0 1-2.61 1 4.1 4.1 0 0 0-7 3.74A11.65 11.65 0 0 1 3.15 4.7a4.09 4.09 0 0 0 1.27 5.47 4.07 4.07 0 0 1-1.86-.51v.05a4.1 4.1 0 0 0 3.29 4 4.12 4.12 0 0 1-1.85.07A4.1 4.1 0 0 0 6.93 16a8.23 8.23 0 0 1-5.09 1.76 8.38 8.38 0 0 1-1-.06A11.62 11.62 0 0 0 8.29 20" />
                </svg>
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .5A12 12 0 0 0 0 12.7a12.2 12.2 0 0 0 8.2 11.6c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6a3.2 3.2 0 0 0-1.3-1.8c-1-.7.1-.7.1-.7a2.6 2.6 0 0 1 1.9 1.3 2.7 2.7 0 0 0 3.7 1.1 2.7 2.7 0 0 1 .8-1.7c-2.6-.3-5.4-1.3-5.4-6a4.8 4.8 0 0 1 1.3-3.3 4.5 4.5 0 0 1 .1-3.2s1-.3 3.3 1.3a11.3 11.3 0 0 1 6 0C18.7 5.5 19.7 5.8 19.7 5.8a4.5 4.5 0 0 1 .1 3.2 4.8 4.8 0 0 1 1.3 3.3c0 4.7-2.8 5.7-5.4 6a3 3 0 0 1 .9 2.3v3.3c0 .3.2.7.8.6A12.2 12.2 0 0 0 24 12.7 12 12 0 0 0 12 .5Z" />
                </svg>
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 8.98h4v12H3v-12Zm7 0h3.83v1.64h.05c.53-1 1.82-2.06 3.75-2.06 4.01 0 4.75 2.64 4.75 6.07v6.35h-4v-5.64c0-1.34-.02-3.06-1.86-3.06-1.87 0-2.16 1.46-2.16 2.97v5.73H10v-12Z" />
                </svg>
              </Link>
            </div>
          </div>

          <div>
            <div className="font-medium text-foreground mb-4">Product</div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/chat" className="text-muted-foreground hover:text-primary transition-colors">
                  Assistant
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-medium text-foreground mb-4">Stay Connected</div>
            <form className="flex gap-2 mb-2">
              <Input type="email" placeholder="Enter your email" className="flex-1" />
              <Button type="submit">Subscribe</Button>
            </form>
            <p className="text-xs text-muted-foreground">Get occasional updates. No spam, ever.</p>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground">© {new Date().getFullYear()} Nova AI. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
