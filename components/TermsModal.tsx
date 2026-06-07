'use client';

import { X, Eye, DollarSign, Clock, Shield, MousePointerClick } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#111111]/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#111111]">Terms & Conditions</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-[#6B7280]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#2EE6A6]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <DollarSign size={20} className="text-[#2EE6A6]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#111111] mb-2">How You Earn Money</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  You earn <strong className="text-[#2EE6A6]">₹0.10</strong> for every unique click on your links.
                  When visitors click &quot;Visit Link&quot; on any of your links, you earn money. You can have up to 5 links,
                  and each link earns you ₹0.10 per unique click.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#2EE6A6]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MousePointerClick size={20} className="text-[#2EE6A6]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#111111] mb-2">What Counts as a Click</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  A click is counted when someone clicks &quot;Visit Link&quot; on one of your links. Each unique
                  IP address can click each link once per 24 hours. This means the same visitor can earn you
                  money by clicking multiple different links!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#2EE6A6]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Eye size={20} className="text-[#2EE6A6]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#111111] mb-2">Bio Page Visits Are Tracked</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  Bio page visits are tracked for your analytics but do not generate earnings.
                  You earn money only when visitors click on your links. Focus on creating engaging content
                  that encourages clicks!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#2EE6A6]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock size={20} className="text-[#2EE6A6]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#111111] mb-2">Maximum 5 Links Per User</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  You can create up to 5 links maximum. Each link can be clicked once per unique visitor
                  per 24 hours. This means one visitor can potentially earn you up to ₹0.50 (5 links × ₹0.10)
                  if they click all your links.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#2EE6A6]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield size={20} className="text-[#2EE6A6]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#111111] mb-2">Fair Usage Policy</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  We use advanced IP tracking to prevent duplicate counts and ensure fair earnings.
                  Any attempt to artificially inflate clicks through bots, VPNs, or other means will
                  result in account suspension and forfeiture of earnings.
                </p>
              </div>
            </div>

            <div className="bg-[#2EE6A6]/5 rounded-xl p-4 border border-[#2EE6A6]/20">
              <h4 className="font-semibold text-[#111111] mb-2">Example Calculation</h4>
              <div className="space-y-2 text-sm text-[#6B7280]">
                <p>
                  <strong className="text-[#111111]">You have 3 links.</strong> A visitor clicks all 3 links.
                </p>
                <p>• Link 1 clicked = ₹0.10</p>
                <p>• Link 2 clicked = ₹0.10</p>
                <p>• Link 3 clicked = ₹0.10</p>
                <p className="pt-2 border-t border-[#2EE6A6]/20">
                  <strong className="text-[#111111]">Total Earned from that visitor:</strong> ₹0.30
                </p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Pro Tip:</strong> Create compelling link titles and descriptions to encourage visitors
                to click on your links. The more engaging your content, the more clicks and earnings you&apos;ll get!
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-[#2EE6A6] text-white py-3 rounded-xl font-semibold hover:bg-[#1FD695] transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}