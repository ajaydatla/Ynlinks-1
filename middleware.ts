import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  publicRoutes: [
    '/',
    '/sign-in',
    '/sign-up',
    '/about',
    '/careers',
    '/community',
    '/blog',
    '/creator-report',
    '/help',
    '/privacy',
    '/terms',
    '/cookies',
    '/trust-center',
    '/social-good',
    '/niches/finance',
    '/niches/games',
    '/niches/jobs',
    '/niches/affiliate',
    '/favicon.ico',
  ],
  ignoredRoutes: [],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};