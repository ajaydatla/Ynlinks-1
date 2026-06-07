import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

export const trackVisit = mutation({
  args: {
    userId: v.string(),
    ipAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('bioVisits', {
      userId: args.userId,
      ipAddress: args.ipAddress,
      earnings: 0,
      visitedAt: new Date().toISOString(),
    });

    await ctx.db.insert('analytics', {
      userId: args.userId,
      ipAddress: args.ipAddress,
      timestamp: new Date().toISOString(),
    });

    return { success: true };
  },
});

export const trackClick = mutation({
  args: {
    linkId: v.id('links'),
    userId: v.string(),
    ipAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const link = await ctx.db.get(args.linkId);
    if (!link) throw new Error('Link not found');

    await ctx.db.insert('linkClicks', {
      linkId: args.linkId,
      userId: args.userId,
      ipAddress: args.ipAddress,
      earnings: 0.10,
      clickedAt: new Date().toISOString(),
    });

    const newClicks = (link.clicks || 0) + 1;
    await ctx.db.patch(args.linkId, { clicks: newClicks });

    return { success: true, clicks: newClicks };
  },
});

export const getUserVisitAnalytics = query({
  args: {
    userId: v.string(),
    daysBack: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.daysBack || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const visits = await ctx.db
      .query('bioVisits')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .collect();

    const filteredVisits = visits.filter(v => {
      if (!v.visitedAt) return false;
      return new Date(v.visitedAt) >= startDate;
    });

    const dailyVisits: Record<string, number> = {};
    filteredVisits.forEach(visit => {
      if (visit.visitedAt) {
        const date = visit.visitedAt.split('T')[0];
        dailyVisits[date] = (dailyVisits[date] || 0) + 1;
      }
    });

    return Object.entries(dailyVisits)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  },
});

export const getUserClickAnalytics = query({
  args: {
    userId: v.string(),
    daysBack: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.daysBack || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const clicks = await ctx.db
      .query('linkClicks')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .collect();

    const filteredClicks = clicks.filter(c => {
      if (!c.clickedAt) return false;
      return new Date(c.clickedAt) >= startDate;
    });

    const dailyClicks: Record<string, number> = {};
    filteredClicks.forEach(click => {
      if (click.clickedAt) {
        const date = click.clickedAt.split('T')[0];
        dailyClicks[date] = (dailyClicks[date] || 0) + 1;
      }
    });

    return Object.entries(dailyClicks)
      .map(([date, count]) => ({ date, click_count: count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  },
});

export const getTotalVisitCount = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const visits = await ctx.db
      .query('bioVisits')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .collect();

    return visits.length;
  },
});

export const getTotalClickCount = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const clicks = await ctx.db
      .query('linkClicks')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .collect();

    return clicks.length;
  },
});

export const getTodayVisitCount = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const visits = await ctx.db
      .query('bioVisits')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .collect();

    return visits.filter(v => {
      if (!v.visitedAt) return false;
      return new Date(v.visitedAt) >= today;
    }).length;
  },
});

export const getTodayClickCount = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const clicks = await ctx.db
      .query('linkClicks')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .collect();

    return clicks.filter(c => {
      if (!c.clickedAt) return false;
      return new Date(c.clickedAt) >= today;
    }).length;
  },
});