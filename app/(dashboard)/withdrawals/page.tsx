'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Wallet, Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';

interface Withdrawal {
  _id: string;
  amount: number;
  method: string;
  details: Record<string, any>;
  status: string;
  requestedAt?: string;
  processedAt?: string;
}

export default function WithdrawalsPage() {
  const { user, isLoaded } = useUser();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [minWithdrawal, setMinWithdrawal] = useState(150);
  const [payoutRate, setPayoutRate] = useState(0.10);
  const [formData, setFormData] = useState({
    amount: '',
    method: 'UPI' as 'UPI' | 'Bank' | 'Binance' | 'Payoneer',
    upiId: '',
    accountNumber: '',
    ifscCode: '',
    accountName: '',
    walletAddress: '',
    email: '',
  });

  const profile = useQuery(api.users.getUserByClerkId, { clerkId: user?.id || '' });
  const convexWithdrawals = useQuery(api.withdrawals.getUserWithdrawals, { userId: profile?._id || '' });

  const minWithdrawalSetting = useQuery(api.admin.getSettingByKey, { key: 'min_withdrawal' });
  const payoutRateSetting = useQuery(api.admin.getSettingByKey, { key: 'payout_rate' });

  const requestWithdrawalMutation = useMutation(api.withdrawals.requestWithdrawal);
  const updateUserProfileMutation = useMutation(api.users.updateUserProfile);

  useEffect(() => {
    if (minWithdrawalSetting?.value) {
      setMinWithdrawal(parseFloat(minWithdrawalSetting.value));
    }
    if (payoutRateSetting?.value) {
      setPayoutRate(parseFloat(payoutRateSetting.value));
    }
  }, [minWithdrawalSetting, payoutRateSetting]);

  useEffect(() => {
    if (convexWithdrawals) {
      setWithdrawals(convexWithdrawals);
    }
  }, [convexWithdrawals]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    const amount = parseFloat(formData.amount);

    if (amount < minWithdrawal) {
      alert(`Minimum withdrawal amount is ₹${minWithdrawal}`);
      return;
    }

    const currentBalance = profile.balance || 0;
    if (amount > currentBalance) {
      alert('Insufficient balance');
      return;
    }

    setLoading(true);

    let details: Record<string, any> = {};
    switch (formData.method) {
      case 'UPI':
        details = { upiId: formData.upiId };
        break;
      case 'Bank':
        details = {
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode,
          accountName: formData.accountName,
        };
        break;
      case 'Binance':
        details = { walletAddress: formData.walletAddress };
        break;
      case 'Payoneer':
        details = { email: formData.email };
        break;
    }

    try {
      await requestWithdrawalMutation({
        userId: profile._id,
        amount,
        method: formData.method,
        details,
      });

      setFormData({
        amount: '',
        method: 'UPI',
        upiId: '',
        accountNumber: '',
        ifscCode: '',
        accountName: '',
        walletAddress: '',
        email: '',
      });
      setShowRequestForm(false);
    } catch (error: any) {
      alert(error.message || 'Failed to submit withdrawal');
    } finally {
      setLoading(false);
    }
  };

  const currentBalance = profile?.balance || 0;
  const canWithdraw = currentBalance >= minWithdrawal;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </span>
        );
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

  return (
    <div className="max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {!showRequestForm && canWithdraw && (
            <button
              onClick={() => setShowRequestForm(true)}
              className="w-full bg-[#2EE6A6] text-white px-6 py-4 rounded-2xl hover:bg-[#1FD695] transition-all font-semibold text-lg shadow-lg flex items-center justify-center gap-3"
            >
              <Wallet className="h-6 w-6" />
              Request Withdrawal
            </button>
          )}

          {!canWithdraw && (
            <div className="bg-[#FDE047]/20 border-2 border-[#FDE047]/40 rounded-2xl p-6">
              <h3 className="text-lg font-display font-bold text-[#111111] mb-2">Minimum balance not reached</h3>
              <p className="text-[#111111]">
                You need ₹{minWithdrawal} to request a withdrawal. Current balance: ₹{currentBalance.toFixed(2)}
              </p>
              <p className="text-[#6B7280] text-sm mt-2">
                ₹{(minWithdrawal - currentBalance).toFixed(2)} more to go!
              </p>
            </div>
          )}

          {showRequestForm && (
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-[#111111]">Request Withdrawal</h2>
                <button onClick={() => setShowRequestForm(false)} className="text-[#6B7280] hover:text-[#111111] transition-colors font-semibold">
                  Cancel
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-2">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min={minWithdrawal}
                    max={currentBalance}
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder={`Min: ₹${minWithdrawal}, Max: ₹${currentBalance.toFixed(2)}`}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2EE6A6] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-2">Payment Method</label>
                  <select
                    value={formData.method}
                    onChange={(e) => setFormData({ ...formData, method: e.target.value as any })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2EE6A6] focus:border-transparent transition-all"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Bank">Bank Transfer</option>
                    <option value="Binance">Binance</option>
                    <option value="Payoneer">Payoneer</option>
                  </select>
                </div>

                {formData.method === 'UPI' && (
                  <div>
                    <label className="block text-sm font-semibold text-[#111111] mb-2">UPI ID</label>
                    <input
                      type="text"
                      required
                      value={formData.upiId}
                      onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                      placeholder="yourname@upi"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2EE6A6] focus:border-transparent transition-all"
                    />
                  </div>
                )}

                {formData.method === 'Bank' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-[#111111] mb-2">Account Holder Name</label>
                      <input
                        type="text"
                        required
                        value={formData.accountName}
                        onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2EE6A6] focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#111111] mb-2">Account Number</label>
                      <input
                        type="text"
                        required
                        value={formData.accountNumber}
                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2EE6A6] focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#111111] mb-2">IFSC Code</label>
                      <input
                        type="text"
                        required
                        value={formData.ifscCode}
                        onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2EE6A6] focus:border-transparent transition-all"
                      />
                    </div>
                  </>
                )}

                {formData.method === 'Binance' && (
                  <div>
                    <label className="block text-sm font-semibold text-[#111111] mb-2">Wallet Address</label>
                    <input
                      type="text"
                      required
                      value={formData.walletAddress}
                      onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                      placeholder="0x..."
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2EE6A6] focus:border-transparent transition-all"
                    />
                  </div>
                )}

                {formData.method === 'Payoneer' && (
                  <div>
                    <label className="block text-sm font-semibold text-[#111111] mb-2">Payoneer Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2EE6A6] focus:border-transparent transition-all"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2EE6A6] text-white px-6 py-3 rounded-xl hover:bg-[#1FD695] transition-all font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Withdrawal Request'}
                </button>
              </form>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-display font-bold text-[#111111]">Withdrawal History</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {withdrawals.length === 0 ? (
                <div className="p-12 text-center">
                  <Wallet className="h-16 w-16 text-[#6B7280] mx-auto mb-4" />
                  <p className="text-[#6B7280] font-medium">No withdrawal requests yet</p>
                </div>
              ) : (
                withdrawals.map((withdrawal) => (
                  <div key={withdrawal._id} className="p-6 hover:bg-[#FFFDF9] transition">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-lg font-display font-bold text-[#111111]">₹{withdrawal.amount.toFixed(2)}</div>
                        <div className="text-sm text-[#6B7280]">{withdrawal.method}</div>
                      </div>
                      {getStatusBadge(withdrawal.status)}
                    </div>
                    <div className="text-sm text-[#6B7280]">
                      Requested: {withdrawal.requestedAt ? new Date(withdrawal.requestedAt).toLocaleDateString('en-IN', {
                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
                      }) : '-'}
                    </div>
                    {withdrawal.processedAt && (
                      <div className="text-sm text-[#6B7280]">
                        Processed: {new Date(withdrawal.processedAt).toLocaleDateString('en-IN', {
                          year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
                        })}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-gradient-to-br from-[#2EE6A6]/10 to-[#2EE6A6]/5 border-2 border-[#2EE6A6]/30 rounded-2xl p-6 sticky top-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#2EE6A6]/20 rounded-xl flex items-center justify-center">
                <DollarSign className="text-[#2EE6A6]" size={24} />
              </div>
              <h3 className="text-lg font-display font-bold text-[#111111]">Current Balance</h3>
            </div>
            <div className="text-4xl font-display font-bold text-[#2EE6A6] mb-6">₹{currentBalance.toFixed(2)}</div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-[#2EE6A6]/10">
                <span className="text-[#6B7280]">Minimum withdrawal:</span>
                <span className="font-semibold text-[#111111]">₹{minWithdrawal}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#6B7280]">Payout rate:</span>
                <span className="font-semibold text-[#111111]">₹{payoutRate.toFixed(2)} per click</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}