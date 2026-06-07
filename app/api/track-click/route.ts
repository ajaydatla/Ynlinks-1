import { NextResponse } from 'next/server';
import { v } from 'convex/values';
import { ConvexHttpClient } from 'convex/browser';

export async function POST(req: Request) {
  try {
    const { linkId, userId } = await req.json();

    if (!linkId || !userId) {
      return NextResponse.json(
        { error: 'Missing linkId or userId' },
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

    // Track the click using the Convex mutation
    const result = await client.mutation('links:incrementLinkClicks', {
      linkId,
      userId,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Error tracking click:', error);
    return NextResponse.json(
      { error: 'Failed to track click' },
      { status: 500 }
    );
  }
}