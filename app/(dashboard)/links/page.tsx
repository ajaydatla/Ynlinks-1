'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useRouter } from 'next/navigation';
import { Plus, X, GripVertical, Edit,  Trash2, BarChart3, Image as ImageIcon, Link2, Search, Pin, Copy, ChevronDown, ChevronRight, Share2, ExternalLink, Archive, Facebook, Instagram, Linkedin, Twitter, Youtube, Pencil, Activity } from 'lucide-react';
import { BioPreview } from '@/components/BioPreview';

interface Link {
  _id: string;
  title: string;
  url: string;
  description?: string;
  thumbnailUrl?: string;
  enabled: boolean;
  archived?: boolean;
  pinned?: boolean;
  clicks: number;
  orderIndex: number;
  userId: string;
  type?: string;
  earned?: number;
  ctr?: number;
}

export default function LinksPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [loading, setLoading] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    thumbnailUrl: '',
    enabled: true,
    type: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const profile = useQuery(api.users.getUserByClerkId, { clerkId: user?.id || '' });
  const linksData = useQuery(api.links.getLinksByUser, { userId: profile?._id || '' });

  const createLinkMutation = useMutation(api.links.createLink);
  const updateLinkMutation = useMutation(api.links.updateLink);
  const deleteLinkMutation = useMutation(api.links.deleteLink);
  const toggleLinkArchivedMutation = useMutation(api.links.toggleLinkArchived);
  const toggleLinkPinnedMutation = useMutation(api.links.toggleLinkPinned);
  const reorderLinksMutation = useMutation(api.links.reorderLinks);

  const links = linksData || [];
  const filteredLinks = links.filter(link =>
    !link.archived &&
    (link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.url.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const archivedLinks = links.filter(l => l.archived);
  const pinnedLinks = filteredLinks.filter(l => l.pinned === true);
  const activeLinks = filteredLinks.filter(l => l.enabled && l.pinned !== true).sort((a, b) => a.orderIndex - b.orderIndex);

  const handleOpenModal = (link?: Link) => {
    const activeLinkCount = links.filter(l => !l.archived).length;
    if (!link && activeLinkCount >= 5) {
      alert('Maximum 5 links allowed.');
      return;
    }

    if (link) {
      setEditingLink(link);
      setFormData({
        title: link.title,
        url: link.url,
        description: link.description || '',
        thumbnailUrl: link.thumbnailUrl || '',
        enabled: link.enabled,
        type: link.type || '',
      });
    } else {
      setEditingLink(null);
      setFormData({ title: '', url: '', description: '', thumbnailUrl: '', enabled: true, type: '' });
    }
    setErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLink(null);
    setFormData({ title: '', url: '', description: '', thumbnailUrl: '', enabled: true, type: '' });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else {
      try { new URL(formData.url); } catch { newErrors.url = 'Please enter a valid URL'; }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !profile) return;
    setLoading(true);
    try {
      if (editingLink) {
        await updateLinkMutation({
          linkId: editingLink._id as Id<"links">,
          title: formData.title,
          url: formData.url,
          description: formData.description || undefined,
          thumbnailUrl: formData.thumbnailUrl || undefined,
          enabled: formData.enabled,
        });
      } else {
        await createLinkMutation({
          userId: profile._id as Id<"links">,
          title: formData.title,
          url: formData.url,
          description: formData.description || undefined,
          thumbnailUrl: formData.thumbnailUrl || undefined,
          enabled: formData.enabled,
        });
      }
      handleCloseModal();
    } catch (error: any) {
      alert(error.message || 'Failed to save link');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (linkId: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    try {
      await deleteLinkMutation({ linkId: linkId as any });
    } catch (error: any) {
      alert(error.message);
    }
  };

  // `archived` argument is the NEXT state (true = archive, false = restore).
  // Pass it through directly — do NOT invert it again here.
  const handleArchive = async (linkId: string, archived: boolean) => {
    try {
      await toggleLinkArchivedMutation({ linkId: linkId as any, archived });
    } catch (error: any) {
      alert(error.message);
    }
  };

  // `pinned` argument is the NEXT state. Pass it through directly.
  const handlePin = async (linkId: string, pinned: boolean) => {
    try {
      await toggleLinkPinnedMutation({ linkId: linkId as any, pinned });
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (id !== dragOverItem) setDragOverItem(id);
  };

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || !targetId || draggedItem === targetId) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }
    const currentLinks = [...links].sort((a, b) => a.orderIndex - b.orderIndex);
    const draggedIndex = currentLinks.findIndex((l) => l._id === draggedItem);
    const targetIndex = currentLinks.findIndex((l) => l._id === targetId);
    if (draggedIndex === -1 || targetIndex === -1) return;
    const newOrder = [...currentLinks];
    const [removed] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, removed);
    try {
      await reorderLinksMutation({ userId: profile?._id || '', linkIds: newOrder.map((l) => l._id as any) });
    } catch (error) {
      console.error('Failed to reorder links:', error);
    }
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  const copyBioLink = () => {
    const bioLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/u/${profile?.username}`;
    navigator.clipboard.writeText(bioLink);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2EE6A6]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-6xl mx-auto ">
        {/* Header */}
        {/* <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#111111]">Links</h1>
            <p className="text-sm text-[#6B7280] mt-0.5">Manage and organize your public links</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-[#6B7280]">{links.filter(l => l.enabled && !l.archived).length} links</span>
            <button
              onClick={() => handleOpenModal()}
              disabled={links.filter(l => !l.archived).length >= 5}
              className={`px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 transition-all ${links.length >= 5
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#111111] text-white hover:bg-black'
                }`}
            >
              <Plus size={16} />
              Add Link
            </button>
          </div>
        </div> */}

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Left Column - Links List */}
          <div className="space-y-5">
            {/* Profile Summary Card — horizontal layout */}
            <div className="bg-cream rounded-2xl border border-gray-200 p-6 shadow-sm">
              {/* Top: avatar (left) + name/bio/socials (right) */}
              <div className="flex items-start gap-4">
                {/* Avatar with green edit badge */}
                <div className="relative flex-shrink-0">
                  {profile?.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile?.displayName || profile?.username || ''}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#2EE6A6] to-[#1FD695] flex items-center justify-center border-4 border-white shadow-md">
                      <span className="text-3xl font-bold text-white">
                        {(profile?.displayName || profile?.username || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => router.push('/design')}
                    className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#2EE6A6] border-2 border-white flex items-center justify-center shadow-md hover:bg-[#1FD695] transition-colors"
                    title="Edit profile"
                  >
                    <Pencil size={12} className="text-white" />
                  </button>
                </div>

                {/* Name + bio + socials */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-[#111111] truncate">
                    {profile?.displayName || profile?.username || 'Your Name'}
                  </h2>
                  <p className="text-sm text-[#6B7280] truncate">
                    @{profile?.username || 'username'}
                  </p>
                  {profile?.bio && (
                    <p className="text-xs  tracking-wider text-[#6B7280] mt-1.5 line-clamp-2">
                      {profile.bio}
                    </p>
                  )}

                  {/* Social icons row (set slots) + Add slot at the end */}
                  <div className="flex items-center gap-2 mt-3">
                    {profile?.instagramUrl && (
                      <a
                        href={profile.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#2EE6A6] hover:text-white text-gray-600 flex items-center justify-center transition-colors"
                        title="Instagram"
                      >
                        <Instagram size={13} />
                      </a>
                    )}
                    {profile?.youtubeUrl && (
                      <a
                        href={profile.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#2EE6A6] hover:text-white text-gray-600 flex items-center justify-center transition-colors"
                        title="YouTube"
                      >
                        <Youtube size={13} />
                      </a>
                    )}
                    {profile?.facebookUrl && (
                      <a
                        href={profile.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#2EE6A6] hover:text-white text-gray-600 flex items-center justify-center transition-colors"
                        title="Facebook"
                      >
                        <Facebook size={13} />
                      </a>
                    )}
                    {profile?.twitterUrl && (
                      <a
                        href={profile.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#2EE6A6] hover:text-white text-gray-600 flex items-center justify-center transition-colors"
                        title="X / Twitter"
                      >
                        <Twitter size={13} />
                      </a>
                    )}
                    {profile?.linkedinUrl && (
                      <a
                        href={profile.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#2EE6A6] hover:text-white text-gray-600 flex items-center justify-center transition-colors"
                        title="LinkedIn"
                      >
                        <Linkedin size={13} />
                      </a>
                    )}
                    {/* Trailing + slot — opens social editor on the design page */}
                    <button
                      type="button"
                      onClick={() => router.push('/design')}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#2EE6A6] hover:text-white text-gray-500 flex items-center justify-center transition-colors"
                      title="Add social link"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Centered, wide "+ Add Link" button — emerald */}
              <button
                type="button"
                onClick={() => handleOpenModal()}
                disabled={links.filter(l => !l.archived).length >= 5}
                className={`mt-5 w-full py-2 rounded-full font-semibold text-base flex items-center justify-center gap-2 transition-all ${
                  links.filter(l => !l.archived).length >= 5
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#2EE6A6] text-white hover:bg-[#1FD695] shadow-sm'
                }`}
              >
                <Plus size={17} />
                Add
              </button>

              {/* Bottom row: Add collection (decorative) + View archive */}
              <div className="flex items-center justify-between mt-4">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#6B7280] hover:text-[#111111] transition-colors"
                  title="Coming soon"
                >
                  <Plus size={14} />
                  Add collection
                </button>
                <button
                  type="button"
                  onClick={() => setShowArchiveModal(true)}
                  disabled={archivedLinks.length === 0}
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                    archivedLinks.length === 0
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-[#2EE6A6] hover:text-[#1FD695]'
                  }`}
                >
                  View archive
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Links Sections */}
            <div className="space-y-6">
              {/* PINNED Section */}
              {pinnedLinks.length > 0 && (
                <div>
                  {/* Section Divider with Badge */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="px-3 py-1 bg-orange-100 text-orange-600 text-xs font-semibold rounded-full flex items-center gap-1.5">
                      <Pin size={11} />
                      PINNED
                    </span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>
                  <div className="space-y-2">
                    {pinnedLinks.map((link) => (
                      <LinkCard
                        key={link._id}
                        link={link}
                        onEdit={handleOpenModal}
                        onDelete={handleDelete}
                        onArchive={handleArchive}
                        onPin={handlePin}
                        onCopy={copyLink}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        draggedItem={draggedItem}
                        dragOverItem={dragOverItem}
                        isPinned
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ALL LINKS Section */}
              {activeLinks.length > 0 && (
                <div>
                  {/* Section Divider with Badge */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="px-3 py-1 bg-[#F5F0E8] text-[#6B7280] text-xs font-semibold rounded-full">
                      ALL LINKS
                    </span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>
                  <div className="space-y-2">
                    {activeLinks.map((link) => (
                      <LinkCard
                        key={link._id}
                        link={link}
                        onEdit={handleOpenModal}
                        onDelete={handleDelete}
                        onArchive={handleArchive}
                        onPin={handlePin}
                        onCopy={copyLink}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        draggedItem={draggedItem}
                        dragOverItem={dragOverItem}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {links.filter(l => !l.archived).length === 0 && (
                <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-16 text-center">
                  <div className="w-16 h-16 bg-[#2EE6A6]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Link2 className="text-[#2EE6A6]" size={32} />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#111111] mb-2">No links yet</h3>
                  <p className="text-[#6B7280] mb-6 max-w-md mx-auto">
                    Add your first link to start building your bio page!
                  </p>
                  <button
                    onClick={() => handleOpenModal()}
                    className="bg-[#111111] text-white px-8 py-3 rounded-full hover:bg-black transition-all inline-flex items-center gap-2 font-semibold"
                  >
                    <Plus size={20} />
                    Add Your First Link
                  </button>
                </div>
              )}

              {/* Add Link Button */}
              {links.filter(l => !l.archived).length > 0 && links.filter(l => !l.archived).length < 5 && (
                <button
                  onClick={() => handleOpenModal()}
                  className="w-full py-8 border-2 border-dashed border-gray-300 rounded-2xl text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Add another link
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Live Preview */}
          {/* <div className="hidden xl:block">
            <div className="sticky top-4">
              <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-[#6B7280]">Live Preview</span>
                </div>
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
                  userLinks={links}
                  theme={(profile?.theme as any) || 'parchment'}
                  buttonStyle={(profile?.buttonStyle as any) || 'pill'}
                  fontStyle={(profile?.fontStyle as any) || 'dm-sans'}
                />
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-[#111111] hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5">
                    <Share2 size={13} />
                    Share
                  </button>
                  <button onClick={copyBioLink} className="flex-1 py-2 bg-[#111111] text-white rounded-lg text-xs font-medium hover:bg-black transition-colors flex items-center justify-center gap-1.5">
                    <ExternalLink size={13} />
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
          </div> */}

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
                userLinks={links}
                theme={(profile?.theme as any) || 'parchment'}
                buttonStyle={(profile?.buttonStyle as any) || 'pill'}
                fontStyle={(profile?.fontStyle as any) || 'dm-sans'}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Preview Toggle */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            const preview = document.getElementById('mobile-links-preview');
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
      <div id="mobile-links-preview" className="xl:hidden fixed inset-0 z-40 bg-black/50 hidden">
        <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] bg-gray-50 rounded-t-3xl overflow-y-auto">
          <div className="sticky top-0 bg-gray-50 p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-[#111111]">Live Preview</h3>
            <button
              onClick={() => {
                const preview = document.getElementById('mobile-links-preview');
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
              userLinks={links}
              theme={(profile?.theme as any) || 'parchment'}
              buttonStyle={(profile?.buttonStyle as any) || 'pill'}
              fontStyle={(profile?.fontStyle as any) || 'dm-sans'}
            />
          </div>
        </div>
      </div>

      {/* Archive Modal */}
      {showArchiveModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-lg font-bold text-[#111111]">Archived Links</h2>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  {archivedLinks.length} {archivedLinks.length === 1 ? 'link' : 'links'} archived
                </p>
              </div>
              <button
                onClick={() => setShowArchiveModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Body — scrollable list of archived LinkCards */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {archivedLinks.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Archive size={24} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-[#6B7280]">No archived links</p>
                </div>
              ) : (
                archivedLinks.map((link) => (
                  <LinkCard
                    key={link._id}
                    link={link}
                    onEdit={handleOpenModal}
                    onDelete={handleDelete}
                    onArchive={handleArchive}
                    onPin={handlePin}
                    onCopy={copyLink}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    draggedItem={draggedItem}
                    dragOverItem={dragOverItem}
                    isArchived
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] rounded-3xl shadow-2xl max-w-lg w-full">
            <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-serif font-bold text-[#111111]">
                {editingLink ? 'Edit Link' : 'Add New Link'}
              </h2>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                <X size={22} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., My YouTube Channel"
                    className={`w-full border-2 ${errors.title ? 'border-red-300' : 'border-gray-200'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2EE6A6] bg-white`}
                  />
                  {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-2">URL *</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://example.com"
                    className={`w-full border-2 ${errors.url ? 'border-red-300' : 'border-gray-200'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2EE6A6] bg-white`}
                  />
                  {errors.url && <p className="text-xs text-red-500 mt-1">{errors.url}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-2">Thumbnail (Optional)</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file || file.size > 2 * 1024 * 1024) {
                          alert('Image size should be less than 2MB');
                          return;
                        }
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData({ ...formData, thumbnailUrl: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label htmlFor="thumbnail-upload" className="cursor-pointer">
                      {formData.thumbnailUrl ? (
                        <div className="w-20 h-20 rounded-xl border-2 border-[#2EE6A6] overflow-hidden bg-white">
                          <img src={formData.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-white rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-[#2EE6A6] transition-colors">
                          <ImageIcon size={28} className="text-gray-400" />
                        </div>
                      )}
                    </label>
                    <span className="text-xs text-[#6B7280]">Max 2MB</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-4 border-y border-gray-200">
                  <span className="text-sm font-semibold text-[#111111]">Show on bio page</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, enabled: !formData.enabled })}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${formData.enabled ? 'bg-[#111111]' : 'bg-gray-300'
                      }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${formData.enabled ? 'translate-x-7' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-200 text-[#111111] px-6 py-3.5 rounded-xl hover:bg-gray-300 transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#111111] text-white px-6 py-3.5 rounded-xl hover:bg-black transition-all font-semibold shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingLink ? 'Update Link' : 'Add Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Link Card Component
function LinkCard({
  link,
  onEdit,
  onDelete,
  onCopy,
  onArchive,
  onPin,
  onDragStart,
  onDragOver,
  onDrop,
  draggedItem,
  dragOverItem,
  isArchived,
  isPinned,
}: {
  link: Link;
  onEdit: (link: Link) => void;
  onDelete: (id: string) => void;
  onCopy: (url: string) => void;
  onArchive: (id: string, archived: boolean) => void;
  onPin: (id: string, pinned: boolean) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent, id: string) => void;
  onDrop: (e: React.DragEvent, id: string) => void;
  draggedItem: string | null;
  dragOverItem: string | null;
  isArchived?: boolean;
  isPinned?: boolean;
}) {
  // Display hostname from the link URL for a clean look
  const safeUrl = link.url || '';
  let displayUrl = safeUrl;
  try {
    const u = new URL(safeUrl);
    displayUrl = u.hostname.replace(/^www\./, '') + (u.pathname !== '/' ? u.pathname : '');
  } catch {
    // not a parseable URL — fall back to the raw string
  }

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, link._id)}
      onDragOver={(e) => onDragOver(e, link._id)}
      onDrop={(e) => onDrop(e, link._id)}
      className={`bg-white rounded-2xl border transition-all ${isArchived ? 'opacity-60 bg-gray-50' :
          isPinned ? 'border-[#111111] shadow' :
            draggedItem === link._id ? 'opacity-50 border-[#2EE6A6]' :
              dragOverItem === link._id ? 'border-[#2EE6A6]' :
                'border-gray-200 hover:border-gray-300'
        }`}
    >
      {/* ── Top row: drag handle + thumbnail + title/url ── */}
      <div className="flex items-start gap-3 p-4 pb-3">
        {/* Drag Handle */}
        {!isArchived && (
          <div className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 flex-shrink-0 pt-0.5">
            <GripVertical size={16} />
          </div>
        )}

        {/* Thumbnail */}
        {link.thumbnailUrl ? (
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            <img src={link.thumbnailUrl} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-[#2EE6A6]/10 flex items-center justify-center flex-shrink-0">
            <Link2 size={16} className="text-[#2EE6A6]" />
          </div>
        )}

        {/* Title + URL */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-[#111111] text-sm truncate leading-tight">
            {link.title}
          </h3>
          <p className="text-xs text-[#6B7280] truncate mt-0.5">
            {displayUrl}
          </p>
        </div>
      </div>

      {/* ── Middle row: clicks badge + analytics + CTR % ── */}
      <div className="flex items-center gap-3 px-4 pb-3">
        {/* Clicks pill */}
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-full text-[11px] font-semibold text-[#111111]">
          <BarChart3 size={11} className="text-gray-500" />
          {link.clicks || 0} clicks
        </span>
        {link.earned ? (
          <span className="text-[11px] text-[#6B7280] font-medium">
            ₹{link.earned}
          </span>
        ) : null}

        <div className="ml-auto flex-shrink-0">
          {isArchived ? (
            <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              ARCHIVED
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-full text-[11px] font-semibold text-[#111111]">
              <Activity size={11} />
              {link.ctr || 0}% CTR
            </span>
          )}
        </div>
      </div>

      {/* ── Bottom row: utility actions ── */}
      <div className="flex items-center justify-start gap-0.5 px-3 py-2 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
        {!isArchived && (
          <>
            <button
              onClick={() => onPin(link._id, !link.pinned)}
              className={`p-1.5 rounded-lg transition-colors ${link.pinned
                  ? 'text-orange-500 bg-orange-100'
                  : 'text-gray-400 hover:text-[#111111] hover:bg-white'
                }`}
              title={link.pinned ? 'Unpin' : 'Pin'}
            >
              <Pin size={14} />
            </button>
            <button
              onClick={() => onEdit(link)}
              className="p-1.5 text-gray-400 hover:text-[#111111] hover:bg-white rounded-lg transition-colors"
              title="Edit"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={() => onCopy(link.url)}
              className="p-1.5 text-gray-400 hover:text-[#111111] hover:bg-white rounded-lg transition-colors"
              title="Copy URL"
            >
              <Copy size={14} />
            </button>
          </>
        )}
        {isArchived ? (
          <button
            onClick={() => onArchive(link._id, false)}
            className="p-1.5 text-green-600 hover:text-green-700 hover:bg-white rounded-lg transition-colors"
            title="Restore"
          >
            <Archive size={14} />
          </button>
        ) : (
          <button
            onClick={() => onArchive(link._id, true)}
            className="p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-white rounded-lg transition-colors"
            title="Archive"
          >
            <Archive size={14} />
          </button>
        )}
        <button
          onClick={() => onDelete(link._id)}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}