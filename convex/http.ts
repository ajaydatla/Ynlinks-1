import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { v } from 'convex/values';

const handle = httpRouter({
  clerkWebhook: httpAction(async (ctx, request) => {
    const body = await request.json();
    const { type, data } = body;

    if (type === 'user.created') {
      const { id: clerkId, email_addresses, first_name, last_name, image_url } = data;
      const primaryEmail = email_addresses[0]?.email_address || '';
      const emailPrefix = primaryEmail.split('@')[0] || `user`;
      const displayName = [first_name, last_name].filter(Boolean).join(' ') || emailPrefix;

      const existingUser = await ctx.db
        .query('users')
        .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
        .first();

      if (!existingUser) {
        // Placeholder username — the /onboarding/username step will overwrite it.
        const placeholderUsername = `pending_${clerkId.slice(-8)}`;

        await ctx.db.insert('users', {
          clerkId,
          username: placeholderUsername,
          email: primaryEmail,
          displayName,
          avatarUrl: image_url,
          isAdmin: false,
          earnings: 0,
          balance: 0,
          status: 'active',
          role: 'creator',
          onboardingComplete: false,
        });
      }
    }

    if (type === 'user.updated') {
      const { id: clerkId, first_name, last_name, image_url } = data;

      const user = await ctx.db
        .query('users')
        .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
        .first();

      if (user) {
        const displayName = [first_name, last_name].filter(Boolean).join(' ') || user.displayName;
        await ctx.db.patch(user._id, {
          displayName,
          avatarUrl: image_url,
        });
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }),
});

export default handle;