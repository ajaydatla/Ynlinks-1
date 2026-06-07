'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

export default function AdminInquiriesPage() {
  const { user, isLoaded } = useUser();
  const [inquiries, setInquiries] = useState<any[]>([]);

  const profile = useQuery(api.users.getUserByClerkId, { clerkId: user?.id || '' });
  const inquiriesQuery = useQuery(api.admin.getAdvertiserInquiries, {});

  useEffect(() => {
    if (inquiriesQuery) {
      setInquiries(inquiriesQuery);
    }
  }, [inquiriesQuery]);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-[#111111] mb-2">Advertiser Inquiries</h1>
        <p className="text-[#6B7280]">View and manage advertiser contact requests</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {inquiries.map((inquiry) => (
            <div key={inquiry._id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-[#111111]">{inquiry.name}</h3>
                  <p className="text-sm text-[#6B7280]">{inquiry.email}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  inquiry.status === 'new' ? 'bg-blue-100 text-blue-800' :
                  inquiry.status === 'reviewed' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {inquiry.status === 'new' && <Clock className="h-3 w-3 mr-1" />}
                  {inquiry.status === 'reviewed' && <CheckCircle className="h-3 w-3 mr-1" />}
                  {inquiry.status || 'new'}
                </span>
              </div>
              <p className="text-[#111111] mb-3">{inquiry.message}</p>
              <p className="text-xs text-[#6B7280]">
                Received: {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleDateString('en-IN') : '-'}
              </p>
            </div>
          ))}
          {inquiries.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#6B7280]">No inquiries yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}