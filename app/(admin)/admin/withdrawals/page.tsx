'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function AdminWithdrawalsPage() {
  const { user, isLoaded } = useUser();
  const [statusFilter, setStatusFilter] = useState<string>('');

  const profile = useQuery(api.users.getUserByClerkId, { clerkId: user?.id || '' });
  const withdrawalsQuery = useQuery(api.admin.getAllWithdrawals, { statusFilter: statusFilter || undefined });

  const approveMutation = useMutation(api.admin.approveWithdrawal);
  const rejectMutation = useMutation(api.admin.rejectWithdrawal);

  const [withdrawals, setWithdrawals] = useState<any[]>([]);

  useEffect(() => {
    if (withdrawalsQuery) {
      setWithdrawals(withdrawalsQuery);
    }
  }, [withdrawalsQuery]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" /> Pending</span>;
      case 'approved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Approved</span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" /> Rejected</span>;
      default:
        return null;
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-[#111111] mb-2">Withdrawals</h1>
        <p className="text-[#6B7280]">Review and process withdrawal requests</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['', 'pending', 'approved', 'rejected'].map((status) => (
          <button
            key={status || 'all'}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              statusFilter === status ? 'bg-[#2EE6A6] text-white' : 'bg-gray-100 text-[#6B7280] hover:bg-gray-200'
            }`}
          >
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'All'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Requested</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {withdrawals.map((withdrawal) => (
                <tr key={withdrawal._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-[#111111]">{withdrawal.user?.displayName || 'User'}</p>
                      <p className="text-sm text-[#6B7280]">@{withdrawal.user?.username || 'unknown'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-[#2EE6A6]">₹{withdrawal.amount.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[#111111]">{withdrawal.method || 'N/A'}</span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(withdrawal.status)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#6B7280]">
                      {withdrawal.requestedAt ? new Date(withdrawal.requestedAt).toLocaleDateString('en-IN') : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {withdrawal.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={async () => {
                            if (confirm('Approve this withdrawal?')) {
                              try {
                                await approveMutation({ withdrawalId: withdrawal._id as any });
                              } catch (error: any) {
                                alert(error.message);
                              }
                            }
                          }}
                          className="px-3 py-1 text-sm bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm('Reject this withdrawal?')) {
                              try {
                                await rejectMutation({ withdrawalId: withdrawal._id as any });
                              } catch (error: any) {
                                alert(error.message);
                              }
                            }
                          }}
                          className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {withdrawal.status !== 'pending' && (
                      <span className="text-sm text-[#6B7280]">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {withdrawals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#6B7280]">No withdrawals found</p>
          </div>
        )}
      </div>
    </div>
  );
}