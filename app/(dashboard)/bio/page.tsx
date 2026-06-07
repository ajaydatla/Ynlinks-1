'use client';
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ExternalLink, Copy, Check, Facebook, Instagram, Linkedin, Twitter, Youtube, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { BioPreview } from '@/components/BioPreview';

type Theme = 'warm-ink' | 'pure' | 'forest' | 'ocean' | 'rose' | 'amber' | 'slate' | 'parchment';
type ButtonStyle = 'pill' | 'rounded' | 'square' | 'sharp';
type FontStyle = 'fraunces' | 'dm-sans' | 'georgia' | 'mono';

const themes = [
  { id: 'warm-ink', name: 'Warm Ink', colors: ['#1a1a1a', '#2d2d2d'] },
  { id: 'pure', name: 'Pure', colors: ['#ffffff', '#f5f5f5'] },
  { id: 'forest', name: 'Forest', colors: ['#0f2318', '#1a3d2b'] },
  { id: 'ocean', name: 'Ocean', colors: ['#0a1628', '#1a2d4d'] },
  { id: 'rose', name: 'Rose', colors: ['#2d1a1f', '#4d2830'] },
  { id: 'amber', name: 'Amber', colors: ['#1a1508', '#3d2f10'] },
  { id: 'slate', name: 'Slate', colors: ['#1e293b', '#334155'] },
  { id: 'parchment', name: 'Parchment', colors: ['#fef9f0', '#f5ebe0'] },
] as const;

const buttonStyles = [
  { id: 'pill', name: 'Pill' },
  { id: 'rounded', name: 'Rounded' },
  { id: 'square', name: 'Square' },
  { id: 'sharp', name: 'Sharp' },
] as const;

const fontStyles = [
  { id: 'fraunces', name: 'Fraunces', family: 'serif' },
  { id: 'dm-sans', name: 'DM Sans', family: 'sans-serif' },
  { id: 'georgia', name: 'Georgia', family: 'serif' },
  { id: 'mono', name: 'Mono', family: 'monospace' },
] as const;

