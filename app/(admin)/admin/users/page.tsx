'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Search, CheckCircle, XCircle, Clock, Plus, X } from 'lucide-react';
import Link from 'next/link';

interface UserType {
  _id: string;
  username: string;
  displayName?: string;
  email: string;
  avatarUrl?: string;
  status?: string;
  balance?: number;
  createdAt?: string;
}

export default function AdminUsersPage() {
  const { user, isLoaded } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const profile = useQuery(api.users.getUserByClerkId, { clerkId: user?.id || '' });
  const usersQuery = useQuery(api.admin.getAllUsers, { statusFilter: statusFilter || undefined });

  const addBonusMutation = useMutation(api.admin.addBonus);
  const updateUserMutation = useMutation(api.admin.updateUser);

  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    if (usersQuery) {
      setUsers(usersQuery);
    }
  }, [usersQuery]);

  const filteredUsers = users.filter(u =>
    u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <h1 className="text-2xl font-display font-bold text-[#111111] mb-2">Users</h1>
        <p className="text-[#6B7280]">Manage all registered users</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EE6A6] focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EE6A6] focus:border-transparent"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
          <option value="paused">Paused</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.username} className="w-10 h-10 rounded-full" />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-[#2EE6A6] to-[#1FD695] rounded-full flex items-center justify-center text-white font-semibold">
                          {(user.displayName || user.username).charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-[#111111]">{user.displayName || user.username}</p>
                        <p className="text-sm text-[#6B7280]">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' :
                      user.status === 'banned' ? 'bg-red-100 text-red-800' :
                      user.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status || 'active'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-[#2EE6A6]">₹{(user.balance || 0).toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/users/${user.username}`}
                        className="px-3 py-1 text-sm bg-[#2EE6A6]/10 text-[#2EE6A6] rounded-lg hover:bg-[#2EE6A6]/20 transition-colors"
                      >
                        View
                      </Link>
                      <button
                        onClick={async () => {
                          const amount = prompt('Enter bonus amount:');
                          if (amount && !isNaN(parseFloat(amount))) {
                            try {
                              await addBonusMutation({ userId: user._id as any, amount: parseFloat(amount) });
                              alert('Bonus added successfully');
                            } catch (error: any) {
                              alert(error.message);
                            }
                          }
                        }}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        Add Bonus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#6B7280]">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}