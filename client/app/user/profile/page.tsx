"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAuth } from "@/contexts/AuthContext"
import { updateProfile } from "@/lib/api/admin"
import { Button } from "@/app/components/ui/Button"
import { Input } from "@/app/components/ui/Input"
import { Toast } from "@/app/components/ui/Toast"

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? "", email: user?.email ?? "" },
  })

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return
    setIsLoading(true)
    try {
      // Always use FormData (Multer requirement)
      const formData = new FormData()
      formData.append("name", data.name)
      if (data.email) formData.append("email", data.email)
      if (imageFile) formData.append("image", imageFile)

      await updateProfile(user.id, formData)
      showToast("Profile updated successfully!")
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Update failed", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-primary">GoTrek</span>
        <span className="text-sm text-muted-foreground">My Profile</span>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-lg">
        <h1 className="text-2xl font-bold text-foreground mb-2">Update Profile</h1>
        <p className="text-muted-foreground mb-8">Update your account information</p>

        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              {...register("name")}
              label="Full Name"
              placeholder="Your name"
              error={errors.name?.message}
            />
            <Input
              {...register("email")}
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Profile Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full mt-2">
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </div>

        <div className="mt-6 rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">
            Logged in as <span className="font-medium text-foreground">{user?.name}</span> · Role:{" "}
            <span className="font-medium text-foreground capitalize">{user?.role}</span>
          </p>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
