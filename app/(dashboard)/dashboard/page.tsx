'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { DollarSign, MousePointerClick, Link2, ArrowUpRight, ArrowRight, Eye } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();

  const profile = useQuery(api.users.getUserByClerkId, { clerkId: user?.id || '' });
  const links = useQuery(api.links.getLinksByUser, { userId: profile?._id || '' });
  const totalVisits = useQuery(api.analytics.getTotalVisitCount, { userId: profile?._id || '' });
  const totalClicks = useQuery(api.analytics.getTotalClickCount, { userId: profile?._id || '' });
  const todayVisits = useQuery(api.analytics.getTodayVisitCount, { userId: profile?._id || '' });
  const todayClicks = useQuery(api.analytics.getTodayClickCount, { userId: profile?._id || '' });
  const minWithdrawalSetting = useQuery(api.admin.getSettingByKey, { key: 'min_withdrawal' });

  const minWithdrawal = minWithdrawalSetting?.value ? parseFloat(minWithdrawalSetting.value) : 150;
  const earnings = profile?.balance || profile?.earnings || 0;
  const clickRate = 0.10;
  const activeLinks = links?.filter(l => l.enabled).length || 0;
  const totalLinkClicks = totalClicks || 0;

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2EE6A6]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-[#111111] mb-1.5">Dashboard</h1>
        <p className="text-sm md:text-base text-gray-500">Monitor your performance and earnings at a glance</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#2EE6A6]/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#2EE6A6]" />
            </div>
            <span className="text-sm font-medium text-gray-600">Total Earnings</span>
          </div>
          <p className="text-2xl md:text-3xl font-display font-bold text-[#111111]">₹{earnings.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">
            {earnings >= minWithdrawal ? 'Ready to withdraw!' : `₹${(minWithdrawal - earnings).toFixed(2)} to minimum`}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Bio Page Visits</span>
          </div>
          <p className="text-2xl md:text-3xl font-display font-bold text-[#111111]">{(totalVisits || 0).toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Tracked for analytics</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#111111] rounded-xl flex items-center justify-center">
              <MousePointerClick className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-600">Link Clicks</span>
          </div>
          <p className="text-2xl md:text-3xl font-display font-bold text-[#111111]">{totalLinkClicks.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">₹{(totalLinkClicks * clickRate).toFixed(2)} earned</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#2EE6A6]/20 rounded-xl flex items-center justify-center">
              <Link2 className="w-5 h-5 text-[#2EE6A6]" />
            </div>
            <span className="text-sm font-medium text-gray-600">Active Links</span>
          </div>
          <p className="text-2xl md:text-3xl font-display font-bold text-[#111111]">{activeLinks}</p>
          <p className="text-xs text-gray-500 mt-1">Published links</p>
        </div>
      </div>

      {/* Withdrawal CTA */}
      {earnings >= minWithdrawal && (
        <div className="bg-gradient-to-r from-[#2EE6A6]/10 via-[#2EE6A6]/8 to-[#2EE6A6]/10 border border-[#2EE6A6]/30 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#2EE6A6] rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <DollarSign className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-display font-bold text-[#111111] leading-tight">You can withdraw now!</h3>
                </div>
              </div>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                You have <span className="font-bold text-[#2EE6A6]">₹{earnings.toFixed(2)}</span> available for withdrawal.
              </p>
            </div>
            <Link
              href="/withdrawals"
              className="w-full sm:w-auto shrink-0 bg-[#2EE6A6] text-[#111111] px-6 md:px-8 py-3 md:py-3.5 rounded-xl hover:bg-[#1FD695] transition-all font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm md:text-base"
            >
              Withdraw Now
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      )}

      {/* Performance Overview */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg md:text-xl font-display font-bold text-[#111111] leading-tight mb-1.5">Performance Overview</h2>
          <p className="text-sm text-gray-500">Comprehensive view of visits, clicks and earnings</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 md:p-5">
            <p className="text-xs md:text-sm text-gray-500 mb-2 font-medium">Total Bio Visits</p>
            <p className="text-2xl md:text-3xl font-display font-bold text-[#111111] mb-1.5">{(totalVisits || 0).toLocaleString()}</p>
            <p className="text-xs text-emerald-600 font-medium">Live tracking enabled</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 md:p-5">
            <p className="text-xs md:text-sm text-gray-500 mb-2 font-medium">Total Link Clicks</p>
            <p className="text-2xl md:text-3xl font-display font-bold text-[#111111] mb-1.5">{totalLinkClicks.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Est. earnings ₹{(totalLinkClicks * clickRate).toFixed(2)}</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 md:p-5">
            <p className="text-xs md:text-sm text-gray-500 mb-2 font-medium">Today</p>
            <p className="text-xs text-gray-500 mb-1.5">Visits · Clicks</p>
            <p className="text-xl md:text-2xl font-display font-bold text-[#111111]">{(todayVisits || 0).toLocaleString()} · {(todayClicks || 0).toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1.5">Updated in real time</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 md:p-5">
            <p className="text-xs md:text-sm text-gray-500 mb-2 font-medium">Active Links</p>
            <p className="text-2xl md:text-3xl font-display font-bold text-[#111111] mb-1.5">{activeLinks}</p>
            <p className="text-xs text-gray-500">Driving traffic to your offers</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-700">Engagement trend</p>
            <Link href="/analytics" className="text-xs text-[#2EE6A6] hover:text-[#1FD695] font-semibold flex items-center gap-1.5 transition-colors">
              View details
              <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="h-32 w-full rounded-xl bg-gradient-to-tr from-[#2EE6A6]/10 via-blue-50 to-purple-50 border border-gray-200 px-4 py-4 flex items-end gap-2">
            {[30, 55, 40, 70, 60, 85, 50, 90].map((height, index) => (
              <div
                key={index}
                className="flex-1 rounded-t-full bg-gradient-to-t from-[#2EE6A6] to-[#1FD695] transition-all hover:opacity-80"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Links */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg md:text-xl font-display font-bold text-[#111111] leading-tight mb-1.5">Top Performing Links</h2>
            <p className="text-sm text-gray-500">Your most clicked links</p>
          </div>
          <Link href="/links" className="text-sm text-[#2EE6A6] hover:text-[#1FD695] font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors">
            Manage
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {!links || links.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Link2 className="text-gray-400" size={32} />
            </div>
            <p className="text-gray-600 mb-5 text-sm md:text-base font-medium">No active links yet</p>
            <Link href="/links" className="bg-[#2EE6A6] text-[#111111] px-6 py-3 rounded-xl hover:bg-[#1FD695] transition-all inline-flex items-center gap-2 font-bold text-sm md:text-base shadow-md hover:shadow-lg">
              Add Your First Link
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {links.filter(l => l.enabled).sort((a, b) => b.clicks - a.clicks).slice(0, 5).map((link, index) => (
              <div
                key={link._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-[#2EE6A6]/50 hover:bg-[#2EE6A6]/5 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-600 group-hover:bg-[#2EE6A6]/10 group-hover:text-[#2EE6A6] transition-colors">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#111111] truncate text-sm md:text-base mb-0.5">{link.title}</p>
                    <p className="text-xs text-gray-500 truncate">{link.url}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-lg md:text-xl font-display font-bold text-[#111111]">{link.clicks?.toLocaleString() || 0}</p>
                  <p className="text-xs text-gray-500">clicks</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Boost Earnings CTA */}
      <div className="bg-gradient-to-br from-[#2EE6A6]/10 via-[#2EE6A6]/8 to-[#2EE6A6]/10 border border-[#2EE6A6]/30 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-6">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg md:text-xl font-display font-bold text-[#111111] mb-2 leading-tight">Boost Your Earnings</h3>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Share your bio page link to drive more clicks and earnings. You earn ₹0.10 per unique link click!
            </p>
          </div>
          <Link href="/links" className="w-full md:w-auto shrink-0 bg-[#2EE6A6] text-[#111111] px-6 md:px-8 py-3 md:py-3.5 rounded-xl hover:bg-[#1FD695] transition-all font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm md:text-base">
            Add More Links
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}