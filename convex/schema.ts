import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    username: v.string(),
    email: v.string(),
    displayName: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    phone: v.optional(v.string()),
    niche: v.optional(v.string()),
    theme: v.optional(v.string()),
    buttonStyle: v.optional(v.string()),
    fontStyle: v.optional(v.string()),
    isAdmin: v.boolean(),
    earnings: v.number(),
    socialPlatform: v.optional(v.string()),
    socialId: v.optional(v.string()),
    customDomain: v.optional(v.string()),
    role: v.optional(v.string()),
    balance: v.optional(v.number()),
    status: v.optional(v.string()),
    createdAt: v.optional(v.string()),
    // Page settings
    pageVisible: v.optional(v.boolean()),
    showBranding: v.optional(v.boolean()),
    allowIndexing: v.optional(v.boolean()),
    // Onboarding
    onboardingComplete: v.optional(v.boolean()),
    // Social links
    facebookUrl: v.optional(v.string()),
    instagramUrl: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    twitterUrl: v.optional(v.string()),
    youtubeUrl: v.optional(v.string()),
  })
    .index('by_clerk_id', ['clerkId'])
    .index('by_username', ['username'])
    .index('by_email', ['email']),

  links: defineTable({
    userId: v.string(),
    title: v.string(),
    url: v.string(),
    description: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    enabled: v.boolean(),
    archived: v.optional(v.boolean()),
    pinned: v.optional(v.boolean()),
    orderIndex: v.number(),
    clicks: v.number(),
    clickCount: v.optional(v.number()),
    type: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  })
    .index('by_user_id', ['userId'])
    .index('by_user_enabled', ['userId', 'enabled'])
    .index('by_user_archived', ['userId', 'archived'])
    .index('by_order', ['userId', 'orderIndex']),

  linkClicks: defineTable({
    linkId: v.id('links'),
    userId: v.string(),
    ipAddress: v.optional(v.string()),
    earnings: v.number(),
    clickedAt: v.optional(v.string()),
  })
    .index('by_link_id', ['linkId'])
    .index('by_user_id', ['userId'])
    .index('by_clicked_at', ['clickedAt']),

  bioVisits: defineTable({
    userId: v.string(),
    ipAddress: v.optional(v.string()),
    earnings: v.number(),
    visitedAt: v.optional(v.string()),
  })
    .index('by_user_id', ['userId'])
    .index('by_visited_at', ['visitedAt']),

  withdrawals: defineTable({
    userId: v.string(),
    amount: v.number(),
    status: v.string(),
    requestedAt: v.optional(v.string()),
    processedAt: v.optional(v.string()),
    method: v.optional(v.string()),
    details: v.optional(v.any()),
  })
    .index('by_user_id', ['userId'])
    .index('by_status', ['status']),

  notifications: defineTable({
    userId: v.string(),
    message: v.string(),
    read: v.boolean(),
    createdAt: v.optional(v.string()),
  })
    .index('by_user_id', ['userId'])
    .index('by_read', ['read']),

  advertiserInquiries: defineTable({
    name: v.string(),
    email: v.string(),
    message: v.string(),
    status: v.optional(v.string()),
    createdAt: v.optional(v.string()),
  })
    .index('by_created_at', ['createdAt']),

  niches: defineTable({
    name: v.string(),
    slug: v.string(),
    customDomain: v.optional(v.string()),
    adCode: v.optional(v.string()),
  })
    .index('by_slug', ['slug']),

  settings: defineTable({
    key: v.string(),
    value: v.string(),
  })
    .index('by_key', ['key']),

  analytics: defineTable({
    userId: v.string(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    timestamp: v.optional(v.string()),
  })
    .index('by_user_id', ['userId'])
    .index('by_timestamp', ['timestamp']),
});