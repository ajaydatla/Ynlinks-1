'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { MousePointerClick, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const { user, isLoaded } = useUser();
  const [daysBack, setDaysBack] = useState(30);
  const [analytics, setAnalytics] = useState<{ date: string; count: number }[]>([]);

  const profile = useQuery(api.users.getUserByClerkId, { clerkId: user?.id || '' });
  const clickAnalytics = useQuery(api.admin.getClickAnalytics, { daysBack });

  useEffect(() => {
    if (clickAnalytics) {
      setAnalytics(clickAnalytics);
    }
  }, [clickAnalytics]);

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

  const totalClicks = analytics.reduce((sum, day) => sum + day.count, 0);
  const avgClicks = analytics.length > 0 ? totalClicks / analytics.length : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-[#111111] mb-2">Click Analytics</h1>
        <p className="text-[#6B7280]">Platform-wide click statistics</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[7, 14, 30, 60, 90].map((days) => (
          <button
            key={days}
            onClick={() => setDaysBack(days)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              daysBack === days ? 'bg-[#2EE6A6] text-white' : 'bg-gray-100 text-[#6B7280] hover:bg-gray-200'
            }`}
          >
            {days}d
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#111111] rounded-xl flex items-center justify-center">
              <MousePointerClick className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-[#6B7280]">Total Clicks</span>
          </div>
          <p className="text-3xl font-bold text-[#111111]">{totalClicks.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-[#6B7280]">Average per Day</span>
          </div>
          <p className="text-3xl font-bold text-[#111111]">{avgClicks.toFixed(1)}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#2EE6A6]/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#2EE6A6]" />
            </div>
            <span className="text-sm font-medium text-[#6B7280]">Days Tracked</span>
          </div>
          <p className="text-3xl font-bold text-[#111111]">{analytics.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#111111] mb-4">Daily Breakdown</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {analytics.map((day) => (
            <div key={day.date} className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-[#111111]">
                {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="font-semibold text-[#111111]">{day.count} clicks</span>
            </div>
          ))}
          {analytics.length === 0 && (
            <p className="text-center py-8 text-[#6B7280]">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
}