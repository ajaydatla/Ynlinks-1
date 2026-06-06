import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

export const getUserByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_username', (q) => q.eq('username', args.username))
      .first();

    if (!user) return null;

    // Hide placeholder / incomplete-onboarding users from the public profile page
    if (user.username?.startsWith('pending_') || user.onboardingComplete === false) {
      return null;
    }

    return user;
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .first();

    return user;
  },
});

export const createUser = mutation({
  args: {
    clerkId: v.string(),
    username: v.string(),
    email: v.string(),
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .first();

    if (existingUser) {
      return existingUser._id;
    }

    const existingUsername = await ctx.db
      .query('users')
      .withIndex('by_username', (q) => q.eq('username', args.username))
      .first();

    if (existingUsername) {
      throw new Error('Username is not available');
    }

    const userId = await ctx.db.insert('users', {
      clerkId: args.clerkId,
      username: args.username,
      email: args.email,
      displayName: args.displayName || args.username,
      avatarUrl: args.avatarUrl,
      isAdmin: false,
      earnings: 0,
      balance: 0,
      status: 'active',
      role: 'creator',
      createdAt: new Date().toISOString(),
    });

    return userId;
  },
});

export const updateUserProfile = mutation({
  args: {
    userId: v.id('users'),
    displayName: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    phone: v.optional(v.string()),
    socialPlatform: v.optional(v.string()),
    socialId: v.optional(v.string()),
    facebookUrl: v.optional(v.string()),
    instagramUrl: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    twitterUrl: v.optional(v.string()),
    youtubeUrl: v.optional(v.string()),
    theme: v.optional(v.string()),
    buttonStyle: v.optional(v.string()),
    fontStyle: v.optional(v.string()),
    avatarShape: v.optional(v.string()),
    username: v.optional(v.string()),
    niche: v.optional(v.string()),
    location: v.optional(v.string()),
    telegramUrl: v.optional(v.string()),
    onboardingComplete: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { userId, username, ...updates } = args;

    if (username) {
      const existing = await ctx.db
        .query('users')
        .withIndex('by_username', (q) => q.eq('username', username))
        .first();

      if (existing && existing._id !== userId) {
        throw new Error('Username is already taken');
      }
    }

    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined)
    );

    if (username) {
      filteredUpdates.username = username;
    }

    await ctx.db.patch(userId, filteredUpdates);
    return { success: true };
  },
});

export const updateUserTheme = mutation({
  args: {
    userId: v.id('users'),
    theme: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { theme: args.theme });
    return { success: true };
  },
});

export const updateUserNiche = mutation({
  args: {
    userId: v.id('users'),
    niche: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { niche: args.niche });
    return { success: true };
  },
});

export const updateUserBalance = mutation({
  args: {
    userId: v.id('users'),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error('User not found');

    const newBalance = (user.balance || 0) + args.amount;
    await ctx.db.patch(args.userId, { balance: newBalance });
    return { success: true };
  },
});

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query('users').collect();
    return users;
  },
});

export const getUserById = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
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
      facebookUrl: v.optional(v.string()),
      instagramUrl: v.optional(v.string()),
      linkedinUrl: v.optional(v.string()),
      twitterUrl: v.optional(v.string()),
      youtubeUrl: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, args.updates);
    return { success: true };
  },
});

export const checkUsernameAvailability = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_username', (q) => q.eq('username', args.username))
      .first();

    return { available: !existingUser };
  },
});

export const checkEmailAvailability = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();

    return { available: !existingUser };
  },
});

export const updatePageSettings = mutation({
  args: {
    userId: v.id('users'),
    pageVisible: v.optional(v.boolean()),
    showBranding: v.optional(v.boolean()),
    allowIndexing: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined)
    );
    await ctx.db.patch(userId, filteredUpdates);
    return { success: true };
  },
});

export const clearAllLinks = mutation({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const links = await ctx.db
      .query('links')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .collect();

    for (const link of links) {
      await ctx.db.delete(link._id);
    }
    return { success: true, deleted: links.length };
  },
});

export const deleteAccount = mutation({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    // Delete all user's links
    const links = await ctx.db
      .query('links')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .collect();

    for (const link of links) {
      await ctx.db.delete(link._id);
    }

    // Delete all user's link clicks
    const clicks = await ctx.db
      .query('linkClicks')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .collect();

    for (const click of clicks) {
      await ctx.db.delete(click._id);
    }

    // Delete all user's bio visits
    const visits = await ctx.db
      .query('bioVisits')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .collect();

    for (const visit of visits) {
      await ctx.db.delete(visit._id);
    }

    // Delete the user
    await ctx.db.delete(args.userId);
    return { success: true };
  },
});

export const getUserLinks = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const links = await ctx.db
      .query('links')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .collect();

    return links;
  },
});

export const exportUserData = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    const links = await ctx.db
      .query('links')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .collect();
    const clicks = await ctx.db
      .query('linkClicks')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .collect();
    const withdrawals = await ctx.db
      .query('withdrawals')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .collect();

    return {
      user,
      links,
      clicks,
      withdrawals,
      exportedAt: new Date().toISOString(),
    };
  },
});