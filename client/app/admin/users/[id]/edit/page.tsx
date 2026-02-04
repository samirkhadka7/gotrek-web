"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export default function AdminUserEditPage() {
  const { id } = useParams<{ id: string }>()
  const { logout } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur px-6 py-4 flex items-center justify-between">
        <Link href="/admin/users" className="text-xl font-bold text-primary">GoTrek Admin</Link>
        <div className="flex items-center gap-4">
          <Link href={`/admin/users/${id}`} className="text-sm text-muted-foreground hover:underline">← Back to User</Link>
          <button onClick={logout} className="text-sm text-destructive hover:underline">Logout</button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-lg">
        <h1 className="text-2xl font-bold text-foreground mb-2">Edit User</h1>
        <p className="text-muted-foreground mb-8">Editing user with ID:</p>

        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="rounded-md bg-muted/40 border border-border px-4 py-3 mb-6">
            <p className="text-xs text-muted-foreground mb-1">User ID</p>
            <p className="text-sm font-mono font-medium text-foreground break-all">{id}</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <input
                type="text"
                placeholder="Enter name"
                disabled
                className="w-full px-3 py-2.5 rounded-md border border-input bg-muted text-muted-foreground text-sm cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                placeholder="Enter email"
                disabled
                className="w-full px-3 py-2.5 rounded-md border border-input bg-muted text-muted-foreground text-sm cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Role</label>
              <select
                disabled
                className="w-full px-3 py-2.5 rounded-md border border-input bg-muted text-muted-foreground text-sm cursor-not-allowed"
              >
                <option>user</option>
                <option>admin</option>
              </select>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-6 text-center">
            Wire up to <code className="bg-muted px-1 rounded">PUT /api/admin/users/{"{id}"}</code> to enable editing
          </p>
        </div>
      </div>
    </div>
  )
}
