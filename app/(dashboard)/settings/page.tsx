'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Save, User, Copy, Camera, Settings2, UserCircle, Link2, Shield, AlertTriangle, Download, Trash2, ChevronUp, ChevronDown, ExternalLink } from 'lucide-react';

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    avatarUrl: '',
    phone: '',
  });
  const [pageSettings, setPageSettings] = useState({
    pageVisible: true,
    showBranding: true,
    allowIndexing: true,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [advancedExpanded, setAdvancedExpanded] = useState(true);
  const [dangerExpanded, setDangerExpanded] = useState(true);

  const profile = useQuery(api.users.getUserByClerkId, { clerkId: user?.id || '' });
  const updateUserMutation = useMutation(api.users.updateUserProfile);
  const updatePageSettingsMutation = useMutation(api.users.updatePageSettings);
  const clearAllLinksMutation = useMutation(api.users.clearAllLinks);
  const deleteAccountMutation = useMutation(api.users.deleteAccount);
  const exportUserData = useQuery(api.users.exportUserData, profile?._id ? { userId: profile._id } : "skip");
  const userLinks = useQuery(api.links.getLinksByUser, { userId: profile?._id || '' });

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || profile.username || '',
        bio: profile.bio || '',
        avatarUrl: profile.avatarUrl || '',
        phone: profile.phone || '',
      });
      setPageSettings({
        pageVisible: profile.pageVisible !== false,
        showBranding: profile.showBranding !== false,
        allowIndexing: profile.allowIndexing !== false,
      });
    }
  }, [profile]);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setLoading(true);
    setSuccess(false);

    try {
      await updateUserMutation({
        userId: profile._id,
        displayName: formData.displayName,
        bio: formData.bio || undefined,
        avatarUrl: formData.avatarUrl || undefined,
        phone: formData.phone || undefined,
      });
      await updatePageSettingsMutation({
        userId: profile._id,
        pageVisible: pageSettings.pageVisible,
        showBranding: pageSettings.showBranding,
        allowIndexing: pageSettings.allowIndexing,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePageSetting = async (key: 'pageVisible' | 'showBranding' | 'allowIndexing') => {
    if (!profile) return;
    const newValue = !pageSettings[key];
    setPageSettings({ ...pageSettings, [key]: newValue });

    try {
      await updatePageSettingsMutation({
        userId: profile._id,
        [key]: newValue,
      });
    } catch (error) {
      // Revert on error
      setPageSettings({ ...pageSettings, [key]: !newValue });
      console.error('Failed to update setting:', error);
    }
  };

  const handleClearAllLinks = async () => {
    if (!profile) return;
    if (!confirm('Are you sure you want to clear all your links? This action cannot be undone.')) return;

    try {
      const result = await clearAllLinksMutation({ userId: profile._id });
      alert(`Successfully cleared ${result.deleted} links`);
      router.refresh();
    } catch (error) {
      alert('Failed to clear links: ' + (error as Error).message);
    }
  };

  const handleExportData = async () => {
    if (!profile || !exportUserData) return;

    try {
      const exportPayload = {
        user: {
          username: profile.username,
          displayName: profile.displayName,
          email: profile.email,
          createdAt: profile.createdAt,
          theme: profile.theme,
          bio: profile.bio,
        },
        links: userLinks || [],
        exportedAt: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ynlinks-data-${profile.username}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to export data: ' + (error as Error).message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!profile) return;
    const confirmation = prompt('Type "DELETE" to confirm account deletion:');
    if (confirmation !== 'DELETE') {
      alert('Account deletion cancelled.');
      return;
    }

    if (!confirm('FINAL WARNING: This will permanently delete your account and all data. This cannot be undone. Are you absolutely sure?')) return;

    try {
      await deleteAccountMutation({ userId: profile._id });
      alert('Your account has been deleted. Redirecting...');
      window.location.href = '/';
    } catch (error) {
      alert('Failed to delete account: ' + (error as Error).message);
    }
  };

  const bioLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/u/${profile?.username}`;

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2EE6A6]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#111111]">Settings</h1>
        <p className="text-sm text-[#6B7280] mt-1">Manage your profile and account preferences</p>
      </div>

      {/* Profile Photo Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 bg-[#2EE6A6]/10 rounded-xl flex items-center justify-center">
            <UserCircle className="w-5 h-5 text-[#2EE6A6]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#111111]">Profile Photo</h2>
            <p className="text-xs text-[#6B7280]">Your profile picture appears on your public page</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageUpload}
            className="hidden"
            id="profile-photo-upload"
          />
          <label htmlFor="profile-photo-upload" className="cursor-pointer group relative">
            {formData.avatarUrl ? (
              <div className="relative">
                <img
                  src={formData.avatarUrl}
                  alt={profile?.username}
                  className="w-28 h-28 rounded-2xl object-cover border-2 border-[#2EE6A6]/30 shadow-md group-hover:opacity-75 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl bg-black/40">
                  <div className="bg-white rounded-full p-3 shadow-lg">
                    <Camera className="h-5 w-5 text-[#111111]" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-28 h-28 bg-gradient-to-br from-[#2EE6A6] to-[#1FD695] rounded-2xl flex items-center justify-center border-2 border-[#2EE6A6]/30 shadow-md group-hover:opacity-90 transition-opacity">
                <User className="h-12 w-12 text-white" />
              </div>
            )}
          </label>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-[#111111]">{profile?.displayName || profile?.username}</h3>
            <p className="text-sm text-[#6B7280] mb-3">@{profile?.username}</p>
            <p className="text-xs text-[#6B7280] bg-gray-50 px-3 py-2 rounded-lg inline-block">
              Click the image to change your photo (max 2MB)
            </p>
          </div>
        </div>
      </div>

      {/* Profile Info Form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 bg-[#2EE6A6]/10 rounded-xl flex items-center justify-center">
            <Settings2 className="w-5 h-5 text-[#2EE6A6]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#111111]">Profile Information</h2>
            <p className="text-xs text-[#6B7280]">Update your personal details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-[#111111] mb-2">Display Name</label>
              <input
                type="text"
                required
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2EE6A6] focus:border-transparent transition-all bg-gray-50/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111111] mb-2">Mobile Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+911234567890"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2EE6A6] focus:border-transparent transition-all bg-gray-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111111] mb-2">
              Bio <span className="text-[#6B7280] font-normal">(Max 80 characters)</span>
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => {
                if (e.target.value.length <= 80) {
                  setFormData({ ...formData, bio: e.target.value });
                }
              }}
              rows={3}
              placeholder="Tell people about yourself..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2EE6A6] focus:border-transparent transition-all bg-gray-50/50 resize-none"
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-[#6B7280]">Include country code (e.g., +91 for India, +1 for USA)</span>
              <span className={`text-xs font-medium ${formData.bio.length > 70 ? 'text-red-500' : 'text-[#6B7280]'}`}>
                {80 - formData.bio.length} remaining
              </span>
            </div>
          </div>

          {success && (
            <div className="bg-[#2EE6A6]/10 border border-[#2EE6A6]/30 rounded-xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-[#2EE6A6] rounded-full flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-[#111111] font-medium text-sm">Settings saved successfully!</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto bg-[#111111] text-white px-8 py-3 rounded-xl hover:bg-black transition-all font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Account Details */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 bg-[#2EE6A6]/10 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#2EE6A6]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#111111]">Account Details</h2>
            <p className="text-xs text-[#6B7280]">Your account information (read-only)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-2">Email</label>
            <input
              type="email"
              value={profile?.email || user?.emailAddresses[0]?.emailAddress || ''}
              disabled
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-100 text-[#6B7280] cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-2">Username</label>
            <input
              type="text"
              value={profile?.username || ''}
              disabled
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-100 text-[#6B7280] cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Profile URL */}
      <div className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#2EE6A6] rounded-xl flex items-center justify-center">
            <Link2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Your Public Profile</h2>
            <p className="text-xs text-gray-400">Share this link with your audience</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={bioLink}
            disabled
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white/80 font-mono text-sm"
          />
          <button
            type="button"
            onClick={() => copyToClipboard(bioLink)}
            className="px-6 py-3 bg-[#2EE6A6] text-[#111111] rounded-xl hover:bg-[#1FD695] transition-all flex items-center justify-center gap-2 font-semibold shadow-lg whitespace-nowrap"
          >
            <Copy className="h-4 w-4" />
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>

      {/* Advanced & Danger Zone */}
      <div className="space-y-4">
        {/* Page Settings Section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <button
            onClick={() => setAdvancedExpanded(!advancedExpanded)}
            className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              {/* <div className="w-12 h-12 bg-[#111111] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">5</span>
              </div> */}
              <div className="text-left">
                <h2 className="text-xl font-serif font-bold text-[#111111]">Advanced & Danger Zone</h2>
                <p className="text-sm text-[#6B7280]">privacy, data export and account deletion</p>
              </div>
            </div>
            {advancedExpanded ? (
              <ChevronUp className="w-6 h-6 text-gray-400" />
            ) : (
              <ChevronDown className="w-6 h-6 text-gray-400" />
            )}
          </button>

          {advancedExpanded && (
            <div className="border-t border-gray-200">
              {/* Page Settings */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-serif font-bold text-[#111111] mb-4">Page Settings</h3>
                <div className="space-y-4">
                  {/* Page Visible */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-semibold text-[#111111]">Page visible to public</p>
                      <p className="text-sm text-[#6B7280]">Turn off to hide your page</p>
                    </div>
                    <button
                      onClick={() => handleTogglePageSetting('pageVisible')}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                        pageSettings.pageVisible ? 'bg-[#111111]' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                          pageSettings.pageVisible ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Show Branding */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-semibold text-[#111111]">Show YNLinks branding</p>
                      <p className="text-sm text-[#6B7280]">"Powered by YNLinks" on your page</p>
                    </div>
                    <button
                      onClick={() => handleTogglePageSetting('showBranding')}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                        pageSettings.showBranding ? 'bg-[#111111]' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                          pageSettings.showBranding ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Allow Indexing */}
                  {/* <div className="flex items-center justify-between py-3 last:border-0">
                    <div>
                      <p className="font-semibold text-[#111111]">Search engine indexing</p>
                      <p className="text-sm text-[#6B7280]">Allow Google to index your page</p>
                    </div>
                    <button
                      onClick={() => handleTogglePageSetting('allowIndexing')}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                        pageSettings.allowIndexing ? 'bg-[#111111]' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                          pageSettings.allowIndexing ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div> */}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="p-6 bg-red-50/50">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h3 className="text-lg font-serif font-bold text-red-700">Danger Zone</h3>
                </div>
                <p className="text-sm text-[#6B7280] mb-4">These actions are permanent and cannot be undone.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleClearAllLinks}
                    className="px-5 py-3 bg-white border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-all font-semibold flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All Links
                  </button>
                  <button
                    onClick={handleExportData}
                    className="px-5 py-3 bg-white border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-all font-semibold flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export My Data
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-5 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-semibold flex items-center justify-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Account Stats */}
        <div className="bg-[#F5F0E8] rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-[#111111] mb-4">Account Information</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-xl">
              <p className="text-2xl font-bold text-[#111111] capitalize">{profile?.status || 'active'}</p>
              <p className="text-xs text-[#6B7280] mt-1">Status</p>
            </div>
            <div className="text-center p-4 bg-white rounded-xl">
              <p className="text-2xl font-bold text-[#111111] capitalize">{profile?.role || 'creator'}</p>
              <p className="text-xs text-[#6B7280] mt-1">Role</p>
            </div>
            <div className="text-center p-4 bg-white rounded-xl">
              <p className="text-2xl font-bold text-[#111111]">
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '-'}
              </p>
              <p className="text-xs text-[#6B7280] mt-1">Member Since</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}