'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { LayoutDashboard, Users, Wallet, Settings, LogOut, Menu, Layers, BarChart3, Megaphone } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const profile = useQuery(api.users.getUserByClerkId, { clerkId: user?.id || '' });

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Click Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Withdrawals', href: '/admin/withdrawals', icon: Wallet },
    { name: 'Advertiser Inquiries', href: '/admin/inquiries', icon: Megaphone },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF9]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2EE6A6]"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!profile?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF9]">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">You do not have permission to access this page.</p>
          <Link href="/dashboard" className="mt-4 inline-block bg-[#2EE6A6] text-[#111111] px-6 py-3 rounded-xl font-semibold">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#FFFDF9] font-['Inter',sans-serif] text-[#111111]">
      <aside className="hidden w-64 flex-col border-r border-[#E5E7EB] bg-white lg:flex">
        <div className="flex h-16 items-center px-6 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#111111] text-[#FFFDF9]">
              <Layers className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-6">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link key={item.name} href={item.href}>
                <a
                  className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 font-medium transition-all ${
                    active
                      ? 'bg-[#FFFDF9] text-[#111111] ring-1 ring-[#E5E7EB]'
                      : 'text-[#6B7280] hover:bg-[#FFFDF9] hover:text-[#111111]'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? 'text-[#111111]' : 'text-[#6B7280]'}`} />
                  {item.name}
                  {active && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[#2EE6A6]"></div>
                  )}
                </a>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#E5E7EB] p-4">
          <div className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-[#FFFDF9]">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2EE6A6] text-[#111111] font-semibold">
              {profile?.displayName?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1 overflow-hidden text-left">
              <p className="truncate font-medium text-[#111111]">{profile?.displayName || 'Admin'}</p>
              <p className="truncate text-xs text-[#6B7280]">{profile?.email}</p>
            </div>
            <button
              onClick={() => signOut({ redirectUrl: '/' })}
              className="text-[#6B7280] hover:text-red-600 transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto scroll-smooth">
        <div className="flex h-16 items-center justify-between border-b border-[#E5E7EB] bg-white px-4 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[#111111]"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="font-semibold text-[#111111]">Admin Panel</span>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2EE6A6] text-[#111111] font-semibold">
              {profile?.displayName?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-[#E5E7EB] p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.name} href={item.href}>
                  <a
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium ${
                      active
                        ? 'bg-[#FFFDF9] text-[#111111] ring-1 ring-[#E5E7EB]'
                        : 'text-[#6B7280]'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </a>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mx-auto max-w-7xl px-6 py-8 pb-32">
          {children}
        </div>
      </main>
    </div>
  );
}