'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { MousePointerClick, Calendar, TrendingUp, TrendingDown, BarChart3, DollarSign } from 'lucide-react';

interface DailyClick {
  date: string;
  click_count: number;
}

export default function AnalyticsPage() {
  const { user, isLoaded } = useUser();
  const EARNING_PER_CLICK = 0.1;
  const [analytics, setAnalytics] = useState<DailyClick[]>([]);
  const [loading, setLoading] = useState(true);
  const [daysBack, setDaysBack] = useState(30);
  const [totalClicks, setTotalClicks] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [chartMode, setChartMode] = useState<'line' | 'area'>('line');

  const profile = useQuery(api.users.getUserByClerkId, { clerkId: user?.id || '' });
  const clickAnalytics = useQuery(api.analytics.getUserClickAnalytics, {
    userId: profile?._id || '',
    daysBack,
  });

  useEffect(() => {
    if (clickAnalytics) {
      setAnalytics(clickAnalytics);
      const total = clickAnalytics.reduce((sum, day) => sum + Number(day.click_count), 0);
      setTotalClicks(total);
      setTotalEarnings(total * EARNING_PER_CLICK);
    }
    setLoading(false);
  }, [clickAnalytics]);

  const getChangePercentage = () => {
    if (analytics.length < 2) return 0;
    const today = Number(analytics[0]?.click_count || 0);
    const yesterday = Number(analytics[1]?.click_count || 0);
    if (yesterday === 0) return today > 0 ? 100 : 0;
    return ((today - yesterday) / yesterday) * 100;
  };

  const changePercentage = getChangePercentage();
  const isPositive = changePercentage >= 0;

  const getMaxClicks = () => {
    if (analytics.length === 0) return 100;
    return Math.max(...analytics.map(d => Number(d.click_count)));
  };

  const maxClicks = getMaxClicks();
  const chartData = [...analytics].reverse().slice(-12);
  const chartMax = chartData.length > 0 ? Math.max(...chartData.map((d) => Number(d.click_count))) : 0;
  const averagePerDay = analytics.length > 0 ? totalClicks / analytics.length : 0;

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2EE6A6]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[#2EE6A6] to-[#1FD695] rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#111111]">Click Analytics</h1>
            <p className="text-sm text-[#6B7280]">Track your link performance over time</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6 mb-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-[#6B7280] text-sm">
              <MousePointerClick size={16} />
              <span>Total Clicks</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#2EE6A6]/10 text-[#2EE6A6] font-medium">
              Last {daysBack}d
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#111111]">{totalClicks.toLocaleString()}</p>
          <p className="text-[11px] sm:text-xs text-[#6B7280] mt-1">Avg {averagePerDay.toFixed(1)} clicks/day</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-all">
          <div className="flex items-center gap-2 text-[#6B7280] text-sm mb-2">
            <Calendar size={16} />
            <span>Today's Clicks</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#111111]">
            {analytics[0] ? Number(analytics[0].click_count).toLocaleString() : 0}
          </p>
          <div className={`flex items-center gap-1 text-[11px] sm:text-xs mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{Math.abs(changePercentage).toFixed(1)}% vs yesterday</span>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-all">
          <div className="flex items-center gap-2 text-[#6B7280] text-sm mb-2">
            <BarChart3 size={16} />
            <span>Best Day</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#111111]">{maxClicks.toLocaleString()}</p>
          <p className="text-[11px] sm:text-xs text-[#6B7280] mt-1">Peak clicks on your highest day</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-all">
          <div className="flex items-center gap-2 text-[#6B7280] text-sm mb-2">
            <DollarSign size={16} />
            <span>Est. Earnings</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#111111]">₹{totalEarnings.toFixed(2)}</p>
          <p className="text-[11px] sm:text-xs text-[#6B7280] mt-1">Based on ₹{EARNING_PER_CLICK.toFixed(2)} per click</p>
        </div>
      </div>

      {/* Clicks trend + distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-[#111111]">Clicks Trend</h2>
              <p className="text-xs sm:text-sm text-[#6B7280]">How your total clicks are evolving over the selected period</p>
            </div>
            <div className="inline-flex items-center gap-2 bg-gray-50 rounded-full p-1 text-[11px] sm:text-xs">
              <span className="px-2 py-1 text-[#6B7280]">Last {daysBack} days</span>
              <button
                onClick={() => setChartMode('line')}
                className={`px-2.5 py-1 rounded-full font-medium ${chartMode === 'line' ? 'bg-[#2EE6A6] text-white' : 'text-gray-600 hover:text-[#111111]'}`}
              >
                Line
              </button>
              <button
                onClick={() => setChartMode('area')}
                className={`px-2.5 py-1 rounded-full font-medium ${chartMode === 'area' ? 'bg-[#2EE6A6] text-white' : 'text-gray-600 hover:text-[#111111]'}`}
              >
                Area
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2EE6A6]"></div>
            </div>
          ) : chartData.length === 0 ? (
            <div className="py-10 text-center text-sm text-[#6B7280]">
              No click data yet to visualize. Share your links to start building a trend.
            </div>
          ) : (
            <div className="w-full h-52 sm:h-64">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {[20, 40, 60, 80].map((y) => (
                  <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#E5E7EB" strokeWidth="0.4" strokeDasharray="1.5 2" />
                ))}

                {chartData.length > 1 && (
                  <>
                    {chartMode === 'area' && (
                      <polygon
                        fill="url(#areaGradient)"
                        points={`0,100 ${chartData.map((d, index) => {
                          const x = chartData.length === 1 ? 50 : (index / (chartData.length - 1)) * 100;
                          const value = Number(d.click_count);
                          const ratio = chartMax > 0 ? value / chartMax : 0;
                          const y = 85 - ratio * 60;
                          return `${x},${y}`;
                        }).join(' ')} 100,100`}
                      />
                    )}

                    <defs>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#22C55E" />
                        <stop offset="100%" stopColor="#16A34A" />
                      </linearGradient>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#BBF7D0" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#DCFCE7" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>

                    <polyline
                      fill="none"
                      stroke="url(#lineGradient)"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      points={chartData.map((d, index) => {
                        const x = chartData.length === 1 ? 50 : (index / (chartData.length - 1)) * 100;
                        const value = Number(d.click_count);
                        const ratio = chartMax > 0 ? value / chartMax : 0;
                        const y = 85 - ratio * 60;
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                  </>
                )}

                {chartData.map((d, index) => {
                  const x = chartData.length === 1 ? 50 : (index / (chartData.length - 1)) * 100;
                  const value = Number(d.click_count);
                  const ratio = chartMax > 0 ? value / chartMax : 0;
                  const y = 85 - ratio * 60;
                  return (
                    <circle key={d.date} cx={x} cy={y} r="1.5" fill="#22C55E" stroke="#ffffff" strokeWidth="0.6" />
                  );
                })}
              </svg>
              <div className="mt-2 flex justify-between text-[9px] sm:text-[10px] text-[#6B7280]">
                {chartData.map((d, index) => {
                  const date = new Date(d.date);
                  const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  const showLabel = index === 0 || index === chartData.length - 1 || (chartData.length > 6 && index % 2 === 0);
                  return (
                    <span key={d.date} className="flex-1 text-center">{showLabel ? label : ''}</span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#111111] mb-2">Clicks Distribution</h2>
          <p className="text-xs sm:text-sm text-[#6B7280] mb-4">How clicks are spread across the selected period</p>

          {loading || analytics.length === 0 ? (
            <div className="text-xs text-[#6B7280] py-6 text-center">Not enough data yet to calculate distribution.</div>
          ) : (
            <div className="space-y-2">
              {analytics.slice(0, 5).map((day, index) => {
                const value = Number(day.click_count);
                const ratio = totalClicks > 0 ? (value / totalClicks) * 100 : 0;
                const date = new Date(day.date);
                const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                const colors = ['bg-[#2EE6A6]', 'bg-blue-500', 'bg-amber-400', 'bg-purple-500', 'bg-rose-500'];
                const color = colors[index % colors.length];

                return (
                  <div key={day.date} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                      <span className="text-xs sm:text-sm text-[#111111]">{label}</span>
                    </div>
                    <div className="flex-1 mx-2 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.max(ratio, 5)}%` }} />
                    </div>
                    <span className="text-[11px] sm:text-xs text-[#6B7280]">{value.toLocaleString()} ({ratio.toFixed(1)}%)</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-[#111111]">Daily Breakdown</h2>
          <div className="flex gap-2 flex-wrap">
            {[7, 14, 30, 60, 90].map((days) => (
              <button
                key={days}
                onClick={() => setDaysBack(days)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${daysBack === days ? 'bg-[#2EE6A6] text-white shadow-md' : 'bg-gray-100 text-[#6B7280] hover:bg-gray-200'}`}
              >
                {days}d
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2EE6A6]"></div>
          </div>
        ) : analytics.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-[#6B7280] font-medium mb-2">No click data yet</p>
            <p className="text-sm text-[#6B7280]">Share your links to start tracking clicks</p>
          </div>
        ) : (
          <div className="space-y-3">
            {analytics.map((day) => {
              const clickCount = Number(day.click_count);
              const percentage = maxClicks > 0 ? (clickCount / maxClicks) * 100 : 0;
              const date = new Date(day.date);
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <div key={day.date} className="group hover:bg-gray-50 p-3 rounded-lg transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${isToday ? 'text-[#2EE6A6]' : 'text-[#111111]'}`}>
                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      {isToday && (
                        <span className="text-xs bg-[#2EE6A6]/10 text-[#2EE6A6] px-2 py-0.5 rounded-full font-medium">Today</span>
                      )}
                      <span className="text-xs text-[#6B7280]">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    </div>
                    <span className="text-sm font-semibold text-[#111111]">
                      {clickCount.toLocaleString()} {clickCount === 1 ? 'click' : 'clicks'}
                    </span>
                  </div>
                  <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#2EE6A6] to-[#1FD695] rounded-full transition-all duration-500 ease-out" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <MousePointerClick className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900 mb-1">About Click Tracking</p>
            <p className="text-xs text-blue-700 leading-relaxed">
              Each unique visitor is counted once per 24 hours per link. This ensures accurate analytics and prevents duplicate counting from the same visitor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}