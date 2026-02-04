"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">⛰️</div>
            <span className="text-xl font-bold text-foreground">GoTrek</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition">
              Login
            </Link>
            <Link href="/signup">
              <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 md:py-32 bg-linear-to-br from-primary/5 via-accent/5 to-secondary/5">
        <div className="container mx-auto">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="inline-block">
              <div className="rounded-full bg-accent/10 px-4 py-1.5 text-sm text-accent border border-accent/20 shadow-sm">
                🏔️ Discover Amazing Trails
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground max-w-3xl text-balance">
              Your Next Adventure Awaits
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-balance">
              Join thousands of hikers exploring trails, connecting with like-minded adventurers, and sharing their
              trekking stories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/signup">
                <button className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 hover:shadow-lg transition-all shadow-md transform hover:scale-105">
                  Start Exploring →
                </button>
              </Link>
              <button className="px-6 py-3 rounded-md border border-border bg-card text-card-foreground font-medium hover:bg-muted hover:border-primary/50 transition-all shadow-sm">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-linear-to-br from-muted/20 via-background to-accent/5">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose GoTrek?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to plan and share your hiking adventures
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-lg border border-border/50 bg-card p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:bg-linear-to-br hover:from-primary/5 hover:to-accent/5 group">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🗺️</div>
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">Discover Trails</h3>
              <p className="text-sm text-muted-foreground">
                Browse and filter trails by difficulty, duration, and location
              </p>
            </div>
            <div className="rounded-lg border border-border/50 bg-card p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:bg-linear-to-br hover:from-secondary/5 hover:to-accent/5 group">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">👥</div>
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">Join Groups</h3>
              <p className="text-sm text-muted-foreground">Connect with other hikers and join adventure groups</p>
            </div>
            <div className="rounded-lg border border-border/50 bg-card p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:bg-linear-to-br hover:from-accent/5 hover:to-primary/5 group">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">⚡</div>
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">Smart Planning</h3>
              <p className="text-sm text-muted-foreground">AI-powered checklists and recommendations for your trek</p>
            </div>
            <div className="rounded-lg border border-border/50 bg-card p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:bg-linear-to-br hover:from-chart-1/5 hover:to-chart-2/5 group">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">💬</div>
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">Real-time Chat</h3>
              <p className="text-sm text-muted-foreground">Stay connected with your group during your adventure</p>
            </div>
            <div className="rounded-lg border border-border/50 bg-card p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:bg-linear-to-br hover:from-destructive/5 hover:to-accent/5 group">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🔒</div>
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">Secure & Safe</h3>
              <p className="text-sm text-muted-foreground">Your data is stored securely in your browser</p>
            </div>
            <div className="rounded-lg border border-border/50 bg-card p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:bg-linear-to-br hover:from-chart-3/5 hover:to-chart-4/5 group">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🏆</div>
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">Achievements</h3>
              <p className="text-sm text-muted-foreground">Track your hiking stats and earn badges</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-linear-to-r from-primary/10 via-accent/10 to-secondary/10">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Ready to Start Your Adventure?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our community and discover the best trails with GoTrek
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <button className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 hover:shadow-lg transition-all shadow-md transform hover:scale-105">
                Create Account
              </button>
            </Link>
            <Link href="/login">
              <button className="px-6 py-3 rounded-md border border-border bg-card text-card-foreground font-medium hover:bg-muted hover:border-primary/50 transition-all shadow-sm">
                Already have an account?
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-12 bg-linear-to-r from-muted/10 to-accent/5">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-6 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-sm">
                  ⛰️
                </div>
                <span className="font-bold text-foreground">GoTrek</span>
              </div>
              <p className="text-sm text-muted-foreground">Explore trails. Connect. Discover.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Trails
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Groups
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Community
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 GoTrek. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}