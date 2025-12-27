import { ButtonHTMLAttributes, ReactNode } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "colorful" | "rainbow"
  isLoading?: boolean
  children: ReactNode
}

export function Button({
  variant = "primary",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "px-6 py-3 rounded-md font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    outline: "border border-input bg-background text-foreground hover:bg-muted",
    colorful: "bg-linear-to-r from-pink-500 to-yellow-500 text-white hover:from-pink-600 hover:to-yellow-600",
    rainbow: "bg-linear-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500 text-white hover:opacity-90"
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  )
}