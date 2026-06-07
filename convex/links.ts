import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

export const getLinksByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const links = await ctx.db
      .query('links')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .collect();

    return links.sort((a, b) => a.orderIndex - b.orderIndex);
  },
});

export const getEnabledLinksByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const links = await ctx.db
      .query('links')
      .withIndex('by_user_enabled', (q) =>
        q.eq('userId', args.userId).eq('enabled', true)
      )
      .collect();

    // Archived links must be hidden from the public profile, even if enabled.
    return links
      .filter((l) => l.archived !== true)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  },
});

export const getLinkById = query({
  args: { linkId: v.id('links') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.linkId);
  },
});

export const createLink = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    url: v.string(),
    description: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    enabled: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existingLinks = await ctx.db
      .query('links')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .collect();

    if (existingLinks.length >= 5) {
      throw new Error('Maximum 5 links allowed per user');
    }

    const maxOrder = existingLinks.length > 0
      ? Math.max(...existingLinks.map(l => l.orderIndex))
      : -1;

    const linkId = await ctx.db.insert('links', {
      userId: args.userId,
      title: args.title,
      url: args.url,
      description: args.description,
      thumbnailUrl: args.thumbnailUrl,
      enabled: args.enabled,
      archived: false,
      pinned: false,
      orderIndex: maxOrder + 1,
      clicks: 0,
      clickCount: 0,
    });

    return linkId;
  },
});

export const updateLink = mutation({
  args: {
    linkId: v.id('links'),
    title: v.optional(v.string()),
    url: v.optional(v.string()),
    description: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    enabled: v.optional(v.boolean()),
    type: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { linkId, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined)
    );

    await ctx.db.patch(linkId, filteredUpdates);
    return { success: true };
  },
});

export const deleteLink = mutation({
  args: { linkId: v.id('links') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.linkId);
    return { success: true };
  },
});

export const reorderLinks = mutation({
  args: {
    userId: v.string(),
    linkIds: v.array(v.id('links')),
  },
  handler: async (ctx, args) => {
    for (let i = 0; i < args.linkIds.length; i++) {
      await ctx.db.patch(args.linkIds[i], { orderIndex: i });
    }
    return { success: true };
  },
});

export const toggleLinkEnabled = mutation({
  args: {
    linkId: v.id('links'),
    enabled: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.linkId, { enabled: args.enabled });
    return { success: true };
  },
});

export const toggleLinkArchived = mutation({
  args: {
    linkId: v.id('links'),
    archived: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.linkId, { archived: args.archived });
    return { success: true };
  },
});

export const toggleLinkPinned = mutation({
  args: {
    linkId: v.id('links'),
    pinned: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.linkId, { pinned: args.pinned });
    return { success: true };
  },
});

export const incrementLinkClicks = mutation({
  args: {
    linkId: v.id('links'),
    userId: v.string(),
    ipAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const link = await ctx.db.get(args.linkId);
    if (!link) throw new Error('Link not found');

    const newClicks = (link.clicks || 0) + 1;

    await ctx.db.patch(args.linkId, { clicks: newClicks });

    await ctx.db.insert('linkClicks', {
      linkId: args.linkId,
      userId: args.userId,
      ipAddress: args.ipAddress,
      earnings: 0.10,
      clickedAt: new Date().toISOString(),
    });

    return { success: true, clicks: newClicks };
  },
});

export const getLinkCountByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const links = await ctx.db
      .query('links')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .collect();

    return {
      total: links.length,
      enabled: links.filter(l => l.enabled).length,
    };
  },
});