export default function BioPage() {
  const { user, isLoaded } = useUser();
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    avatarUrl: '',
    facebookUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    youtubeUrl: '',
  });
  const [selectedTheme, setSelectedTheme] = useState<Theme>('parchment');
  const [selectedButtonStyle, setSelectedButtonStyle] = useState<ButtonStyle>('pill');
  const [selectedFontStyle, setSelectedFontStyle] = useState<FontStyle>('dm-sans');

  const profile = useQuery(api.users.getUserByClerkId, { clerkId: user?.id || '' });
  const userLinks = useQuery(api.links.getEnabledLinksByUser, { userId: profile?._id || '' });
  const updateProfileMutation = useMutation(api.users.updateUserProfile);

  const bioLink = profile?.username
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/u/${profile.username}`
    : '';

  useEffect(() => {
    if (profile) {
      setFormData({
        bio: profile.bio || '',
        avatarUrl: profile.avatarUrl || '',
        facebookUrl: profile.facebookUrl || '',
        instagramUrl: profile.instagramUrl || '',
        linkedinUrl: profile.linkedinUrl || '',
        twitterUrl: profile.twitterUrl || '',
        youtubeUrl: profile.youtubeUrl || '',
      });
      if (profile.theme) setSelectedTheme(profile.theme as Theme);
      if (profile.buttonStyle) setSelectedButtonStyle(profile.buttonStyle as ButtonStyle);
      if (profile.fontStyle) setSelectedFontStyle(profile.fontStyle as FontStyle);
    }
  }, [profile]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(bioLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, avatarUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    try {
      await updateProfileMutation({
        userId: profile._id,
        bio: formData.bio,
        avatarUrl: formData.avatarUrl,
        facebookUrl: formData.facebookUrl,
        instagramUrl: formData.instagramUrl,
        linkedinUrl: formData.linkedinUrl,
        twitterUrl: formData.twitterUrl,
        youtubeUrl: formData.youtubeUrl,
        theme: selectedTheme,
        buttonStyle: selectedButtonStyle,
        fontStyle: selectedFontStyle,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      alert('Failed to save bio page settings');
    } finally {
      setSaving(false);
    }
  };

  const remainingChars = 80 - formData.bio.length;

  if (!isLoaded || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2EE6A6]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      {/* <div className="flex items-center gap-3 mb-6"> */}
      {/* <div className="w-10 h-10 bg-gradient-to-br from-[#2EE6A6] to-[#1FD695] rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">My Bio Page</h1>
          <p className="text-sm text-[#6B7280]">Customize your public profile</p>
        </div> */}
      {/* </div> */}

      {/* 2-Column Layout: Form + Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Left Column - Form Content */}
        <div className="space-y-6">
          {/* Your Bio Link */}
          <div className="bg-white rounded-2xl border border-gray-300 p-6 shadow-sm">
            <h3 className="text-md font-semibold text-[#111111] mb-2">Your Bio Link</h3>
            <p className="text-[#6B7280] text-sm mb-4">Share your custom bio link on all your social media platforms</p>
            <div className="flex gap-3 items-center">
              <input
                type="text"
                value={bioLink}
                readOnly
                className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-[#6B7280] font-mono text-sm"
              />
              <button
                onClick={copyToClipboard}
                className={`px-4 py-3 rounded-xl hover:bg-[#1FD695] transition-all flex items-center gap-2 font-semibold shadow-lg ${copied ? 'bg-green-500 text-white' : 'bg-[#2EE6A6] text-white'}`}
              >
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <a
                href={bioLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-3 bg-[#111111] text-white rounded-xl hover:bg-black transition-all flex items-center gap-2 font-semibold shadow-lg"
              >
                <ExternalLink className="h-4 w-4" />
                View Page
              </a>
            </div>
          </div>

          {/* Profile Information */}
          <div className="bg-white rounded-2xl border border-gray-300 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[#111111] mb-4">Profile</h3>

            <div className="flex items-start gap-6 mb-6">
              <div className="flex-shrink-0">
                {formData.avatarUrl ? (
                  <div className="relative group">
                    <img src={formData.avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-4 border-[#2EE6A6]" />
                    <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      <span className="text-white text-sm font-semibold">Change</span>
                    </label>
                  </div>
                ) : (
                  <label className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2EE6A6] to-[#1FD695] flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    <span className="text-4xl font-bold text-white">{(profile?.displayName || profile?.username || 'U').charAt(0).toUpperCase()}</span>
                  </label>
                )}
              </div>
              <div className="flex-1">
                <h5 className="text-xl font-bold text-[#111111] mb-1">{profile?.displayName || profile?.username}</h5>
                <p className="text-[#6B7280]">@{profile?.username}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-2">
                Bio <span className="text-[#6B7280] font-normal">(max 80 characters)</span>
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                maxLength={80}
                rows={2}
                placeholder="Tell visitors about yourself..."
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2EE6A6] focus:border-transparent transition-all resize-none"
              />
              <p className="text-xs text-[#6B7280] mt-1 text-right">{remainingChars} characters remaining</p>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-white rounded-2xl border border-gray-300 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[#111111] mb-6">Appearance</h3>

            {/* Theme */}
            {/* <div className="mb-6">
              <label className="block text-sm font-bold text-[#111111] mb-3">Theme</label>
              <div className="grid grid-cols-4 gap-2 ">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`relative rounded-xl overflow-hidden aspect-square group transition-all ${selectedTheme === theme.id ? 'ring-2 ring-[#2EE6A6] ring-offset-2' : 'ring-1 ring-gray-200 hover:ring-gray-400'}`}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(135deg, ${theme.colors[0]} 50%, ${theme.colors[1]} 50%)`,
                      }}
                    />
                    {selectedTheme === theme.id && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-[#2EE6A6] rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    <span className="absolute bottom-1 left-1.5 text-[8px] font-medium text-white drop-shadow-md">
                      {theme.name}
                    </span>
                  </button>
                ))}
              </div>
            </div> */}

            {/* Theme */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-[#111111] mb-3">
                Theme Presets
              </label>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`relative h-16 overflow-hidden rounded-2xl border-2 transition-all ${selectedTheme === theme.id
                        ? 'border-[#111111] shadow-md'
                        : 'border-gray-200 hover:border-gray-400'
                      }`}
                  >
                    {/* Split Background */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(
              135deg,
              ${theme.colors[0]} 0%,
              ${theme.colors[0]} 50%,
              ${theme.colors[1]} 50%,
              ${theme.colors[1]} 100%
            )`,
                      }}
                    />

                    {/* Selected Tick */}
                    {selectedTheme === theme.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                        <svg
                          className="w-3.5 h-3.5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}

                    {/* Theme Name */}
                    <span className="absolute bottom-2 left-3 text-xs font-semibold text-white drop-shadow-md">
                      {theme.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            {/* Button Style */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-[#111111] mb-3">Button Style</label>
              <div className="grid grid-cols-4 gap-2">
                {buttonStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedButtonStyle(style.id)}
                    className={`py-2.5 px-3 border-2 transition-all text-sm font-medium ${selectedButtonStyle === style.id ? 'border-[#2EE6A6] bg-[#2EE6A6] text-white' : 'border-gray-200 bg-white text-[#111111] hover:border-gray-400'} ${style.id === 'pill' ? 'rounded-full' : style.id === 'rounded' ? 'rounded-xl' : style.id === 'square' ? 'rounded-lg' : 'rounded'}`}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div>
              <label className="block text-sm font-bold text-[#111111] mb-3">Font</label>
              <div className="grid grid-cols-4 gap-2 ">
                {fontStyles.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => setSelectedFontStyle(font.id)}
                    className={`py-1 px-3 border-2 transition-all text-sm font-medium rounded-lg ${selectedFontStyle === font.id ? 'border-[#2EE6A6] bg-[#2EE6A6] text-white' : 'border-gray-200 bg-white text-[#111111] hover:border-gray-400'}`}
                  >
                    <p className={`text-base font-medium ${font.family === 'serif' ? 'font-serif' : font.family === 'sans-serif' ? 'font-sans' : 'font-mono'}`}>
                      {font.name}
                    </p>
                    <p className={`text-[10px] mt-0.5 ${font.family === 'serif' ? 'font-serif' : font.family === 'sans-serif' ? 'font-sans' : 'font-mono'} ${selectedFontStyle === font.id ? 'text-white/70' : 'text-[#6B7280]'}`}>
                      Aa Bb Cc 123
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-2xl border border-gray-300 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[#111111] mb-2">Social Links</h3>
            <p className="text-[#6B7280] text-sm mb-6">Add your social media profiles to display on your bio page</p>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Facebook className="w-5 h-5 text-white" />
                </div>
                <input
                  type="url"
                  value={formData.facebookUrl}
                  onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                  placeholder="https://facebook.com/yourprofile"
                  className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2EE6A6] focus:border-transparent transition-all text-sm"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
                <input
                  type="url"
                  value={formData.instagramUrl}
                  onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/yourprofile"
                  className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2EE6A6] focus:border-transparent transition-all text-sm"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Linkedin className="w-5 h-5 text-white" />
                </div>
                <input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2EE6A6] focus:border-transparent transition-all text-sm"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                  <Twitter className="w-5 h-5 text-white" />
                </div>
                <input
                  type="url"
                  value={formData.twitterUrl}
                  onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                  placeholder="https://twitter.com/yourprofile"
                  className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2EE6A6] focus:border-transparent transition-all text-sm"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Youtube className="w-5 h-5 text-white" />
                </div>
                <input
                  type="url"
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                  placeholder="https://youtube.com/@yourchannel"
                  className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2EE6A6] focus:border-transparent transition-all text-sm"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 shadow-lg ${saved ? 'bg-green-500 text-white' : 'bg-[#2EE6A6] text-white hover:bg-[#1FD695]'}`}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Saving...
              </>
            ) : saved ? (
              <>
                <Check className="h-5 w-5" />
                Saved!
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save Changes
              </>
            )}
          </button>
        </div>

        {/* Right Column - Sticky Preview */}
        <div className="hidden lg:block">
          <div className="sticky top-6">
            <BioPreview
              avatarUrl={formData.avatarUrl}
              displayName={profile?.displayName || profile?.username || ''}
              username={profile?.username || ''}
              bio={formData.bio}
              facebookUrl={formData.facebookUrl}
              instagramUrl={formData.instagramUrl}
              linkedinUrl={formData.linkedinUrl}
              twitterUrl={formData.twitterUrl}
              youtubeUrl={formData.youtubeUrl}
              userLinks={userLinks || []}
              theme={selectedTheme}
              buttonStyle={selectedButtonStyle}
              fontStyle={selectedFontStyle}
            />
          </div>
        </div>
      </div>

      {/* Mobile Preview Toggle */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            const preview = document.getElementById('mobile-preview-panel');
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

      {/* Mobile Preview Panel */}
      <div id="mobile-preview-panel" className="lg:hidden fixed inset-0 z-40 bg-black/50 hidden">
        <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] bg-gray-50 rounded-t-3xl overflow-y-auto">
          <div className="sticky top-0 bg-gray-50 p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-[#111111]">Live Preview</h3>
            <button
              onClick={() => {
                const preview = document.getElementById('mobile-preview-panel');
                if (preview) preview.classList.add('hidden');
              }}
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4">
            <BioPreview
              avatarUrl={formData.avatarUrl}
              displayName={profile?.displayName || profile?.username || ''}
              username={profile?.username || ''}
              bio={formData.bio}
              facebookUrl={formData.facebookUrl}
              instagramUrl={formData.instagramUrl}
              linkedinUrl={formData.linkedinUrl}
              twitterUrl={formData.twitterUrl}
              youtubeUrl={formData.youtubeUrl}
              theme={selectedTheme}
              buttonStyle={selectedButtonStyle}
              fontStyle={selectedFontStyle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}