'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Facebook, Instagram, Linkedin, Twitter, Youtube, User, Share2, Check } from 'lucide-react';

const themeStyles = {
  'warm-ink': {
    bg: 'from-[#1a1a1a] to-[#2d2d2d]',
    text: 'text-white',
    subtext: 'text-gray-400',
    cardBg: 'bg-[#1f1f1f]',
    border: 'border-gray-700',
  },
  'pure': {
    bg: 'from-white to-gray-50',
    text: 'text-black',
    subtext: 'text-gray-600',
    cardBg: 'bg-white',
    border: 'border-gray-200',
  },
  'forest': {
    bg: 'from-[#0f2318] to-[#1a3d2b]',
    text: 'text-white',
    subtext: 'text-green-200',
    cardBg: 'bg-[#0f2318]',
    border: 'border-green-900',
  },
  'ocean': {
    bg: 'from-[#0a1628] to-[#1a2d4d]',
    text: 'text-white',
    subtext: 'text-blue-200',
    cardBg: 'bg-[#0a1628]',
    border: 'border-blue-900',
  },
  'rose': {
    bg: 'from-[#2d1a1f] to-[#4d2830]',
    text: 'text-white',
    subtext: 'text-red-200',
    cardBg: 'bg-[#2d1a1f]',
    border: 'border-rose-900',
  },
  'amber': {
    bg: 'from-[#1a1508] to-[#3d2f10]',
    text: 'text-white',
    subtext: 'text-amber-200',
    cardBg: 'bg-[#1a1508]',
    border: 'border-amber-900',
  },
  'slate': {
    bg: 'from-[#1e293b] to-[#334155]',
    text: 'text-white',
    subtext: 'text-slate-300',
    cardBg: 'bg-[#1e293b]',
    border: 'border-slate-600',
  },
  'parchment': {
    bg: 'from-[#fef9f0] to-[#f5ebe0]',
    text: 'text-[#1a1a1a]',
    subtext: 'text-[#6b5b4f]',
    cardBg: 'bg-[#fef9f0]',
    border: 'border-[#d4c4b0]',
  },
};

const buttonStyles = {
  pill: 'rounded-full',
  rounded: 'rounded-xl',
  square: 'rounded-lg',
  sharp: 'rounded-none',
};

const fontFamilies = {
  'fraunces': 'font-serif',
  'dm-sans': 'font-sans',
  'georgia': 'font-serif',
  'mono': 'font-mono',
};

type Theme = 'warm-ink' | 'pure' | 'forest' | 'ocean' | 'rose' | 'amber' | 'slate' | 'parchment';
type ButtonStyle = 'pill' | 'rounded' | 'square' | 'sharp';
type FontStyle = 'fraunces' | 'dm-sans' | 'georgia' | 'mono';

interface UserData {
  _id: string;
  username: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  theme?: string;
  buttonStyle?: string;
  fontStyle?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  pageVisible?: boolean;
}

interface Link {
  _id: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  enabled?: boolean;
  archived?: boolean;
}

