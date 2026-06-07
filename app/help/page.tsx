import Link from 'next/link';
import { Layers, HelpCircle } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF9]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#111111] rounded-lg flex items-center justify-center">
                <Layers className="h-5 w-5 text-[#2EE6A6]" />
              </div>
              <span className="font-display font-bold text-xl text-[#111111]">YNLinks</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#2EE6A6]/20 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-[#2EE6A6]" />
            </div>
            <h1 className="text-4xl font-display font-bold text-[#111111]">Help & Support</h1>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-[#111111] mb-3">How do I create an account?</h2>
              <p className="text-[#6B7280]">Click on &quot;Sign Up&quot; at the top of the page and follow the instructions to create your account with email or Google sign-in.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-[#111111] mb-3">How do I add links to my bio page?</h2>
              <p className="text-[#6B7280]">Go to your Dashboard and click on &quot;Links&quot;. From there, you can add up to 5 links with titles, URLs, and optional thumbnails.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-[#111111] mb-3">How do I earn money?</h2>
              <p className="text-[#6B7280]">You earn ₹0.10 for every click on your links. The more visitors you drive to your bio page, the more you earn!</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-[#111111] mb-3">When can I withdraw my earnings?</h2>
              <p className="text-[#6B7280]">You can withdraw your earnings once you reach the minimum threshold of ₹150. Go to the Withdrawals page to request a payout.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-[#111111] mb-3">What payment methods are supported?</h2>
              <p className="text-[#6B7280]">We support UPI, Bank Transfer, Binance, and Payoneer for withdrawals. Choose the method that works best for you.</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-[#6B7280] mb-4">Still have questions?</p>
            <a href="mailto:support@ynlinks.com" className="bg-[#2EE6A6] text-[#111111] px-6 py-3 rounded-xl font-semibold hover:bg-[#1FD695] transition-all inline-block">
              Contact Support
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}