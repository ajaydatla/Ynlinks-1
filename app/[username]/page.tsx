'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ExternalLink, Facebook, Instagram, Linkedin, Twitter, Youtube, Copy, Check } from 'lucide-react';
import AdSlot from '@/components/AdSlot';

interface Link {
  _id: string;
  title: string;
  url: string;
  description?: string;
  thumbnailUrl?: string;
  enabled: boolean;
  clicks: number;
}

export default function PublicProfilePage() {
  const params = useParams();
  const username = params?.username as string;
  const [loading, setLoading] = useState(true);
  const [tracked, setTracked] = useState(false);

  const creatorData = useQuery(api.users.getUserByUsername, { username });
  const creatorLinks = useQuery(api.links.getEnabledLinksByUser, { userId: creatorData?._id || '' });
  const trackVisitMutation = useMutation(api.analytics.trackVisit);
  const trackClickMutation = useMutation(api.links.incrementLinkClicks);

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

  const handleLinkClick = async (linkId: string, linkUrl: string) => {
    if (creatorData?._id) {
      trackClickMutation({
        linkId: linkId as any,
        userId: creatorData._id,
      }).catch(console.error);
    }
    window.location.href = linkUrl;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2EE6A6]/10 via-[#FFFDF9] to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2EE6A6]"></div>
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
          <p className="text-[#6B7280] mb-6">This profile doesn&apos;t exist or has been deactivated.</p>
          <a href="/" className="bg-[#2EE6A6] text-white px-8 py-3 rounded-xl hover:bg-[#1FD695] transition font-semibold inline-block">
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2EE6A6]/10 via-[#FFFDF9] to-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <AdSlot adCode="" position="header" />

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
          <div className="text-center mb-8">
            {creatorData.avatarUrl ? (
              <img
                src={creatorData.avatarUrl}
                alt={creatorData.displayName || creatorData.username}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-[#2EE6A6] shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-[#2EE6A6] to-[#1FD695] rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <span className="text-4xl font-bold text-white">
                  {(creatorData.displayName || creatorData.username).charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <h1 className="text-3xl font-display font-bold text-[#111111] mb-1">
              {creatorData.displayName || creatorData.username}
            </h1>
            <p className="text-[#6B7280]">@{creatorData.username}</p>
            {creatorData.bio && (
              <p className="mt-4 text-[#6B7280] max-w-md mx-auto leading-relaxed">{creatorData.bio}</p>
            )}
          </div>

          {/* Social Links */}
          {(creatorData.facebookUrl || creatorData.instagramUrl || creatorData.linkedinUrl || creatorData.twitterUrl || creatorData.youtubeUrl) && (
            <div className="flex items-center justify-center gap-3 mb-6">
              {creatorData.facebookUrl && (
                <a href={creatorData.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
                  <Facebook className="w-5 h-5 text-white" />
                </a>
              )}
              {creatorData.instagramUrl && (
                <a href={creatorData.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
                  <Instagram className="w-5 h-5 text-white" />
                </a>
              )}
              {creatorData.linkedinUrl && (
                <a href={creatorData.linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
              )}
              {creatorData.twitterUrl && (
                <a href={creatorData.twitterUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-black rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
                  <Twitter className="w-5 h-5 text-white" />
                </a>
              )}
              {creatorData.youtubeUrl && (
                <a href={creatorData.youtubeUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
                  <Youtube className="w-5 h-5 text-white" />
                </a>
              )}
            </div>
          )}

          {/* Links */}
          {creatorLinks && creatorLinks.length > 0 ? (
            <div className="space-y-3">
              {creatorLinks.map((link) => (
                <button
                  key={link._id}
                  onClick={() => handleLinkClick(link._id, link.url)}
                  className="w-full bg-gradient-to-r from-[#2EE6A6] to-[#1FD695] hover:from-[#1FD695] hover:to-[#2EE6A6] text-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4 text-left">
                    {link.thumbnailUrl && (
                      <img src={link.thumbnailUrl} alt={link.title} className="w-14 h-14 rounded-xl object-cover shadow" />
                    )}
                    <div>
                      <h3 className="font-bold text-lg">{link.title}</h3>
                      {link.description && (
                        <p className="text-white/80 text-sm mt-0.5">{link.description}</p>
                      )}
                    </div>
                  </div>
                  <ExternalLink className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#6B7280]">No links available yet</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
          <a href="/" className="text-[#6B7280] text-sm hover:text-[#2EE6A6] transition-colors">
            ynlinks/{creatorData.username}
          </a>
        </div>

        <AdSlot adCode="" position="footer" />
      </div>
    </div>
  );
}