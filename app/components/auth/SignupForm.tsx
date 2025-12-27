"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { Input } from "@/app/components/ui/Input"
import { Button } from "@/app/components/ui/Button"
import { Toast } from "@/app/components/ui/Toast"

// Zod Schema for Signup Validation
const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type SignupFormData = z.infer<typeof signupSchema>

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [toastMessage, setToastMessage] = useState<string>("")
  const [toastError, setToastError] = useState(false)
  const { signup } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const showToast = (message: string, isError = false) => {
    setToastMessage(message)
    setToastError(isError)
    setTimeout(() => setToastMessage(""), 3000)
  }

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true)
    try {
      await signup(data.name, data.email, data.password)
      showToast("Account created! Redirecting to login...")
      setTimeout(() => router.push("/login"), 1500)
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Signup failed",
        true
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="rounded-lg border border-border/50 bg-card p-6 shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Join thousands of adventurers and start exploring
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...register("name")}
            label="Full Name"
            type="text"
            placeholder="John Doe"
            error={errors.name?.message}
          />

          <Input
            {...register("email")}
            label="Email"
            type="email"
            placeholder="your.email@example.com"
            error={errors.email?.message}
          />

          <div className="space-y-2">
            <Input
              {...register("password")}
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
            />
            <p className="text-xs text-muted-foreground">At least 8 characters</p>
          </div>

          <Input
            {...register("confirmPassword")}
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
          />

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full mt-6"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:text-primary/80 font-semibold transition"
          >
            Sign in
          </Link>
        </p>
      </div>

      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastError ? "error" : "success"}
          onClose={() => setToastMessage("")}
          />
      )}
    </>
  )
}