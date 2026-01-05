"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { login as loginApi, register as registerApi } from "@/lib/api/auth"

interface User {
  id: string
  name: string
  email?: string
  role: "user" | "admin"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    const token = localStorage.getItem("authToken")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    if (!token) {
      localStorage.removeItem("currentUser")
      setUser(null)
    }
    setIsLoading(false)
  }, [])

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await registerApi({ name, email, password })
      if (!response.success) {
        throw new Error(response.message || "Signup failed")
      }

      return true
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await loginApi({ email, password })

      if (!response.success || !response.data?.token || !response.data?.user) {
        throw new Error(response.message || "Login failed")
      }

      const authenticatedUser = response.data.user
      localStorage.setItem("authToken", response.data.token)
      localStorage.setItem("currentUser", JSON.stringify(authenticatedUser))
      setUser(authenticatedUser)

      return true
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
    localStorage.removeItem("authToken")
    router.push("/")
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}