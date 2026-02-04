"use client"

import Link from "next/link"
import { SignupForm } from "@/app/components/auth/SignupForm"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background to-muted/30 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
            ⛰️
          </div>
          <span className="text-2xl font-bold text-foreground ml-2">GoTrek</span>
        </div>

        {/* Signup Form Component */}
        <SignupForm />

        {/* Footer Text */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing up, you agree to our{" "}
          <a href="#" className="underline hover:text-foreground transition">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-foreground transition">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}
