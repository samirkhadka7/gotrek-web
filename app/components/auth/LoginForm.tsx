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

// Zod Schema for Login Validation
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [toastMessage, setToastMessage] = useState<string>("")
  const [toastError, setToastError] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const showToast = (message: string, isError = false) => {
    setToastMessage(message)
    setToastError(isError)
    setTimeout(() => setToastMessage(""), 3000)
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      await login(data.email, data.password)
      showToast("Login successful!")
      setTimeout(() => router.push("/dashboard"), 500)
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Login failed",
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
          <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to your account to continue exploring
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...register("email")}
            label="Email"
            type="email"
            placeholder="your.email@example.com"
            error={errors.email?.message}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:text-primary/80 transition"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
            />
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full mt-6"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-primary hover:text-primary/80 font-semibold transition"
          >
            Sign up
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