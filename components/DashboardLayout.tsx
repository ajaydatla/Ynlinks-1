'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  Layers, LayoutDashboard, Link2, BarChart3, Wallet,
  User, HelpCircle, ChevronLeft, Menu, X, FileText, LogOut,
  Palette,
} from 'lucide-react';
import { TermsModal } from '@/components/TermsModal';

interface DashboardLayoutProps {
  children: ReactNode;
}

type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const profile = useQuery(api.users.getUserByClerkId, { clerkId: user?.id || '' });

  // Listen for terms event
  useEffect(() => {
    const handleOpenTerms = () => setShowTerms(true);
    window.addEventListener('open-terms', handleOpenTerms);
    return () => window.removeEventListener('open-terms', handleOpenTerms);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Links', href: '/links', icon: Link2 },
    { name: 'Design', href: '/design', icon: Palette },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Withdrawals', href: '/withdrawals', icon: Wallet },
    { name: 'Settings', href: '/settings', icon: User },
  ];

  const isActive = (href: string) => pathname === href;

  const displayName = profile?.displayName || user?.fullName || 'User';
  const username = profile?.username || user?.username || 'user';
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const balance = (profile?.balance || profile?.earnings || 0).toFixed(2);

  // ── Renders a single flat nav link ──
  const renderLink = (item: NavItem) => {
    const active = isActive(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        title={collapsed ? item.name : undefined}
        className={`
          flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
          transition-all duration-150 group
          ${collapsed ? 'justify-center' : ''}
          ${active
            ? 'bg-[#2EE6A6]/10 text-[#111111]'
            : 'text-gray-500 hover:bg-gray-100 hover:text-[#111111]'
          }
        `}
      >
        <item.icon
          size={19}
          className={`flex-shrink-0 transition-colors ${active ? 'text-[#2EE6A6]' : 'text-gray-400 group-hover:text-gray-600'}`}
        />
        {!collapsed && <span className="truncate">{item.name}</span>}
        {active && !collapsed && (
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#2EE6A6]" />
        )}
      </Link>
    );
  };

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#111111] border-t-[#2EE6A6] rounded-full animate-spin" />
          <p className="text-sm text-gray-400 tracking-wide">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    router.push('/sign-in');
    return null;
  }

  // Banned
  if (profile?.status === 'banned') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-10 max-w-sm w-full text-center shadow-sm">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <X size={24} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-[#111111] mb-2">Account Suspended</h2>
          <p className="text-sm text-gray-500">Your account has been suspended. Contact support for more information.</p>
        </div>
      </div>
    );
  }

  // Paused
  if (profile?.status === 'paused') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-10 max-w-sm w-full text-center shadow-sm">
          <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <span className="text-2xl">⏸</span>
          </div>
          <h2 className="text-xl font-bold text-[#111111] mb-2">Account Paused</h2>
          <p className="text-sm text-gray-500">Your account is currently paused. Contact support to reactivate it.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />

      {/* Root layout: sidebar + main */}
      <div className="flex h-screen overflow-hidden bg-[#F7F8FA]">

        {/* ── Mobile overlay ── */}
        {mobileOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/40 z-30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* ══════════════ SIDEBAR ══════════════ */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-40
            flex flex-col bg-white border-r border-gray-200
            transition-all duration-300 ease-in-out
            ${collapsed ? 'w-[72px]' : 'w-64'}
            ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Logo row */}
          <div className={`flex items-center border-b border-gray-100 h-16 px-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
            {!collapsed && (
              <Link href="/dashboard" className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#111111] rounded-lg flex items-center justify-center">
                  <Layers size={17} className="text-[#2EE6A6]" />
                </div>
                <span className="font-extrabold text-lg text-[#111111] tracking-tight">YNLinks</span>
              </Link>
            )}

            {/* Collapse toggle — desktop */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
              title={collapsed ? 'Expand' : 'Collapse'}
            >
              <ChevronLeft
                size={18}
                className={`text-gray-400 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Close — mobile */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
            {navigation.map((item) => renderLink(item))}
          </nav>

          {/* Profile card at bottom of sidebar */}
          {!collapsed && (
            <div className="p-3 border-t border-gray-100">
              <div className="bg-gradient-to-br from-[#2EE6A6]/10 to-[#2EE6A6]/5 rounded-xl p-3">
                <div className="flex items-center gap-3 mb-2.5">
                  {profile?.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={displayName}
                      className="w-9 h-9 rounded-full object-cover border-2 border-[#2EE6A6]/40 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#111111] flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-[#2EE6A6]">{avatarLetter}</span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#111111] truncate leading-tight">{displayName}</p>
                    <p className="text-xs text-gray-400 truncate">@{username}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-white/60 rounded-lg px-3 py-1.5">
                  <span className="text-xs text-gray-500 font-medium">Balance</span>
                  <span className="text-sm font-bold text-[#111111]">₹{balance}</span>
                </div>
              </div>
            </div>
          )}

          {/* Collapsed avatar */}
          {collapsed && (
            <div className="p-3 border-t border-gray-100 flex justify-center">
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={displayName}
                  className="w-9 h-9 rounded-full object-cover border-2 border-[#2EE6A6]/40"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#111111] flex items-center justify-center">
                  <span className="text-sm font-bold text-[#2EE6A6]">{avatarLetter}</span>
                </div>
              )}
            </div>
          )}
        </aside>

        {/* ══════════════ MAIN AREA ══════════════ */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* ── Top header ── */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Menu size={20} className="text-[#111111]" />
            </button>

            {/* Page title / breadcrumb slot — empty on desktop, spacer on mobile */}
            <div className="hidden lg:block" />

            {/* Right side: user menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 pl-3 py-1.5 pr-1.5 rounded-xl hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
              >
                {/* Name + username — hidden on small screens */}
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-[#111111] leading-tight truncate max-w-[130px]">{displayName}</p>
                  <p className="text-xs text-gray-400 truncate max-w-[130px]">@{username}</p>
                </div>

                {/* Avatar */}
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={displayName}
                    className="w-9 h-9 rounded-full object-cover border-2 border-[#2EE6A6]/50 flex-shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#111111] flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-[#2EE6A6]">{avatarLetter}</span>
                  </div>
                )}
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1.5 overflow-hidden">
                  {/* User info header */}
                  <div className="px-4 py-2.5 border-b border-gray-100 mb-1">
                    <p className="text-sm font-semibold text-[#111111] truncate">{displayName}</p>
                    <p className="text-xs text-gray-400 truncate">@{username}</p>
                  </div>

                  <button
                    onClick={() => { setShowTerms(true); setDropdownOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FileText size={15} className="text-gray-400" />
                    Terms & Conditions
                  </button>

                  <button
                    onClick={() => { window.open('https://t.me/ynlinks', '_blank'); setDropdownOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <HelpCircle size={15} className="text-gray-400" />
                    Help & Support
                  </button>

                  <div className="my-1 border-t border-gray-100" />

                  <button
                    onClick={() => signOut({ redirectUrl: '/' })}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} className="text-red-400" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* ── Page content ── */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}