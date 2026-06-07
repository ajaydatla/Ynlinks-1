import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';

export async function POST(req: Request) {
  try {
    const { clerkId, displayName, avatarUrl, bio, phone, socialPlatform, socialId } = await req.json();

    if (!clerkId) {
      return NextResponse.json(
        { error: 'Missing clerkId' },
        { status: 400 }
      );
    }

    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      return NextResponse.json(
        { error: 'Missing NEXT_PUBLIC_CONVEX_URL' },
        { status: 500 }
      );
    }

    const client = new ConvexHttpClient(convexUrl);

    // First, get the user by Clerk ID
    const user = await client.query('users:getUserByClerkId', { clerkId });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update the user profile
    const result = await client.mutation('users:updateUserProfile', {
      userId: user._id,
      displayName,
      avatarUrl,
      bio,
      phone,
      socialPlatform,
      socialId,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
      { status: 500 }
    );
  }
}