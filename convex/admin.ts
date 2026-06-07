import { v } from 'convex/values';
import type { Id } from 'convex';
import { query, mutation } from './_generated/server';

export const getAllUsers = query({
  args: { statusFilter: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const users = await ctx.db.query('users').collect();

    let filtered = users;
    if (args.statusFilter) {
      filtered = users.filter(u => u.status === args.statusFilter);
    }

    return filtered.sort((a, b) => {
      const aTime = a.createdAt || '';
      const bTime = b.createdAt || '';
      return bTime.localeCompare(aTime);
    });
  },
});

export const updateUser = mutation({
  args: {
    userId: v.id('users'),
    updates: v.object({
      displayName: v.optional(v.string()),
      bio: v.optional(v.string()),
      avatarUrl: v.optional(v.string()),
      phone: v.optional(v.string()),
      niche: v.optional(v.string()),
      theme: v.optional(v.string()),
      isAdmin: v.optional(v.boolean()),
      status: v.optional(v.string()),
      balance: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, args.updates);
    return { success: true };
  },
});

export const addBonus = mutation({
  args: {
    userId: v.id('users'),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error('User not found');

    const newBalance = (user.balance || 0) + args.amount;
    await ctx.db.patch(args.userId, { balance: newBalance });

    await ctx.db.insert('notifications', {
      userId: args.userId,
      message: `You received a bonus of ₹${args.amount.toFixed(2)}!`,
      read: false,
      createdAt: new Date().toISOString(),
    });

    return { success: true };
  },
});

export const getAllWithdrawals = query({
  args: { statusFilter: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const withdrawals = await ctx.db.query('withdrawals').collect();

    let filtered = withdrawals;
    if (args.statusFilter) {
      filtered = withdrawals.filter(w => w.status === args.statusFilter);
    }

    const withdrawalsWithUsers = await Promise.all(
      filtered.map(async w => {
        const user = await ctx.db.get(w.userId);
        return {
          ...w,
          user: user ? {
            username: user.username,
            displayName: user.displayName,
            email: user.email,
          } : null,
        };
      })
    );

    return withdrawalsWithUsers.sort((a, b) => {
      const aTime = a.requestedAt || '';
      const bTime = b.requestedAt || '';
      return bTime.localeCompare(aTime);
    });
  },
});

export const approveWithdrawal = mutation({
  args: { withdrawalId: v.id('withdrawals') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.withdrawalId, {
      status: 'approved',
      processedAt: new Date().toISOString(),
    });
    return { success: true };
  },
});

export const rejectWithdrawal = mutation({
  args: { withdrawalId: v.id('withdrawals') },
  handler: async (ctx, args) => {
    const withdrawal = await ctx.db.get(args.withdrawalId);
    if (!withdrawal) throw new Error('Withdrawal not found');

    const user = await ctx.db.get(withdrawal.userId);
    if (user) {
      await ctx.db.patch(withdrawal.userId, {
        balance: (user.balance || 0) + withdrawal.amount,
      });
    }

    await ctx.db.patch(args.withdrawalId, {
      status: 'rejected',
      processedAt: new Date().toISOString(),
    });

    return { success: true };
  },
});

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query('users').collect();
    const links = await ctx.db.query('links').collect();
    const withdrawals = await ctx.db.query('withdrawals').collect();
    const linkClicks = await ctx.db.query('linkClicks').collect();
    const bioVisits = await ctx.db.query('bioVisits').collect();

    const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');
    const totalEarnings = users.reduce((sum, u) => sum + (u.balance || 0), 0);

    return {
      totalUsers: users.length,
      totalLinks: links.length,
      pendingWithdrawals: pendingWithdrawals.length,
      totalEarnings,
      totalClicks: linkClicks.length,
      totalVisits: bioVisits.length,
    };
  },
});

export const getAdvertiserInquiries = query({
  args: {},
  handler: async (ctx) => {
    const inquiries = await ctx.db.query('advertiserInquiries').collect();
    return inquiries.sort((a, b) => {
      const aTime = a.createdAt || '';
      const bTime = b.createdAt || '';
      return bTime.localeCompare(aTime);
    });
  },
});

export const createAdvertiserInquiry = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const inquiryId = await ctx.db.insert('advertiserInquiries', {
      name: args.name,
      email: args.email,
      message: args.message,
      status: 'new',
      createdAt: new Date().toISOString(),
    });
    return inquiryId;
  },
});

export const updateAdvertiserInquiryStatus = mutation({
  args: {
    inquiryId: v.id('advertiserInquiries'),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.inquiryId, { status: args.status });
    return { success: true };
  },
});

export const getClickAnalytics = query({
  args: { daysBack: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const days = args.daysBack || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const clicks = await ctx.db.query('linkClicks').collect();

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
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  },
});

export const getNiches = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('niches').collect();
  },
});

export const createNiche = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    customDomain: v.optional(v.string()),
    adCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const nicheId = await ctx.db.insert('niches', {
      name: args.name,
      slug: args.slug,
      customDomain: args.customDomain,
      adCode: args.adCode,
    });
    return nicheId;
  },
});

export const updateNiche = mutation({
  args: {
    nicheId: v.id('niches'),
    updates: v.object({
      name: v.optional(v.string()),
      customDomain: v.optional(v.string()),
      adCode: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.nicheId, args.updates);
    return { success: true };
  },
});

export const getSettings = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('settings').collect();
  },
});

export const getSettingByKey = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const setting = await ctx.db
      .query('settings')
      .withIndex('by_key', (q) => q.eq('key', args.key))
      .first();
    return setting;
  },
});

export const updateSetting = mutation({
  args: {
    key: v.string(),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('settings')
      .withIndex('by_key', (q) => q.eq('key', args.key))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { value: args.value });
    } else {
      await ctx.db.insert('settings', { key: args.key, value: args.value });
    }

    return { success: true };
  },
});

export const getTopCreators = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const users = await ctx.db.query('users').collect();
    const links = await ctx.db.query('links').collect();
    const clicks = await ctx.db.query('linkClicks').collect();

    const topCreators = users
      .filter(u => u.role !== 'admin')
      .map(user => {
        const userLinks = links.filter(l => l.userId === user._id);
        const userClicks = clicks.filter(c => c.userId === user._id);
        return {
          id: user._id,
          username: user.username,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
          balance: user.balance || 0,
          totalClicks: userClicks.length,
          totalLinks: userLinks.length,
        };
      })
      .sort((a, b) => b.balance - a.balance)
      .slice(0, args.limit || 10);

    return topCreators;
  },
});