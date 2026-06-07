import Link from 'next/link';
import { Layers } from 'lucide-react';

export default function TermsPage() {
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
          <h1 className="text-4xl font-display font-bold text-[#111111] mb-6">Terms of Service</h1>
          <div className="prose prose-lg max-w-none text-[#6B7280]">
            <p className="mb-4">Last updated: May 2024</p>
            <h2 className="text-2xl font-bold text-[#111111] mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">By accessing and using YNLinks, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
            <h2 className="text-2xl font-bold text-[#111111] mt-8 mb-4">2. Use of Service</h2>
            <p className="mb-4">You agree to use the service only for lawful purposes and in accordance with these Terms. You are responsible for all activity under your account.</p>
            <h2 className="text-2xl font-bold text-[#111111] mt-8 mb-4">3. Earnings and Withdrawals</h2>
            <p className="mb-4">Earnings are calculated based on valid link clicks. Minimum withdrawal amount is ₹150. We reserve the right to review and adjust earnings in case of fraudulent activity.</p>
            <h2 className="text-2xl font-bold text-[#111111] mt-8 mb-4">4. Account Termination</h2>
            <p className="mb-4">We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.</p>
            <h2 className="text-2xl font-bold text-[#111111] mt-8 mb-4">5. Changes to Terms</h2>
            <p>We may modify these terms at any time. Continued use of the service after modifications constitutes acceptance of the new terms.</p>
          </div>
        </div>
      </main>
    </div>
  );
}