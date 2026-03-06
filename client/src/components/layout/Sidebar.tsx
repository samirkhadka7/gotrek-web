'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { getImageUrl } from '@/services/api';
import { LayoutDashboard, Mountain, Users, CheckSquare, Bot, Footprints, Crown, UserCircle, X, Menu, LogOut, Sparkles } from 'lucide-react';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/trails', label: 'Trails', icon: Mountain },
  { href: '/groups', label: 'Groups', icon: Users },
  { href: '/checklist', label: 'Checklist', icon: CheckSquare },
  { href: '/chatbot', label: 'TrailMate AI', icon: Bot, pro: true },
  { href: '/steps', label: 'Steps', icon: Footprints },
  { href: '/subscription', label: 'Subscription', icon: Crown },
  { href: '/profile', label: 'Profile', icon: UserCircle },
];

const planColors: Record<string, string> = {
  Pro: 'bg-violet-100 text-violet-700 border-violet-200',
  Premium: 'bg-amber-100 text-amber-700 border-amber-200',
  Basic: 'bg-gray-100 text-gray-500 border-gray-200',
};

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const plan = user?.subscription || 'Basic';
  const planColor = planColors[plan] || planColors.Basic;

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg border border-gray-100"
      >
        <Menu className="h-5 w-5 text-gray-700" />
      </button>

      {/* Overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setOpen(false)} />
      )}

      <aside className={cn(
        'fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300',
        'lg:translate-x-0 lg:static lg:z-auto',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <Link href="/dashboard" className="flex items-center gap-2.5 group" onClick={() => setOpen(false)}>
            <Image
              src="/logo.jpg"
              alt="GoTrek Logo"
              width={34}
              height={34}
              className="rounded-xl object-cover group-hover:scale-105 transition-transform shadow-sm"
            />
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
              GoTrek
            </span>
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative',
                  active
                    ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md shadow-blue-500/20'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <link.icon className={cn('h-[18px] w-[18px] flex-shrink-0', active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600')} />
                <span className="flex-1">{link.label}</span>
                {link.pro && plan === 'Basic' && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-600 border border-violet-200">
                    PRO
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Upgrade banner - only for Basic plan */}
        {plan === 'Basic' && (
          <div className="mx-3 mb-3 p-3.5 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span className="text-sm font-semibold">Upgrade to Pro</span>
            </div>
            <p className="text-xs text-blue-100 mb-3 leading-relaxed">
              Unlock AI checklist, TrailMate, and group creation.
            </p>
            <Link
              href="/subscription"
              onClick={() => setOpen(false)}
              className="block text-center text-xs font-semibold bg-white text-blue-600 rounded-lg py-1.5 hover:bg-blue-50 transition-colors"
            >
              View Plans
            </Link>
          </div>
        )}

        {/* User card at bottom */}
        <div className="border-t border-gray-100 p-3">
          <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
            {/* Avatar */}
            {user?.profileImage ? (
              <img
                src={getImageUrl(user.profileImage)}
                alt={user?.name}
                className="w-9 h-9 rounded-xl object-cover flex-shrink-0 shadow-sm"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'User'}</p>
              <span className={cn('inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded-full border', planColor)}>
                {plan}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={() => { setOpen(false); logout(); }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
// TODO: collapse sidebar on mobile by default
