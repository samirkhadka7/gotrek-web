"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { createUser } from "@/lib/api/admin"
import { Button } from "@/app/components/ui/Button"
import { Input } from "@/app/components/ui/Input"
import { Toast } from "@/app/components/ui/Toast"

const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["user", "admin"]),
})

type CreateUserFormData = z.infer<typeof createUserSchema>

export default function AdminCreateUserPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { role: "user" },
  })

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const onSubmit = async (data: CreateUserFormData) => {
    setIsLoading(true)
    try {
      // Always use FormData — endpoint uses Multer
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("email", data.email)
      formData.append("password", data.password)
      formData.append("role", data.role)
      if (imageFile) formData.append("image", imageFile)

      await createUser(formData)
      showToast("User created successfully!")
      setTimeout(() => router.push("/admin/users"), 1000)
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to create user", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur px-6 py-4 flex items-center justify-between">
        <Link href="/admin/users" className="text-xl font-bold text-primary">GoTrek Admin</Link>
        <Link href="/admin/users" className="text-sm text-muted-foreground hover:underline">← Back to Users</Link>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-lg">
        <h1 className="text-2xl font-bold text-foreground mb-2">Create User</h1>
        <p className="text-muted-foreground mb-8">Add a new user to the system</p>

        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              {...register("name")}
              label="Full Name"
              placeholder="e.g. Alice Sherpa"
              error={errors.name?.message}
            />
            <Input
              {...register("email")}
              label="Email"
              type="email"
              placeholder="user@example.com"
              error={errors.email?.message}
            />
            <Input
              {...register("password")}
              label="Password"
              type="password"
              placeholder="Min 8 characters"
              error={errors.password?.message}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Role</label>
              <select
                {...register("role")}
                className="w-full px-3 py-2.5 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Profile Image (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full mt-2">
              {isLoading ? "Creating..." : "Create User"}
            </Button>
          </form>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
