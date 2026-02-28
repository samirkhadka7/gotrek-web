'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Spinner from '@/components/ui/Spinner';
import Providers from '@/app/providers';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, Mountain, UserCheck, CreditCard, ArrowLeft, LogOut, User } from 'lucide-react';
import { getImageUrl } from '@/services/api';

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/trails', label: 'Trails', icon: Mountain },
  { href: '/admin/groups', label: 'Groups', icon: Users },
  { href: '/admin/requests', label: 'Requests', icon: UserCheck },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
];

function AdminContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) router.push('/dashboard');
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-screen"><Spinner size="lg" /></div>;
  if (!user || user.role !== 'admin') return null;

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-lg font-bold">Admin Panel</h1>
          <p className="text-xs text-gray-400 mt-1">GoTrek Management</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {adminLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}
                className={cn('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  active ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200')}>
                <link.icon className="h-[18px] w-[18px]" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to App
          </Link>
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6">
          <span className="text-sm text-gray-500">Logged in as <strong className="text-gray-900">{user.name}</strong></span>
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {user.profileImage ? (
                <img
                  src={getImageUrl(user.profileImage)}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-linear-to-br from-blue-600 to-sky-500 flex items-center justify-center text-white text-xs font-semibold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-sm font-medium text-gray-900">{user.name}</span>
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                >
                  <User className="h-4 w-4" /> View Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <Providers><AdminContent>{children}</AdminContent></Providers>;
}
