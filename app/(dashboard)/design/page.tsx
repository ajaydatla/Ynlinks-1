'use client';
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Check, Save, Sparkles, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { BioPreview } from '@/components/BioPreview';

type Theme = 'warm-ink' | 'pure' | 'forest' | 'ocean' | 'rose' | 'amber' | 'slate' | 'parchment';
type ButtonStyle = 'pill' | 'rounded' | 'square' | 'sharp';
type FontStyle = 'fraunces' | 'dm-sans' | 'georgia' | 'mono';
type AvatarShape = 'circle' | 'rounded' | 'square' | 'hexagon' | 'none';

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

const avatarShapes = [
  {
    id: 'circle' as AvatarShape,
    name: 'Circle',
    style: { borderRadius: '9999px' },
  },
  {
    id: 'rounded' as AvatarShape,
    name: 'Rounded',
    style: { borderRadius: '24px' },
  },
  {
    id: 'square' as AvatarShape,
    name: 'Square',
    style: { borderRadius: '0' },
  },
  {
    id: 'hexagon' as AvatarShape,
    name: 'Hexagon',
    style: { clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' },
  },
  {
    id: 'none' as AvatarShape,
    name: 'None',
    style: { display: 'none' },
  },
] as const;

export default function BioPage() {
  const { user, isLoaded } = useUser();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<Theme>('parchment');
  const [selectedButtonStyle, setSelectedButtonStyle] = useState<ButtonStyle>('pill');
  const [selectedFontStyle, setSelectedFontStyle] = useState<FontStyle>('dm-sans');
  const [selectedAvatarShape, setSelectedAvatarShape] = useState<AvatarShape>('circle');

  const profile = useQuery(api.users.getUserByClerkId, { clerkId: user?.id || '' });
  const userLinks = useQuery(api.links.getEnabledLinksByUser, { userId: profile?._id || '' });
  const updateProfileMutation = useMutation(api.users.updateUserProfile);

  useEffect(() => {
    if (profile) {
      if (profile.theme) setSelectedTheme(profile.theme as Theme);
      if (profile.buttonStyle) setSelectedButtonStyle(profile.buttonStyle as ButtonStyle);
      if (profile.fontStyle) setSelectedFontStyle(profile.fontStyle as FontStyle);
      if (profile.avatarShape) setSelectedAvatarShape(profile.avatarShape as AvatarShape);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await updateProfileMutation({
        userId: profile._id,
        theme: selectedTheme,
        buttonStyle: selectedButtonStyle,
        fontStyle: selectedFontStyle,
        avatarShape: selectedAvatarShape,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      alert('Failed to save appearance settings');
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2EE6A6]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page header */}
      {/* <div className="mb-6">
        <h1 className="text-3xl font-serif font-bold text-[#111111]">Design</h1>
        <p className="text-sm text-[#6B7280] mt-0.5">Customize how your bio page looks</p>
      </div> */}

      {/* 2-Column Layout: Appearance controls + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Left column — Appearance controls + Save button */}
        <div className="space-y-6">
          {/* Appearance card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              {/* <Sparkles size={18} className="text-[#2EE6A6]" /> */}
              <h3 className="text-lg font-semibold text-[#111111]">Appearance</h3>
            </div>

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
          <div className="grid grid-cols-4 gap-2">
            {fontStyles.map((font) => (
              <button
                key={font.id}
                onClick={() => setSelectedFontStyle(font.id)}
                className={`py-2 px-3 border-2 transition-all text-sm font-medium rounded-lg ${selectedFontStyle === font.id ? 'border-[#2EE6A6] bg-[#2EE6A6] text-white' : 'border-gray-200 bg-white text-[#111111] hover:border-gray-400'}`}
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

      {/* Header Customization card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          {/* <User size={18} className="text-[#2EE6A6]" /> */}
          <h3 className="text-lg font-semibold text-[#111111]">Header Customization</h3>
        </div>

        {/* <label className="block text-sm font-bold text-[#111111] mb-3">
          Avatar Shape
        </label> */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {avatarShapes.map((shape) => {
            const isSelected = selectedAvatarShape === shape.id;
            const isNone = shape.id === 'none';
            return (
              <button
                key={shape.id}
                type="button"
                onClick={() => setSelectedAvatarShape(shape.id)}
                className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all bg-gray-50 hover:bg-gray-100 ${
                  isSelected
                    ? 'border-[#2EE6A6] bg-white/5 shadow-sm'
                    : 'border-gray-200'
                }`}
              >
                {/* Visual preview of the shape */}
                {isNone ? (
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">∅</span>
                  </div>
                ) : (
                  <div
                    className="w-12 h-12 bg-gradient-to-br from-[#2EE6A6] to-[#1FD695]"
                    style={shape.style as React.CSSProperties}
                  />
                )}
                <span
                  className={`text-xs font-semibold ${
                    isSelected ? 'text-[#2EE6A6]' : 'text-[#111111]'
                  }`}
                >
                  {shape.name}
                </span>
                {isSelected && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-[#2EE6A6] rounded-full flex items-center justify-center">
                    <svg
                      className="w-2.5 h-2.5 text-white"
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
              </button>
            );
          })}
        </div>
      </div>

      {/* Save button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={`w-full py-4 rounded-2xl font-semibold text-base transition-all flex items-center justify-center gap-2.5 shadow-lg ${
              saved
                ? 'bg-white text-[#2EE6A6] border-2 border-[#2EE6A6]'
                : 'bg-gradient-to-r from-[#2EE6A6] to-[#1FD695] text-white hover:shadow-xl hover:scale-[1.01]'
            } ${saving ? 'opacity-80 cursor-wait' : ''}`}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent" />
                Saving…
              </>
            ) : saved ? (
              <>
                <Check className="h-5 w-5" />
                Saved!
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save Appearance
              </>
            )}
          </button>
        </div>

        {/* Right Column — Sticky Live Preview */}
        <div className="hidden lg:block">
          <div className="sticky top-6">
            <BioPreview
              avatarUrl={profile?.avatarUrl || ''}
              displayName={profile?.displayName || profile?.username || ''}
              username={profile?.username || ''}
              bio={profile?.bio || ''}
              facebookUrl={profile?.facebookUrl || ''}
              instagramUrl={profile?.instagramUrl || ''}
              linkedinUrl={profile?.linkedinUrl || ''}
              twitterUrl={profile?.twitterUrl || ''}
              youtubeUrl={profile?.youtubeUrl || ''}
              userLinks={userLinks || []}
              theme={selectedTheme}
              buttonStyle={selectedButtonStyle}
              fontStyle={selectedFontStyle}
              avatarShape={selectedAvatarShape}
            />
          </div>
        </div>
      </div>

      {/* Mobile Preview Toggle (FAB) */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            const preview = document.getElementById('mobile-design-preview');
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

      {/* Mobile Preview Panel (bottom sheet) */}
      <div id="mobile-design-preview" className="lg:hidden fixed inset-0 z-40 bg-black/50 hidden">
        <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] bg-gray-50 rounded-t-3xl overflow-y-auto">
          <div className="sticky top-0 bg-gray-50 p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-[#111111]">Live Preview</h3>
            <button
              onClick={() => {
                const preview = document.getElementById('mobile-design-preview');
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
              avatarUrl={profile?.avatarUrl || ''}
              displayName={profile?.displayName || profile?.username || ''}
              username={profile?.username || ''}
              bio={profile?.bio || ''}
              facebookUrl={profile?.facebookUrl || ''}
              instagramUrl={profile?.instagramUrl || ''}
              linkedinUrl={profile?.linkedinUrl || ''}
              twitterUrl={profile?.twitterUrl || ''}
              youtubeUrl={profile?.youtubeUrl || ''}
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
  );
}
