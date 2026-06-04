'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import {
  User,
  Megaphone,
  GraduationCap,
  Building2,
  Network,
  Music,
  Palette,
  Terminal,
  Backpack,
  ArrowRight,
} from 'lucide-react';

type Category = {
  id: string;
  title: string;
  subtext: string;
  icon: React.ReactNode;
};

const categories: Category[] = [
  { id: 'creator', title: 'Creator', subtext: 'Build your personal brand.', icon: <User size={22} /> },
  { id: 'influencer', title: 'Influencer', subtext: 'Connect with your audience.', icon: <Megaphone size={22} /> },
  { id: 'coach', title: 'Coach', subtext: 'Share your expertise.', icon: <GraduationCap size={22} /> },
  { id: 'business', title: 'Business', subtext: 'Grow your company.', icon: <Building2 size={22} /> },
  { id: 'agency', title: 'Agency', subtext: 'Manage multiple clients.', icon: <Network size={22} /> },
  { id: 'musician', title: 'Musician', subtext: 'Promote your tracks.', icon: <Music size={22} /> },
  { id: 'artist', title: 'Artist', subtext: 'Showcase your portfolio.', icon: <Palette size={22} /> },
  { id: 'developer', title: 'Developer', subtext: 'Build and share tools.', icon: <Terminal size={22} /> },
  { id: 'student', title: 'Student', subtext: 'Start your journey.', icon: <Backpack size={22} /> },
];

export default function AboutPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const profile = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : 'skip'
  );

  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const updateProfile = useMutation(api.users.updateUserProfile);

  useEffect(() => {
    if (profile) {
      if (!profile.username) {
        router.replace('/onboarding/username');
      } else if (profile.onboardingComplete) {
        router.replace('/bio');
      } else if (profile.niche) {
        setSelected(profile.niche);
      }
    }
  }, [profile, router]);

  const handleContinue = async () => {
    if (!selected || !profile) return;
    setSaving(true);
    try {
      await updateProfile({
        userId: profile._id,
        niche: selected,
        onboardingComplete: true,
      });
      router.push('/bio');
    } catch (err) {
      console.error('Failed to save niche', err);
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded || profile === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0b8a3c]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased">
      {/* Header / progress */}
      <div className="w-full border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-[#111111]">
            <span className="text-[#0b8a3c]">YN</span>Links
          </h2>
          <span className="text-xs text-gray-400">Step 2 of 2</span>
        </div>
        <div className="h-1 bg-gray-100">
          <div className="h-1 bg-[#0b8a3c] transition-all" style={{ width: '100%' }} />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-3xl">
          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-[#111111] tracking-tight">
              What best describes you?
            </h1>
            <p className="mt-3 text-gray-500 text-[15px]">
              This helps us personalize your experience.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat) => {
              const isSelected = selected === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelected(cat.id)}
                  className={`text-left bg-white rounded-2xl p-5 border-2 transition-all shadow-sm hover:shadow-md ${
                    isSelected
                      ? 'border-[#0b8a3c] ring-2 ring-[#0b8a3c]/20 bg-[#f0faf3]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#0b8a3c] mb-4">
                    {cat.icon}
                  </div>
                  <h3 className="text-[15px] font-bold text-[#111111] leading-snug">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    {cat.subtext}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Continue */}
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={handleContinue}
              disabled={!selected || saving}
              className="min-w-[260px] py-4 bg-[#0b8a3c] hover:bg-[#0a7a34] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>

          {/* Skip */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                if (!profile) return;
                setSaving(true);
                updateProfile({
                  userId: profile._id,
                  onboardingComplete: true,
                })
                  .then(() => router.push('/bio'))
                  .finally(() => setSaving(false));
              }}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
