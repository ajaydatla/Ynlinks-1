import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

export const getUserWithdrawals = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const withdrawals = await ctx.db
      .query('withdrawals')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .collect();

    return withdrawals.sort((a, b) => {
      const aTime = a.requestedAt || '';
      const bTime = b.requestedAt || '';
      return bTime.localeCompare(aTime);
    });
  },
});

export const requestWithdrawal = mutation({
  args: {
    userId: v.id('users'),
    amount: v.number(),
    method: v.string(),
    details: v.any(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error('User not found');

    const minWithdrawal = await ctx.db
      .query('settings')
      .withIndex('by_key', (q) => q.eq('key', 'min_withdrawal'))
      .first();

    const minAmount = minWithdrawal ? parseFloat(minWithdrawal.value) : 150;

    if (args.amount < minAmount) {
      throw new Error(`Minimum withdrawal amount is ₹${minAmount}`);
    }

    if ((user.balance || 0) < args.amount) {
      throw new Error('Insufficient balance');
    }

    await ctx.db.insert('withdrawals', {
      userId: args.userId,
      amount: args.amount,
      method: args.method,
      details: args.details,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    });

    await ctx.db.patch(args.userId, {
      balance: (user.balance || 0) - args.amount,
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

    return filtered.sort((a, b) => {
      const aTime = a.requestedAt || '';
      const bTime = b.requestedAt || '';
      return bTime.localeCompare(aTime);
    });
  },
});

export const approveWithdrawal = mutation({
  args: { withdrawalId: v.id('withdrawals') },
  handler: async (ctx, args) => {
    const withdrawal = await ctx.db.get(args.withdrawalId);
    if (!withdrawal) throw new Error('Withdrawal not found');

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

export const getPendingWithdrawalsCount = query({
  args: {},
  handler: async (ctx) => {
    const withdrawals = await ctx.db
      .query('withdrawals')
      .withIndex('by_status', (q) => q.eq('status', 'pending'))
      .collect();

    return withdrawals.length;
  },
});