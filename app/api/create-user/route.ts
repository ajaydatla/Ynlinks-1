import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';

export async function POST(req: Request) {
  try {
    const { clerkId, username, email, displayName, avatarUrl } = await req.json();

    if (!clerkId || !username || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    const userId = await client.mutation('users:createUser', {
      clerkId,
      username,
      email,
      displayName,
      avatarUrl,
    });

    return NextResponse.json({ success: true, userId });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}