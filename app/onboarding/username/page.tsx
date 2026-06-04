'use client';

import { useState, useEffect, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowRight, Check, X, User as UserIcon } from 'lucide-react';

function sanitize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9_.]/g, '').slice(0, 30);
}

function generateSuggestions(base: string): string[] {
  const clean = sanitize(base).replace(/[._]/g, '');
  if (!clean) return ['creator', 'yourname', 'username'];
  const r = Math.random().toString(36).slice(2, 6);
  return [
    `${clean}_pro`,
    `${clean}.official`,
    `its_${clean}`,
    `${clean}${r}`,
  ];
}

export default function UsernamePage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  const profile = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : 'skip'
  );

  const [username, setUsername] = useState('');
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = useMutation(api.users.updateUserProfile);

  const initialBase = useMemo(() => {
    if (!user) return '';
    const fn = user.firstName || '';
    const ln = user.lastName || '';
    const full = `${fn}${ln}`.toLowerCase();
    if (full) return sanitize(full);
    const email = user.primaryEmailAddress?.emailAddress || '';
    const prefix = email.split('@')[0] || '';
    return sanitize(prefix);
  }, [user]);

  useEffect(() => {
    if (initialBase && !username) setUsername(initialBase);
  }, [initialBase, username]);

  // If profile already has a real (non-placeholder) username, skip this step
  useEffect(() => {
    if (!profile?.username) return;
    // Still on placeholder — stay on this page so the user can pick a real username
    if (profile.username.startsWith('pending_')) return;

    if (profile.onboardingComplete) {
      router.replace('/bio');
    } else {
      router.replace('/onboarding/about');
    }
  }, [profile, router]);

  const valid = username.length >= 3 && /^[a-z0-9_.]+$/.test(username);

  const availability = useQuery(
    api.users.checkUsernameAvailability,
    valid ? { username } : 'skip'
  );

  const suggestions = useMemo(() => generateSuggestions(initialBase), [initialBase]);

  const displayUrl = `${typeof window !== 'undefined' ? window.location.host : 'ynlinks.com'}/u/${username || 'yourname'}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setError(null);
    if (!valid) {
      setError('Use 3+ letters, numbers, dot or underscore.');
      return;
    }
    if (availability && !availability.available) {
      setError('This username is already taken.');
      return;
    }
    // Profile is guaranteed by OnboardingGuard — but keep a safety belt
    // in case the user navigates here via a stale tab.
    if (!profile) {
      return;
    }
    setSaving(true);
    try {
      await updateProfile({
        userId: profile._id,
        username,
      });
      router.push('/onboarding/about');
    } catch (err: any) {
      setError(err?.message || 'Failed to save username');
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0b8a3c]" />
      </div>
    );
  }

  const status: 'idle' | 'checking' | 'available' | 'taken' = !valid
    ? 'idle'
    : availability === undefined
    ? 'checking'
    : availability.available
    ? 'available'
    : 'taken';

  const displayName = profile?.displayName || user?.fullName || user?.firstName || 'Alex';

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased">
      {/* Header / progress */}
      <div className="w-full border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-[#111111]">
            <span className="text-[#0b8a3c]">YN</span>Links
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[#0b8a3c] uppercase tracking-wider">
              Step 1 of 2
            </span>
            <span className="text-xs text-gray-400 uppercase tracking-wider">
              Identity
            </span>
          </div>
        </div>
        <div className="h-1 bg-gray-100">
          <div className="h-1 bg-[#0b8a3c] transition-all" style={{ width: '50%' }} />
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Left — Form */}
        <div className="flex items-center justify-center px-6 py-12 lg:py-20">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold text-[#111111] tracking-tight">
              Choose your YNLink URL
            </h1>
            <p className="mt-3 text-gray-500 text-[15px] leading-relaxed">
              Pick a unique username to represent your brand and profile.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-2">
                  Username
                </label>
                <div className={`flex items-center w-full border-2 rounded-xl px-4 py-3 transition-colors ${
                  !touched
                    ? 'border-gray-200 focus-within:border-[#0b8a3c]'
                    : status === 'available'
                    ? 'border-[#0b8a3c]'
                    : status === 'taken' || error
                    ? 'border-red-400'
                    : 'border-gray-200'
                }`}>
                  <span className="text-gray-400 text-sm select-none">ynlinks.com/u/</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(sanitize(e.target.value));
                      setTouched(true);
                    }}
                    placeholder="yourname"
                    maxLength={30}
                    className="flex-1 ml-1 outline-none bg-transparent text-[#111111] font-medium placeholder:text-gray-300"
                  />
                  {status === 'checking' && (
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-[#0b8a3c] rounded-full animate-spin ml-2" />
                  )}
                  {status === 'available' && (
                    <Check size={18} className="text-[#0b8a3c] ml-2" />
                  )}
                  {status === 'taken' && (
                    <X size={18} className="text-red-500 ml-2" />
                  )}
                </div>
                {touched && (error || status === 'taken') && (
                  <p className="mt-2 text-xs text-red-500">{error || 'This username is already taken.'}</p>
                )}
                {touched && status === 'available' && (
                  <p className="mt-2 text-xs text-[#0b8a3c]">This username is available!</p>
                )}
                {!touched && (
                  <p className="mt-2 text-xs text-gray-400">3–30 characters · letters, numbers, dot, underscore</p>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-3">Suggested Usernames</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => {
                        setUsername(s);
                        setTouched(true);
                      }}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-[#111111] text-sm font-medium rounded-full transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={saving || !valid || status === 'taken' || !profile}
                className="w-full py-4 bg-[#0b8a3c] hover:bg-[#0a7a34] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Next Step
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right — Live Preview */}
        <div className="hidden lg:flex items-center justify-center bg-gray-50 px-6 py-12 lg:py-20 relative overflow-hidden">
          <div className="absolute top-6 right-6 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
            Live Profile Preview
          </div>

          {/* Phone mockup */}
          <div className="relative bg-black rounded-[2.5rem] p-2 shadow-2xl w-[260px] h-[540px]">
            <div className="rounded-[2.2rem] h-full overflow-hidden relative bg-white">
              {/* Dynamic island */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-20" />

              {/* Header image */}
              <div className="h-32 bg-gradient-to-br from-[#0b8a3c] to-[#0a2e1a] relative">
                <div className="absolute inset-0 opacity-30" style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(255,255,255,.15) 6px, rgba(255,255,255,.15) 12px)'
                }} />
              </div>

              {/* Avatar */}
              <div className="flex justify-center -mt-10 relative z-10">
                <div className="w-20 h-20 rounded-full bg-white p-1 shadow-lg">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center">
                    <UserIcon size={32} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Name + URL */}
              <div className="px-5 mt-3 text-center">
                <h3 className="text-[15px] font-bold text-[#111111]">
                  {displayName}
                </h3>
                <p className="text-xs text-[#0b8a3c] mt-0.5 font-medium break-all">
                  {displayUrl}
                </p>
              </div>

              {/* Link placeholders */}
              <div className="px-5 mt-5 space-y-2.5">
                <div className="h-9 bg-gray-100 rounded-lg" />
                <div className="h-9 bg-gray-100 rounded-lg" />
                <div className="h-9 bg-gray-100 rounded-lg" />
              </div>

              {/* Branding */}
              <div className="absolute bottom-3 left-0 right-0 text-center">
                <p className="text-[9px] text-gray-300">YnLink</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
