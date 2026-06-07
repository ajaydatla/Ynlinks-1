'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import { ArrowRight, User, Megaphone, Building2, Network, GraduationCap, Terminal, Backpack, Palette, MapPin, Youtube, Instagram, Send, Facebook, Loader2, Play, Upload, X } from 'lucide-react';
import { BioPreview } from '@/components/BioPreview';

type Category = {
  id: string;
  title: string;
  icon: React.ReactNode;
};

const categories: Category[] = [
  { id: 'creator', title: 'Creator', icon: <User size={18} /> },
  { id: 'influencer', title: 'Influencer', icon: <Megaphone size={18} /> },
  { id: 'business', title: 'Business', icon: <Building2 size={18} /> },
  { id: 'agency', title: 'Agency', icon: <Network size={18} /> },
  { id: 'coach', title: 'Coach', icon: <GraduationCap size={18} /> },
  { id: 'developer', title: 'Developer', icon: <Terminal size={18} /> },
  { id: 'student', title: 'Student', icon: <Backpack size={18} /> },
  { id: 'artist', title: 'Artist', icon: <Palette size={18} /> },
];

export default function AboutPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profile = useQuery(api.users.getUserByClerkId, user?.id ? { clerkId: user.id } : 'skip');
  const userLinks = useQuery(api.links.getEnabledLinksByUser, { userId: profile?._id || '' });
  const updateProfile = useMutation(api.users.updateUserProfile);

  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    bio: '',
    location: '',
    avatarUrl: '',
    youtubeUrl: '',
    instagramUrl: '',
    telegramUrl: '',
    facebookUrl: '',
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    if (profile) {
      if (!profile.username) {
        router.replace('/onboarding/username');
      } else if (profile.onboardingComplete) {
        router.replace('/links');
      } else {
        setFormData({
          username: profile.username || '',
          displayName: profile.displayName || '',
          bio: profile.bio || '',
          location: profile.location || '',
          avatarUrl: profile.avatarUrl || '',
          youtubeUrl: profile.youtubeUrl || '',
          instagramUrl: profile.instagramUrl || '',
          telegramUrl: profile.telegramUrl || '',
          facebookUrl: profile.facebookUrl || '',
        });
        if (profile.niche) setSelectedCategory(profile.niche);
      }
    }
  }, [profile, router]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormData({ ...formData, avatarUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleContinue = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await updateProfile({
        userId: profile._id,
        niche: selectedCategory || undefined,
        displayName: formData.displayName || undefined,
        bio: formData.bio || undefined,
        location: formData.location || undefined,
        avatarUrl: formData.avatarUrl || undefined,
        youtubeUrl: formData.youtubeUrl || undefined,
        instagramUrl: formData.instagramUrl || undefined,
        telegramUrl: formData.telegramUrl || undefined,
        facebookUrl: formData.facebookUrl || undefined,
        onboardingComplete: true,
      });
      // Show welcome message, then redirect after 2 seconds
      setOnboardingComplete(true);
      setTimeout(() => router.push('/links'), 6000);
    } catch (err) {
      console.error('Failed to save', err);
    } finally {
      setSaving(false);
    }
  };

  // Show welcome message popup/toast
  if (onboardingComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        {/* Confetti animation background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="confetti-1 absolute top-10 left-1/4 w-3 h-3 bg-[#2EE6A6] rounded-full animate-confetti" />
          <div className="confetti-2 absolute top-20 left-1/3 w-2 h-2 bg-yellow-400 rounded-full animate-confetti-delay" />
          <div className="confetti-3 absolute top-5 right-1/4 w-2.5 h-2.5 bg-purple-500 rounded-full animate-confetti" />
          <div className="confetti-4 absolute top-16 right-1/3 w-2 h-2 bg-pink-500 rounded-full animate-confetti-delay" />
          <div className="confetti-5 absolute top-8 left-1/2 w-2 h-2 bg-orange-500 rounded-full animate-confetti" />
        </div>

        <div className="relative bg-white rounded-3xl shadow-2xl p-8 mx-4 max-w-sm w-full text-center border border-gray-100">
          {/* Animated checkmark circle */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-[#2EE6A6] rounded-full animate-ping opacity-20" />
            <div className="absolute inset-0 bg-[#2EE6A6] rounded-full animate-pulse" />
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-[#2EE6A6] animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#111111] mb-2">Welcome to YNLinks! 🎉</h2>
          <p className="text-gray-500 mb-6">You have successfully created your account.</p>

          <div className="text-sm text-gray-400 animate-pulse">Redirecting to your dashboard...</div>
        </div>

        <style>{`
          @keyframes confetti {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
          .animate-confetti { animation: confetti 2s ease-out forwards; }
          .animate-confetti-delay { animation: confetti 2.5s ease-out 0.3s forwards; }
        `}</style>
      </div>
    );
  }

  if (!isLoaded || profile === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <Loader2 className="w-10 h-10 animate-spin text-[#2EE6A6]" />
      </div>
    );
  }

  const selectedTheme = (profile?.theme as any) || 'parchment';
  const selectedButtonStyle = (profile?.buttonStyle as any) || 'pill';
  const selectedFontStyle = (profile?.fontStyle as any) || 'dm-sans';
  const selectedAvatarShape = (profile?.avatarShape as any) || 'circle';

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      {/* Header */}
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

      <div className="flex-1 flex">
        {/* Left: Form */}
        <div className="flex-1 px-8 py-8 overflow-y-auto">
          <div className="max-w-lg mx-auto space-y-5">
            {/* Header */}
            <div>
              {/* <h1 className="text-2xl font-bold text-[#111111]">Tell us about yourself</h1> */}
              <p className="text-gray-800 mt-">Customize your profile</p>
            </div>

            {/* Profile Picture */}
            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-2">Profile Picture</label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  {formData.avatarUrl ? (
                    <div className="relative w-20 h-20 rounded-full overflow-hidden">
                      <img src={formData.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setFormData({ ...formData, avatarUrl: '' })} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <X size={20} className="text-white" />
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors">
                      <Upload size={24} className="text-gray-400" />
                    </button>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Upload profile picture</p>
                  <p className="text-xs text-gray-400">JPG, PNG up to 2MB</p>
                </div>
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-2">Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EE6A6]/50" placeholder="yourname" />
              </div>
            </div>

            {/* Display Name */}
            {/* <div>
              <label className="block text-sm font-semibold text-[#111111] mb-2">Display Name (optional)</label>
              <input type="text" value={formData.displayName} onChange={(e) => setFormData({ ...formData, displayName: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EE6A6]/50" placeholder="Your Name" />
            </div> */}

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-2">Bio (optional)</label>
              <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} maxLength={80} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EE6A6]/50 resize-none" rows={3} placeholder="Tell people about yourself..." />
              <p className="text-xs text-gray-400 mt-1 text-right">{80 - formData.bio.length} characters remaining</p>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-2">Location </label>
              <div className="relative">
                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="e.g. India" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EE6A6]/50" />
              </div>
            </div>

            {/* Creator Category */}
            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-2">Creator Category</label>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EE6A6]/50 bg-white">
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
              </select>
            </div>

            {/* Social Links - Replace Website */}
            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-3">Social Links (optional)</label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center flex-shrink-0">
                    <Play size={16} />
                  </div>
                  <input type="url" placeholder="YouTube channel URL" value={formData.youtubeUrl} onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EE6A6]/50 text-sm" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white flex items-center justify-center flex-shrink-0">
                    <Instagram size={16} />
                  </div>
                  <input type="url" placeholder="Instagram profile URL" value={formData.instagramUrl} onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EE6A6]/50 text-sm" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
                    <Send size={16} />
                  </div>
                  <input type="url" placeholder="Telegram username or URL" value={formData.telegramUrl} onChange={(e) => setFormData({ ...formData, telegramUrl: e.target.value })} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EE6A6]/50 text-sm" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                    <Facebook size={16} />
                  </div>
                  <input type="url" placeholder="Facebook profile URL" value={formData.facebookUrl} onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EE6A6]/50 text-sm" />
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <button type="button" onClick={handleContinue} disabled={saving} className="w-full py-4 bg-[#0b8a3c] hover:bg-[#1FD695] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors">
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Continue</span><ArrowRight size={18} /></>}
            </button>
          </div>
        </div>

        {/* Right: Live Preview - Fixed on Desktop */}
        <div className="hidden lg:flex w-[360px] border-l border-gray-100 bg-gray-50 p-4">
          <div className="sticky top-6">
            {/* <p className="text-sm font-semibold text-gray-500 mb-3 text-center">Live Preview</p> */}
            <BioPreview
              avatarUrl={formData.avatarUrl}
              displayName={formData.displayName || formData.username}
              username={formData.username}
              bio={formData.bio}
              facebookUrl={formData.facebookUrl}
              instagramUrl={formData.instagramUrl}
              linkedinUrl={profile?.linkedinUrl || ''}
              twitterUrl={profile?.twitterUrl || ''}
              youtubeUrl={formData.youtubeUrl}
              userLinks={userLinks || []}
              theme={selectedTheme}
              buttonStyle={selectedButtonStyle}
              fontStyle={selectedFontStyle}
              avatarShape={selectedAvatarShape}
            />
          </div>
        </div>

        {/* Mobile FAB */}
        <div className="lg:hidden fixed bottom-6 right-6 z-50">
          <button
            onClick={() => {
              const preview = document.getElementById('mobile-onboarding-preview');
              if (preview) preview.classList.toggle('hidden');
            }}
            className="w-14 h-14 bg-[#2EE6A6] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#1FD695] transition-all"
            title="Toggle Preview"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        {/* Mobile Bottom Sheet */}
        <div id="mobile-onboarding-preview" className="lg:hidden fixed inset-0 z-40 bg-black/50 hidden">
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] bg-gray-50 rounded-t-3xl overflow-y-auto">
            <div className="sticky top-0 bg-gray-50 p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-[#111111]">Live Preview</h3>
              <button
                onClick={() => {
                  const preview = document.getElementById('mobile-onboarding-preview');
                  if (preview) preview.classList.add('hidden');
                }}
                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-4">
              <BioPreview
                avatarUrl={formData.avatarUrl}
                displayName={formData.displayName || formData.username}
                username={formData.username}
                bio={formData.bio}
                facebookUrl={formData.facebookUrl}
                instagramUrl={formData.instagramUrl}
                linkedinUrl={profile?.linkedinUrl || ''}
                twitterUrl={profile?.twitterUrl || ''}
                youtubeUrl={formData.youtubeUrl}
                userLinks={userLinks || []}
                theme={selectedTheme}
                buttonStyle={selectedButtonStyle}
                fontStyle={selectedFontStyle}
                avatarShape={selectedAvatarShape}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}