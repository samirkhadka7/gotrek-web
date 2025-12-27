"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

interface NavbarProps {
  showAuthButtons?: boolean
}

export function Navbar({ showAuthButtons = true }: NavbarProps) {
  const { user, logout } = useAuth()

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold transition-transform group-hover:scale-105 shadow-md">
          </div>
          <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">GoTrek</span>
        </Link>

        {showAuthButtons && (
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.name}!
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-md border border-border bg-card text-card-foreground text-sm font-medium hover:bg-muted hover:border-primary/50 transition-all shadow-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-muted-foreground hover:text-foreground transition"
                >
                  Login
                </Link>
                <Link href="/signup">
                  <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 hover:shadow-lg transition-all shadow-md transform hover:scale-105">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}