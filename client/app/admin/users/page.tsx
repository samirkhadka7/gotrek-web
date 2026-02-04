"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/app/components/ui/Button"

const DUMMY_USERS = [
  { id: "64a1b2c3d4e5f6789012345a", name: "Alice Sherpa", email: "alice@gotrek.com", role: "admin", createdAt: "2025-01-10" },
  { id: "64a1b2c3d4e5f6789012345b", name: "Bob Tamang", email: "bob@gotrek.com", role: "user", createdAt: "2025-02-15" },
  { id: "64a1b2c3d4e5f6789012345c", name: "Carla Rai", email: "carla@gotrek.com", role: "user", createdAt: "2025-03-20" },
  { id: "64a1b2c3d4e5f6789012345d", name: "Dev Limbu", email: "dev@gotrek.com", role: "user", createdAt: "2025-04-05" },
]

export default function AdminUsersPage() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold text-primary">GoTrek Admin</Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span>
          <button onClick={logout} className="text-sm text-destructive hover:underline">Logout</button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage all registered users</p>
          </div>
          <Link href="/admin/users/create">
            <Button>+ Create User</Button>
          </Link>
        </div>

        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">ID</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Role</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Created</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {DUMMY_USERS.map((u) => (
                <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{u.id.slice(-8)}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{u.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      u.role === "admin"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{u.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/users/${u.id}`} className="text-xs text-primary hover:underline">View</Link>
                      <Link href={`/admin/users/${u.id}/edit`} className="text-xs text-primary hover:underline">Edit</Link>
                      <button className="text-xs text-destructive hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
