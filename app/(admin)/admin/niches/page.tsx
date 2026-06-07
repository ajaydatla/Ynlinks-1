'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Plus, X } from 'lucide-react';

export default function AdminNichesPage() {
  const { user, isLoaded } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '', customDomain: '', adCode: '' });
  const [loading, setLoading] = useState(false);

  const profile = useQuery(api.users.getUserByClerkId, { clerkId: user?.id || '' });
  const nichesQuery = useQuery(api.admin.getNiches, {});
  const createNicheMutation = useMutation(api.admin.createNiche);

  const [niches, setNiches] = useState<any[]>([]);

  useEffect(() => {
    if (nichesQuery) {
      setNiches(nichesQuery);
    }
  }, [nichesQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createNicheMutation({
        name: formData.name,
        slug: formData.slug,
        customDomain: formData.customDomain || undefined,
        adCode: formData.adCode || undefined,
      });
      setShowModal(false);
      setFormData({ name: '', slug: '', customDomain: '', adCode: '' });
    } catch (error) {
      console.error('Failed to create niche:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2EE6A6]" />;
  }

  if (!profile?.isAdmin) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#111111] mb-2">Niches</h1>
          <p className="text-[#6B7280]">Manage platform niches</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#2EE6A6] text-white px-4 py-2 rounded-xl hover:bg-[#1FD695] transition-all font-semibold"
        >
          <Plus className="w-5 h-5" /> Add Niche
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {niches.map((niche) => (
          <div key={niche._id} className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-[#111111] mb-2">{niche.name}</h3>
            <p className="text-sm text-[#6B7280] mb-2">Slug: {niche.slug}</p>
            {niche.customDomain && <p className="text-sm text-[#6B7280]">Domain: {niche.customDomain}</p>}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#111111]/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#111111]">Add Niche</h2>
              <button onClick={() => setShowModal(false)}><X size={24} className="text-[#6B7280]" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-2">Slug</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-2">Custom Domain</label>
                <input
                  type="text"
                  value={formData.customDomain}
                  onChange={(e) => setFormData({ ...formData, customDomain: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2EE6A6] text-white px-6 py-3 rounded-xl hover:bg-[#1FD695] transition-all font-semibold"
              >
                {loading ? 'Creating...' : 'Create Niche'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}