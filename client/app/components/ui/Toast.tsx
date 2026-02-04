"use client"

interface ToastProps {
  message: string
  type?: "success" | "error"
  onClose: () => void
}

export function Toast({ message, type = "success", onClose }: ToastProps) {
  return (
    <div
      className={`fixed bottom-4 right-4 px-4 py-2 rounded-md text-white text-sm shadow-lg border ${
        type === "error"
          ? "bg-linear-to-r from-red-400 to-red-600 border-red-300"
          : "bg-linear-to-r from-green-400 to-green-600 border-green-300"
      }`}
    >
      {message}
    </div>
  )
}