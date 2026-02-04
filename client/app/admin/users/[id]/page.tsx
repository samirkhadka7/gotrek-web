"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/app/components/ui/Button"

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { logout } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur px-6 py-4 flex items-center justify-between">
        <Link href="/admin/users" className="text-xl font-bold text-primary">GoTrek Admin</Link>
        <div className="flex items-center gap-4">
          <Link href="/admin/users" className="text-sm text-muted-foreground hover:underline">← Back to Users</Link>
          <button onClick={logout} className="text-sm text-destructive hover:underline">Logout</button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-lg">
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">User Detail</h1>
            <Link href={`/admin/users/${id}/edit`}>
              <Button variant="outline">Edit</Button>
            </Link>
          </div>

          <div className="space-y-4">
            <div className="rounded-md bg-muted/40 border border-border px-4 py-3">
              <p className="text-xs text-muted-foreground mb-1">User ID</p>
              <p className="text-sm font-mono font-medium text-foreground break-all">{id}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-md bg-muted/40 border border-border px-4 py-3">
                <p className="text-xs text-muted-foreground mb-1">Name</p>
                <p className="text-sm font-medium text-foreground">—</p>
              </div>
              <div className="rounded-md bg-muted/40 border border-border px-4 py-3">
                <p className="text-xs text-muted-foreground mb-1">Role</p>
                <p className="text-sm font-medium text-foreground">—</p>
              </div>
            </div>

            <div className="rounded-md bg-muted/40 border border-border px-4 py-3">
              <p className="text-xs text-muted-foreground mb-1">Email</p>
              <p className="text-sm font-medium text-foreground">—</p>
            </div>

            <div className="rounded-md bg-muted/40 border border-border px-4 py-3">
              <p className="text-xs text-muted-foreground mb-1">Created At</p>
              <p className="text-sm font-medium text-foreground">—</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
