"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
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

  if (!user) {
    return null
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
            <span className="text-sm text-muted-foreground">Welcome, {user.name}!</span>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-md border border-input bg-background text-foreground text-sm font-medium hover:bg-muted transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.name}! Ready for your next adventure?</p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="text-2xl mb-2">🗺️</div>
              <h3 className="font-semibold text-foreground mb-1">Trails Completed</h3>
              <p className="text-3xl font-bold text-primary">0</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="text-2xl mb-2">👥</div>
              <h3 className="font-semibold text-foreground mb-1">Groups Joined</h3>
              <p className="text-3xl font-bold text-primary">0</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="text-2xl mb-2">🏆</div>
              <h3 className="font-semibold text-foreground mb-1">Achievements</h3>
              <p className="text-3xl font-bold text-primary">0</p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-lg border border-border bg-card p-6 hover:border-primary/50 transition cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🗺️</div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Discover Trails</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Browse and filter trails by difficulty, duration, and location
                  </p>
                  <button className="text-sm text-primary hover:text-primary/80 font-medium">
                    Explore Trails →
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 hover:border-primary/50 transition cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="text-3xl">👥</div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Join Groups</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect with other hikers and join adventure groups
                  </p>
                  <button className="text-sm text-primary hover:text-primary/80 font-medium">
                    Find Groups →
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 hover:border-primary/50 transition cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="text-3xl">⚡</div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Plan Your Trek</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    AI-powered checklists and recommendations for your trek
                  </p>
                  <button className="text-sm text-primary hover:text-primary/80 font-medium">
                    Start Planning →
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 hover:border-primary/50 transition cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="text-3xl">💬</div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Community Chat</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Stay connected with your group during your adventure
                  </p>
                  <button className="text-sm text-primary hover:text-primary/80 font-medium">
                    Open Chat →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="mt-8 rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Your Profile</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Name</span>
                <span className="text-sm font-medium text-foreground">{user.name}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm font-medium text-foreground">{user.email}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <span className="text-sm font-medium text-foreground">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}