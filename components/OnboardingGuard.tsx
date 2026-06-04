'use client';

import { useEffect, useRef, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter, usePathname } from 'next/navigation';

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const [setupStatus, setSetupStatus] = useState<'idle' | 'waiting' | 'creating'>('idle');
  const attemptRef = useRef(false);

  const profile = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : 'skip'
  );

  // createUser is a stable Convex mutation reference — keep it out of effect deps
  const createUser = useMutation(api.users.createUser);

  // Effect 1: only handles the webhook-vs-fallback race
  // Runs only when the profile is confirmed null AND the user is signed in
  useEffect(() => {
    if (!isLoaded || !user) return;
    if (profile === undefined) return; // still loading
    if (profile !== null) {
      // Profile exists — clear any in-flight attempt and bail
      setSetupStatus('idle');
      attemptRef.current = false;
      return;
    }
    if (attemptRef.current) return; // already scheduled

    attemptRef.current = true;
    setSetupStatus('waiting');

    const timer = setTimeout(() => {
      setSetupStatus('creating');
      const email = user.primaryEmailAddress?.emailAddress || '';
      const emailPrefix = email.split('@')[0] || 'user';
      const displayName =
        user.fullName ||
        [user.firstName, user.lastName].filter(Boolean).join(' ') ||
        emailPrefix;
      const placeholderUsername = `pending_${user.id.slice(-8)}`;

      createUser({
        clerkId: user.id,
        username: placeholderUsername,
        email,
        displayName,
        avatarUrl: user.imageUrl || '',
      })
        .then(() => {
          setSetupStatus('idle');
        })
        .catch((err: unknown) => {
          // If the webhook raced us, the user already exists — that's fine
          console.warn('Fallback createUser:', (err as Error)?.message || err);
          setSetupStatus('idle');
          attemptRef.current = false;
        });
    }, 2000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, user, profile === null]); // intentionally narrow: only fires on null→null

  // Effect 2: routing — only after we have a profile
  // The username page handles the placeholder→/about jump so this just enforces /onboarding guard
  useEffect(() => {
    if (!isLoaded || !user || !profile) return;

    if (!profile.onboardingComplete) {
      if (pathname !== '/onboarding/username' && pathname !== '/onboarding/about') {
        router.replace('/onboarding/username');
      }
      return;
    }

    if (pathname?.startsWith('/onboarding/')) {
      router.replace('/bio');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, user, profile?.onboardingComplete, pathname]);

  // Show setup screen while waiting for webhook or running fallback create
  if (!isLoaded || profile === undefined || setupStatus !== 'idle') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA] gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0b8a3c]" />
        <p className="text-sm text-gray-500">
          {setupStatus === 'creating' ? 'Setting up your account...' : 'Loading your profile...'}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
