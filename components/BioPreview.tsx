'use client';

import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  User,
} from 'lucide-react';

interface BioPreviewProps {
  avatarUrl: string;
  displayName: string;
  username: string;
  bio: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  userLinks?: Array<{
    _id: string;
    title: string;
    url: string;
    thumbnailUrl?: string;
    enabled?: boolean;
    archived?: boolean;
  }>;
  theme?: 'warm-ink' | 'pure' | 'forest' | 'ocean' | 'rose' | 'amber' | 'slate' | 'parchment';
  buttonStyle?: 'pill' | 'rounded' | 'square' | 'sharp';
  fontStyle?: 'fraunces' | 'dm-sans' | 'georgia' | 'mono';
  avatarShape?: 'circle' | 'rounded' | 'square' | 'hexagon' | 'none';
}

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

// CSS style fragments for each avatar shape. 'none' = empty object (avatar
// will be wrapped in a conditional, so it won't render at all).
const avatarShapeStyles: Record<'circle' | 'rounded' | 'square' | 'hexagon' | 'none', React.CSSProperties> = {
  circle: { borderRadius: '9999px' },
  rounded: { borderRadius: '18px' },
  square: { borderRadius: '0' },
  hexagon: { clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' },
  none: {},
};

export function BioPreview({
  avatarUrl,
  displayName,
  username,
  bio,
  facebookUrl,
  instagramUrl,
  linkedinUrl,
  twitterUrl,
  youtubeUrl,
  userLinks = [],
  theme = 'parchment',
  buttonStyle = 'pill',
  fontStyle = 'dm-sans',
  avatarShape = 'circle',
}: BioPreviewProps) {
  const socialLinks = [
    {
      name: 'Facebook',
      url: facebookUrl,
      icon: Facebook,
    },
    {
      name: 'Instagram',
      url: instagramUrl,
      icon: Instagram,
    },
    {
      name: 'LinkedIn',
      url: linkedinUrl,
      icon: Linkedin,
    },
    {
      name: 'Twitter',
      url: twitterUrl,
      icon: Twitter,
    },
    {
      name: 'YouTube',
      url: youtubeUrl,
      icon: Youtube,
    },
  ].filter((link) => link.url && link.url.trim() !== '');

  const currentTheme = themeStyles[theme];

  return (
    <div className="bg-transparent">
      {/* Preview Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[12px] font-medium text-gray-500 max-w-[150px] mx-auto">
          Live Preview
        </span>
      </div>

      {/* iPhone Mockup */}
      <div className="flex justify-center">
        <div
          className="relative bg-black rounded-[1.8rem] p-1 shadow-xl overflow-hidden"
          style={{ width: '200px', height: '420px' }}
        >
          {/* Screen */}
          <div className={`rounded-[1.6rem] h-full overflow-hidden relative bg-gradient-to-b ${currentTheme.bg}`}>
            {/* Dynamic Island */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-14 h-4 bg-black rounded-full z-10"></div>

            {/* Scrollable Content */}
            <div className={`pt-8 px-3 pb-5 h-full overflow-y-auto scrollbar-hide ${fontFamilies[fontStyle]}`}>
              {/* Avatar — shape driven by `avatarShape` prop. Hidden when 'none'. */}
              {avatarShape !== 'none' && (
                <div className="mb-3 flex justify-center">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName || username}
                      className="w-16 h-16 object-cover border-2 border-white/20 shadow-md"
                      style={avatarShapeStyles[avatarShape]}
                    />
                  ) : (
                    <div
                      className="w-16 h-16 bg-gradient-to-br from-[#2EE6A6] to-[#1FD695] flex items-center justify-center shadow-md"
                      style={avatarShapeStyles[avatarShape]}
                    >
                      <User size={26} className="text-white" />
                    </div>
                  )}
                </div>
              )}

              {/* Name */}
              <h2 className={`${currentTheme.text} font-bold text-[13px] text-center leading-tight`}>
                {displayName || 'Your Name'}
              </h2>

              {/* Username */}
              <p className={`${currentTheme.subtext} text-[9px] text-center mt-1`}>
                @{username || 'username'}
              </p>

               {/* Bio */}
              {bio && (
                <p className={`${currentTheme.subtext} text-[9px] text-center max-w-[150px] mx-auto mt-2 leading-relaxed`}>
                  {bio}
                </p>
              )}


              {/* Social Icons */}
              {socialLinks.length > 0 && (
                <div className="flex items-center justify-center gap-2 mt-2">
                  {socialLinks.map((link, index) => {
                    const Icon = link.icon;

                    return (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-6 h-6 ${currentTheme.cardBg} border ${currentTheme.border} flex items-center rounded-full justify-center shadow-sm hover:scale-105 transition-all duration-200`}
                      >
                        <Icon
                          size={11}
                          className={currentTheme.text}
                        />
                      </a>
                    );
                  })}
                </div>
              )}


              {/* Sample Link Button */}
              {socialLinks.length === 0 && userLinks.length === 0 && (
                <div className={`mt-4 ${currentTheme.cardBg} border ${currentTheme.border} ${buttonStyles[buttonStyle]} px-4 py-2`}>
                  <p className={`${currentTheme.text} text-[9px] font-medium`}>Your Link</p>
                </div>
              )}

             

              {/* User Links */}
              {userLinks.filter(l => l.enabled !== false && l.archived !== true).length > 0 && (
                <div className="mt-3 space-y-2 w-full pb-4">
                  {userLinks.filter(l => l.enabled !== false && l.archived !== true).slice(0, 5).map((link, idx) => (
                    <a
                      key={link._id || idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${currentTheme.cardBg} border ${currentTheme.border} ${buttonStyles[buttonStyle]} px-4 py-2 flex items-center gap-2`}
                    >
                      {link.thumbnailUrl ? (
                        <img src={link.thumbnailUrl} alt="" className="w-6 h-6 rounded object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-6 h-6 rounded bg-[#2EE6A6]/20 flex-shrink-0" />
                      )}
                      <p className={`${currentTheme.text} text-[9px] font-medium truncate flex-1`}>
                        {link.title}
                      </p>
                    </a>
                  ))}
                </div>
              )}
               {/* Branding */}
              <p className={`mt-3 text-center text-[9px] ${currentTheme.subtext}`}>
                Powered by <span className="text-[#2EE6A6] font-medium">YNLinks</span>
                {/* <span className="block">---------------</span> */}
              </p>
            </div>

            {/* Home Bar */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-16 h-1 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}