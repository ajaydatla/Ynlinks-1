"use client";

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { LayoutDashboard, Users, Link2, DollarSign, Clock, MousePointerClick } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { user, isLoaded } = useUser();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLinks: 0,
    totalEarnings: 0,
    pendingWithdrawals: 0,
    totalClicks: 0,
    totalVisits: 0,
  });

  const profile = useQuery(api.users.getUserByClerkId, { clerkId: user?.id || '' });
  const dashboardStats = useQuery(api.admin.getDashboardStats, {});

  useEffect(() => {
    if (dashboardStats) {
      setStats({
        totalUsers: dashboardStats.totalUsers || 0,
        totalLinks: dashboardStats.totalLinks || 0,
        totalEarnings: dashboardStats.totalEarnings || 0,
        pendingWithdrawals: dashboardStats.pendingWithdrawals || 0,
        totalClicks: dashboardStats.totalClicks || 0,
        totalVisits: dashboardStats.totalVisits || 0,
      });
    }
  }, [dashboardStats]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2EE6A6]"></div>
      </div>
    );
  }

  if (!profile?.isAdmin) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
        <p className="text-gray-600">You do not have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-[#111111] mb-2">Admin Dashboard</h1>
        <p className="text-[#6B7280]">Overview of the YNLinks platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-[#6B7280]">Total Users</span>
          </div>
          <p className="text-3xl font-bold text-[#111111]">{stats.totalUsers}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#2EE6A6]/20 rounded-xl flex items-center justify-center">
              <Link2 className="w-5 h-5 text-[#2EE6A6]" />
            </div>
            <span className="text-sm font-medium text-[#6B7280]">Total Links</span>
          </div>
          <p className="text-3xl font-bold text-[#111111]">{stats.totalLinks}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-[#6B7280]">Total Earnings</span>
          </div>
          <p className="text-3xl font-bold text-[#111111]">₹{stats.totalEarnings.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-sm font-medium text-[#6B7280]">Pending Withdrawals</span>
          </div>
          <p className="text-3xl font-bold text-[#111111]">{stats.pendingWithdrawals}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <MousePointerClick className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-[#6B7280]">Total Clicks</span>
          </div>
          <p className="text-3xl font-bold text-[#111111]">{stats.totalClicks}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-cyan-600" />
            </div>
            <span className="text-sm font-medium text-[#6B7280]">Total Visits</span>
          </div>
          <p className="text-3xl font-bold text-[#111111]">{stats.totalVisits}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#111111] mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/admin/users" className="block p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
              <Users className="w-5 h-5 text-[#6B7280] mb-2" />
              <span className="font-semibold text-[#111111]">Manage Users</span>
            </Link>
            <Link href="/admin/withdrawals" className="block p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
              <Clock className="w-5 h-5 text-[#6B7280] mb-2" />
              <span className="font-semibold text-[#111111]">Review Withdrawals</span>
              {stats.pendingWithdrawals > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                  {stats.pendingWithdrawals} pending
                </span>
              )}
            </Link>
            <Link href="/admin/settings" className="block p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
              <DollarSign className="w-5 h-5 text-[#6B7280] mb-2" />
              <span className="font-semibold text-[#111111]">Platform Settings</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#111111] mb-4">Platform Health</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280]">Total Users</span>
              <span className="font-semibold text-[#111111]">{stats.totalUsers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280]">Active Links</span>
              <span className="font-semibold text-[#111111]">{stats.totalLinks}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280]">Total Earnings</span>
              <span className="font-semibold text-[#2EE6A6]">₹{stats.totalEarnings.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280]">Click-through Rate</span>
              <span className="font-semibold text-[#111111]">
                {stats.totalVisits > 0 ? ((stats.totalClicks / stats.totalVisits) * 100).toFixed(2) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}