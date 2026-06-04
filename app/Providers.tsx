'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { ConvexClientProvider } from './ConvexClientProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary:
            'bg-[#0b8a3c] hover:bg-[#0a7a34] text-white',
        },
      }}
      afterSignUpUrl="/onboarding/username"
      afterSignInUrl="/bio"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      <ConvexClientProvider>
        {children}
      </ConvexClientProvider>
    </ClerkProvider>
  );
}