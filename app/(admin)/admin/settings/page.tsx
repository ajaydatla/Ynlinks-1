'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Save } from 'lucide-react';

export default function AdminSettingsPage() {
  const { user, isLoaded } = useUser();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const profile = useQuery(api.users.getUserByClerkId, { clerkId: user?.id || '' });
  const settingsQuery = useQuery(api.admin.getSettings, {});
  const updateSettingMutation = useMutation(api.admin.updateSetting);

  useEffect(() => {
    if (settingsQuery) {
      const settingsMap: Record<string, string> = {};
      settingsQuery.forEach((s) => {
        settingsMap[s.key] = s.value;
      });
      setSettings(settingsMap);
    }
  }, [settingsQuery]);

  const handleSave = async (key: string, value: string) => {
    setLoading(true);
    try {
      await updateSettingMutation({ key, value });
      setSettings((prev) => ({ ...prev, [key]: value }));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to save setting:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2EE6A6]"></div>
      </div>
    );
  }

  if (!profile?.isAdmin) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
        <p className="text-gray-600">You do not have permission to access this page.</p>
      </div>
    );
  }

  const platformSettings = [
    { key: 'min_withdrawal', label: 'Minimum Withdrawal (₹)', type: 'number' },
    { key: 'payout_rate', label: 'Payout Rate per Click (₹)', type: 'number' },
    { key: 'custom_domain', label: 'Custom Domain', type: 'text' },
    { key: 'telegram_support_link', label: 'Telegram Support Link', type: 'text' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-[#111111] mb-2">Settings</h1>
        <p className="text-[#6B7280]">Configure platform settings</p>
      </div>

      {success && (
        <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-xl">
          Settings saved successfully!
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#111111] mb-4">Platform Configuration</h2>
        <div className="space-y-4">
          {platformSettings.map((setting) => (
            <div key={setting.key} className="flex items-center gap-4">
              <label className="w-64 text-sm font-medium text-[#111111]">{setting.label}</label>
              <input
                type={setting.type}
                value={settings[setting.key] || ''}
                onChange={(e) => setSettings((prev) => ({ ...prev, [setting.key]: e.target.value }))}
                onBlur={(e) => handleSave(setting.key, e.target.value)}
                className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2EE6A6] focus:border-transparent"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-[#111111] mb-4">Ad Configuration</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-2">Header Ad Code</label>
            <textarea
              value={settings['ad_code_header'] || ''}
              onChange={(e) => setSettings((prev) => ({ ...prev, ad_code_header: e.target.value }))}
              onBlur={(e) => handleSave('ad_code_header', e.target.value)}
              rows={4}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2EE6A6] focus:border-transparent font-mono text-sm"
              placeholder="Paste your ad code here..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-2">Sidebar Ad Code</label>
            <textarea
              value={settings['ad_code_sidebar'] || ''}
              onChange={(e) => setSettings((prev) => ({ ...prev, ad_code_sidebar: e.target.value }))}
              onBlur={(e) => handleSave('ad_code_sidebar', e.target.value)}
              rows={4}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2EE6A6] focus:border-transparent font-mono text-sm"
              placeholder="Paste your ad code here..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-2">Footer Ad Code</label>
            <textarea
              value={settings['ad_code_footer'] || ''}
              onChange={(e) => setSettings((prev) => ({ ...prev, ad_code_footer: e.target.value }))}
              onBlur={(e) => handleSave('ad_code_footer', e.target.value)}
              rows={4}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2EE6A6] focus:border-transparent font-mono text-sm"
              placeholder="Paste your ad code here..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}