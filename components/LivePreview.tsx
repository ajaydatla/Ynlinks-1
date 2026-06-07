'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ExternalLink, Moon, Sun, User } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Link {
  _id: string;
  title: string;
  url: string;
  description?: string;
  thumbnailUrl?: string;
  enabled: boolean;
  orderIndex: number;
}

export function LivePreview() {
  const { user } = useUser();
  const [links, setLinks] = useState<Link[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  const profile = useQuery(api.users.getUserByClerkId, { clerkId: user?.id || '' });
  const liveLinks = useQuery(api.links.getEnabledLinksByUser, { userId: profile?._id || '' });

  useEffect(() => {
    if (liveLinks) {
      setLinks(liveLinks);
    }
  }, [liveLinks]);

  const bioLink = typeof window !== 'undefined' ? `${window.location.origin}/u/${profile?.username}` : '';

  return (
    <div className="sticky top-0 h-screen bg-gray-50 border-l border-gray-200 p-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-bold text-lg text-[#111111]">Live Preview</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Toggle dark mode"
          >
            {darkMode ? <Sun size={18} className="text-[#6B7280]" /> : <Moon size={18} className="text-[#6B7280]" />}
          </button>
          <a
            href={bioLink}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Open in new tab"
          >
            <ExternalLink size={18} className="text-[#6B7280]" />
          </a>
        </div>
      </div>

      <div className="relative mx-auto" style={{ maxWidth: '375px' }}>
        <div className="relative bg-[#111111] rounded-[3rem] border-8 border-[#111111] shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#111111] rounded-b-xl z-20"></div>

          <div
            className={`w-full h-[667px] overflow-y-auto overflow-x-hidden ${
              darkMode ? 'bg-gray-900' : 'bg-[#FFFDF9]'
            }`}
          >
            <div className="pt-12 px-6 pb-8 flex flex-col items-center">
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName || profile.username}
                  className="w-20 h-20 rounded-full mb-4 shadow-lg object-cover border-4 border-white"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-[#2EE6A6] to-[#2EE6A6]/70 rounded-full mb-4 flex items-center justify-center shadow-lg">
                  <User className="text-white" size={32} />
                </div>
              )}

              <h2 className={`font-display font-bold text-xl mb-1 ${darkMode ? 'text-white' : 'text-[#111111]'}`}>
                {profile?.displayName || profile?.username}
              </h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>
                @{profile?.username}
              </p>

              {profile?.bio && (
                <p className={`text-sm mt-3 text-center max-w-xs ${darkMode ? 'text-gray-300' : 'text-[#6B7280]'}`}>
                  {profile.bio}
                </p>
              )}

              <div className="h-4"></div>

              <div className="w-full space-y-3">
                {links.length === 0 ? (
                  <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>
                    <p className="text-sm">No links added yet</p>
                  </div>
                ) : (
                  <>
                    {links.slice(0, 2).map((link) => (
                      <div
                        key={link._id}
                        className={`w-full rounded-xl border-2 transition-all cursor-pointer overflow-hidden ${
                          darkMode
                            ? 'bg-gray-800 border-gray-700 hover:border-[#2EE6A6]'
                            : 'bg-white border-gray-200 hover:border-[#2EE6A6] shadow-sm'
                        }`}
                      >
                        {link.thumbnailUrl ? (
                          <div className="flex items-center gap-3 p-3">
                            <img
                              src={link.thumbnailUrl}
                              alt={link.title}
                              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className={`font-semibold text-sm truncate ${darkMode ? 'text-white' : 'text-[#111111]'}`}>
                                {link.title}
                              </p>
                              {link.description && (
                                <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>
                                  {link.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="p-4">
                            <p className={`font-semibold text-sm text-center ${darkMode ? 'text-white' : 'text-[#111111]'}`}>
                              {link.title}
                            </p>
                            {link.description && (
                              <p className={`text-xs text-center mt-1 ${darkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>
                                {link.description}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                    {links.slice(2, 4).map((link) => (
                      <div
                        key={link._id}
                        className={`w-full rounded-xl border-2 transition-all cursor-pointer overflow-hidden ${
                          darkMode
                            ? 'bg-gray-800 border-gray-700 hover:border-[#2EE6A6]'
                            : 'bg-white border-gray-200 hover:border-[#2EE6A6] shadow-sm'
                        }`}
                      >
                        {link.thumbnailUrl ? (
                          <div className="flex items-center gap-3 p-3">
                            <img
                              src={link.thumbnailUrl}
                              alt={link.title}
                              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className={`font-semibold text-sm truncate ${darkMode ? 'text-white' : 'text-[#111111]'}`}>
                                {link.title}
                              </p>
                              {link.description && (
                                <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>
                                  {link.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="p-4">
                            <p className={`font-semibold text-sm text-center ${darkMode ? 'text-white' : 'text-[#111111]'}`}>
                              {link.title}
                            </p>
                            {link.description && (
                              <p className={`text-xs text-center mt-1 ${darkMode ? 'text-gray-400' : 'text-[#6B7280]'}`}>
                                {link.description}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>

              <div className="mt-8 text-center">
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-[#6B7280]'}`}>
                  Powered by YNLinks
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-center text-[#6B7280] mt-4">
        Preview updates automatically
      </p>
    </div>
  );
}