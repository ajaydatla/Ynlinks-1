import { v } from 'convex/values';
import { query } from './_generated/server';

export const getUserEarnings = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.query('users').collect();
    const foundUser = user.find(u => u.clerkId === args.userId);

    if (!foundUser) return { balance: 0, earnings: 0 };

    const linkClicks = await ctx.db
      .query('linkClicks')
      .withIndex('by_user_id', (q) => q.eq('userId', foundUser._id))
      .collect();

    const bioVisits = await ctx.db
      .query('bioVisits')
      .withIndex('by_user_id', (q) => q.eq('userId', foundUser._id))
      .collect();

    const clickEarnings = linkClicks.reduce((sum, c) => sum + (c.earnings || 0.10), 0);
    const visitEarnings = bioVisits.reduce((sum, v) => sum + (v.earnings || 0.15), 0);

    return {
      balance: foundUser.balance || 0,
      earnings: clickEarnings + visitEarnings,
      totalClicks: linkClicks.length,
      totalVisits: bioVisits.length,
    };
  },
});

export const getEarningsAnalytics = query({
  args: {
    userId: v.string(),
    daysBack: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.daysBack || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const user = await ctx.db.query('users').collect();
    const foundUser = user.find(u => u.clerkId === args.userId);

    if (!foundUser) return { dailyEarnings: [], totalEarnings: 0 };

    const linkClicks = await ctx.db
      .query('linkClicks')
      .withIndex('by_user_id', (q) => q.eq('userId', foundUser._id))
      .collect();

    const dailyEarnings: Record<string, number> = {};

    linkClicks.forEach(click => {
      if (!click.clickedAt) return;
      if (new Date(click.clickedAt) < startDate) return;

      const date = click.clickedAt.split('T')[0];
      dailyEarnings[date] = (dailyEarnings[date] || 0) + (click.earnings || 0.10);
    });

    const totalEarnings = linkClicks.reduce((sum, c) => sum + (c.earnings || 0.10), 0);

    return {
      dailyEarnings: Object.entries(dailyEarnings)
        .map(([date, earnings]) => ({ date, earnings }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      totalEarnings,
    };
  },
});

export const getTopEarningUsers = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const users = await ctx.db.query('users').collect();
    const topUsers = users
      .sort((a, b) => (b.balance || 0) - (a.balance || 0))
      .slice(0, args.limit || 10);

    return topUsers.map(u => ({
      id: u._id,
      username: u.username,
      displayName: u.displayName,
      avatarUrl: u.avatarUrl,
      balance: u.balance || 0,
    }));
  },
});