'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ChevronDown, LogOut, UserCircle, Settings, Shield, KeyRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getImageUrl } from '@/services/api';
import NotificationDropdown from './NotificationDropdown';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/trails': 'Explore Trails',
  '/groups': 'Trekking Groups',
  '/checklist': 'Checklist',
  '/chatbot': 'TrailMate AI',
  '/steps': 'Step Tracker',
  '/subscription': 'Subscription',
  '/profile': 'My Profile',
  '/change-password': 'Change Password',
  '/admin': 'Admin Panel',
  '/admin/users': 'Manage Users',
  '/admin/trails': 'Manage Trails',
  '/admin/groups': 'Manage Groups',
  '/admin/payments': 'Payments',
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith('/trails/')) return 'Trail Details';
  if (pathname.startsWith('/groups/') && pathname.endsWith('/edit')) return 'Edit Group';
  if (pathname.startsWith('/groups/create')) return 'Create Group';
  if (pathname.startsWith('/groups/')) return 'Group Details';
  if (pathname.startsWith('/chat/')) return 'Group Chat';
  if (pathname.startsWith('/admin/trails/edit')) return 'Edit Trail';
  if (pathname.startsWith('/admin/trails/create')) return 'Create Trail';
  return 'GoTrek';
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const pageTitle = getPageTitle(pathname);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-6">
      {/* Page title */}
      <div>
        <h1 className="text-lg font-bold text-gray-900">{pageTitle}</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <NotificationDropdown />

        <div ref={menuRef} className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
          >
            {/* Avatar */}
            {user?.profileImage ? (
              <img
                src={getImageUrl(user.profileImage)}
                alt={user.name}
                className="w-8 h-8 rounded-lg object-cover shadow-sm"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-sky-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}

            {/* Name + plan */}
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-900 leading-tight">{user?.name || 'User'}</p>
              <p className="text-[11px] text-gray-400 leading-tight capitalize">{user?.subscription || 'Basic'} Plan</p>
            </div>

            <ChevronDown className={cn('h-4 w-4 text-gray-400 transition-transform duration-200', showMenu && 'rotate-180')} />
          </button>

          {/* Dropdown */}
          {showMenu && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-60 bg-white rounded-2xl shadow-2xl shadow-gray-200/80 border border-gray-100 py-2 z-50">
              {/* User info header */}
              <div className="px-4 py-3 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  {user?.profileImage ? (
                    <img src={getImageUrl(user.profileImage)} alt={user.name} className="w-10 h-10 rounded-xl object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-sky-500 flex items-center justify-center text-white font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1">
                <Link
                  href="/profile"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="h-4 w-4 text-gray-400" />
                  Profile & Settings
                </Link>

                {!user?.googleId && (
                  <Link
                    href="/change-password"
                    onClick={() => setShowMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <KeyRound className="h-4 w-4 text-gray-400" />
                    Change Password
                  </Link>
                )}

                <Link
                  href="/subscription"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <UserCircle className="h-4 w-4 text-gray-400" />
                  Subscription
                </Link>

                {user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setShowMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-colors border-t border-gray-50"
                  >
                    <Shield className="h-4 w-4" />
                    Admin Panel
                  </Link>
                )}
              </div>

              {/* Sign out */}
              <div className="border-t border-gray-50 pt-1">
                <button
                  onClick={() => { setShowMenu(false); logout(); }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
// TODO: add aria-labels for accessibility
