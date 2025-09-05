"use client"

import { useState, useEffect, useCallback, memo } from "react"
import { useTheme } from "next-themes"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, X, LogOut, User, Settings, Sparkles } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useRouter } from "next/navigation"

function NavigationComponent() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = useCallback(() => {
    logout()
    router.push("/")
  }, [logout, router])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "glass-strong" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center justify-center gap-3 mx-auto md:mx-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-accent grid place-items-center shadow-lg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 3l8.66 5v8L12 21l-8.66-5V8L12 3z" stroke="white" strokeWidth="1.8" />
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Nova AI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="/#features" className="hover:text-primary transition-colors">
            Features
          </a>
          <a href="/#pricing" className="hover:text-primary transition-colors">
            Pricing
          </a>
          <Link href="/generate" className="hover:text-primary transition-colors">
            AI Generator
          </Link>
          <Link href="/contact" className="hover:text-primary transition-colors">
            Contact
          </Link>
          {user && (
            <Link href="/chat" className="hover:text-primary transition-colors">
              Chat
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hidden sm:flex"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent">
                  <User className="h-4 w-4 mr-2" />
                  {user.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/chat">
                    <User className="h-4 w-4 mr-2" />
                    Chat
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/generate">
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI Generator
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin">
                    <Settings className="h-4 w-4 mr-2" />
                    Admin Panel
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            className="md:hidden bg-transparent"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-strong border-t border-border/50">
          <div className="px-4 py-4 space-y-3">
            <a
              href="/#features"
              className="block text-sm text-muted-foreground hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="/#pricing"
              className="block text-sm text-muted-foreground hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <Link
              href="/generate"
              className="block text-sm text-muted-foreground hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              AI Generator
            </Link>
            <Link
              href="/contact"
              className="block text-sm text-muted-foreground hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            {user && (
              <Link
                href="/chat"
                className="block text-sm text-muted-foreground hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Chat
              </Link>
            )}
            <div className="flex items-center gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              {user ? (
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/login">Sign in</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/register">Sign up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export const Navigation = memo(NavigationComponent)