function ProfileContent({
  creatorData,
  visibleLinks,
  buttonStyle,
  currentTheme,
  shareUrl,
}: {
  creatorData: UserData | null;
  visibleLinks: Link[];
  buttonStyle: ButtonStyle;
  currentTheme: typeof themeStyles['warm-ink'];
  shareUrl: string;
}) {
  const trackClickMutation = useMutation(api.links.incrementLinkClicks);
  const [copied, setCopied] = useState(false);

  const socialLinks = [
    { name: 'Facebook', url: creatorData?.facebookUrl, icon: Facebook },
    { name: 'Instagram', url: creatorData?.instagramUrl, icon: Instagram },
    { name: 'LinkedIn', url: creatorData?.linkedinUrl, icon: Linkedin },
    { name: 'Twitter', url: creatorData?.twitterUrl, icon: Twitter },
    { name: 'YouTube', url: creatorData?.youtubeUrl, icon: Youtube },
  ].filter(link => link.url && link.url.trim() !== '');

  const handleLinkClick = async (linkId: string, linkUrl: string) => {
    if (creatorData?._id) {
      trackClickMutation({
        linkId: linkId as any,
        userId: creatorData._id,
      }).catch(console.error);
    }
    window.location.href = linkUrl;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: creatorData?.displayName || creatorData?.username,
          text: `Check out ${creatorData?.displayName || creatorData?.username}'s links!`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy link');
      }
    }
  };

  return (
    <>
      {/* Avatar */}
      <div className="flex justify-center mb-3">
        {creatorData?.avatarUrl ? (
          <img
            src={creatorData.avatarUrl}
            alt={creatorData.displayName || creatorData.username}
            className="w-20 h-20 rounded-full object-cover border-2 border-white/20 shadow-lg"
          />
        ) : (
          <div className="w-20 h-20 bg-gradient-to-br from-[#2EE6A6] to-[#1FD695] rounded-full flex items-center justify-center shadow-lg">
            <User size={28} className="text-white" />
          </div>
        )}
      </div>

      {/* Name */}
      <h2 className={`${currentTheme.text} font-bold text-base text-center leading-tight`}>
        {creatorData?.displayName || creatorData?.username}
      </h2>

      {/* Username */}
      <p className={`${currentTheme.subtext} text-xs text-center mt-0.5`}>
        @{creatorData?.username}
      </p>

      {/* Bio */}
      {creatorData?.bio && (
        <p className={`${currentTheme.subtext} text-xs text-center max-w-[200px] mx-auto mt-2 leading-relaxed`}>
          {creatorData.bio}
        </p>
      )}

      {/* Social Icons */}
      {socialLinks.length > 0 && (
        <div className="flex items-center justify-center gap-2 mt-3">
          {socialLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-7 h-7 ${currentTheme.cardBg} border ${currentTheme.border} flex items-center rounded-full justify-center shadow-sm hover:scale-110 transition-all`}
              >
                <Icon size={12} className={currentTheme.text} />
              </a>
            );
          })}
        </div>
      )}

      {/* Branding */}
      <p className={`mt-3 text-center text-[12px] ${currentTheme.subtext}`}>
        Powered by <span className="text-[#2EE6A6] font-medium">YNLinks</span>
      </p>

      {/* Links */}
      {visibleLinks.length > 0 ? (
        <div className="mt-4 space-y-2">
          {visibleLinks.slice(0, 5).map((link) => (
            <a
              key={link._id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link._id, link.url);
              }}
              className={`${currentTheme.cardBg} border ${currentTheme.border} ${buttonStyles[buttonStyle]} px-4 py-3 flex items-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-[0.98] block`}
            >
              {link.thumbnailUrl ? (
                <img src={link.thumbnailUrl} alt="" className="w-5 h-5 rounded object-cover flex-shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded bg-[#2EE6A6]/20 flex-shrink-0" />
              )}
              <span className={`${currentTheme.text} text-xs font-medium truncate flex-1`}>
                {link.title}
              </span>
            </a>
          ))}
        </div>
      ) : (
        <div className="mt-4 text-center">
          <p className={`${currentTheme.subtext} text-xs`}>No links yet</p>
        </div>
      )}
    </>
  );
}

export default function PublicProfilePage() {
  const params = useParams();
  const username = params?.username as string;
  const [loading, setLoading] = useState(true);
  const [tracked, setTracked] = useState(false);

  const creatorData = useQuery(api.users.getUserByUsername, { username });
  const creatorLinks = useQuery(api.links.getEnabledLinksByUser, { userId: creatorData?._id || '' });
  const trackVisitMutation = useMutation(api.analytics.trackVisit);

  const theme = (creatorData?.theme as Theme) || 'parchment';
  const buttonStyle = (creatorData?.buttonStyle as ButtonStyle) || 'pill';
  const fontStyle = (creatorData?.fontStyle as FontStyle) || 'dm-sans';

  const currentTheme = themeStyles[theme] || themeStyles['parchment'];
  const visibleLinks = creatorLinks?.filter(l => l.enabled !== false && l.archived !== true) || [];

  useEffect(() => {
    if (creatorData !== undefined) {
      setLoading(false);
    }
  }, [creatorData]);

  useEffect(() => {
    if (creatorData?._id && !tracked) {
      trackVisitMutation({
        userId: creatorData._id,
      }).catch(console.error);
      setTracked(true);
    }
  }, [creatorData?._id, tracked, trackVisitMutation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2EE6A6]" />
      </div>
    );
  }

  if (!creatorData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2EE6A6]/10 via-[#FFFDF9] to-white">
        <div className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-md mx-4">
          <div className="w-20 h-20 bg-[#2EE6A6]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl font-bold text-[#2EE6A6]">?</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-[#111111] mb-4">Creator Not Found</h1>
          <p className="text-[#6B7280] mb-6">{"This profile doesn't"} exist or has been deactivated.</p>
          <a href="/" className="bg-[#2EE6A6] text-white px-8 py-3 rounded-xl hover:bg-[#1FD695] transition font-semibold inline-block">
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  if (creatorData.pageVisible === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2EE6A6]/10 via-[#FFFDF9] to-white">
        <div className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-md mx-4">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <User size={32} className="text-gray-400" />
          </div>
          <h1 className="text-3xl font-display font-bold text-[#111111] mb-4">Page Unavailable</h1>
          <p className="text-[#6B7280] mb-6">This page is currently hidden by the creator.</p>
          <a href="/" className="bg-[#2EE6A6] text-white px-8 py-3 rounded-xl hover:bg-[#1FD695] transition font-semibold inline-block">
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Desktop: iPhone mockup */}
      <div className="hidden sm:block relative bg-black rounded-[2.5rem] p-1.5 shadow-2xl overflow-hidden max-w-[280px] w-full">
        <div className={`rounded-[2.2rem] h-[500px] overflow-hidden relative bg-gradient-to-b ${currentTheme.bg} ${fontFamilies[fontStyle]}`}>
          {/* Dynamic Island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-20"></div>

          {/* Scrollable Content */}
          <div className="pt-10 px-4 pb-4 h-full overflow-y-auto scrollbar-hide">
            <ProfileContent
              creatorData={creatorData}
              visibleLinks={visibleLinks}
              buttonStyle={buttonStyle}
              currentTheme={currentTheme}
              shareUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/u/${creatorData.username}`}
            />
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/30 rounded-full"></div>
        </div>
      </div>

      {/* Mobile: Full-width content */}
      <div className="sm:hidden w-full max-w-md relative">
        {/* Mobile Share Button - Top Right */}
        <button
          onClick={() => {
            const shareUrl = `${window.location.origin}/u/${creatorData.username}`;
            if (navigator.share) {
              navigator.share({
                title: creatorData.displayName || creatorData.username,
                text: `Check out ${creatorData.displayName || creatorData.username}'s links!`,
                url: shareUrl,
              }).catch(() => {});
            } else {
              navigator.clipboard.writeText(shareUrl);
            }
          }}
          className={`absolute top-4 right-4 z-10 w-10 h-10 ${currentTheme.cardBg} border ${currentTheme.border} rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-all`}
        >
          <Share2 size={18} className={currentTheme.text} />
        </button>

        <div className={`rounded-2xl overflow-hidden bg-gradient-to-b ${currentTheme.bg} ${fontFamilies[fontStyle]}`}>
          <div className="px-4 py-8">
            <ProfileContent
              creatorData={creatorData}
              visibleLinks={visibleLinks}
              buttonStyle={buttonStyle}
              currentTheme={currentTheme}
              shareUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/u/${creatorData.username}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
