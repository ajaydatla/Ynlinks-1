import Link from 'next/link';
import { Layers } from 'lucide-react';

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-display font-bold text-[#111111] mb-6">Privacy Policy</h1>
          <div className="prose prose-lg max-w-none text-[#6B7280]">
            <p className="mb-4">Last updated: May 2024</p>
            <h2 className="text-2xl font-bold text-[#111111] mt-8 mb-4">1. Information We Collect</h2>
            <p className="mb-4">We collect information you provide directly to us, including your name, email address, and any other information you choose to provide.</p>
            <h2 className="text-2xl font-bold text-[#111111] mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to provide, maintain, and improve our services, process transactions, and send you related information.</p>
            <h2 className="text-2xl font-bold text-[#111111] mt-8 mb-4">3. Information Sharing</h2>
            <p className="mb-4">We do not share your personal information with third parties except as described in this policy or with your consent.</p>
            <h2 className="text-2xl font-bold text-[#111111] mt-8 mb-4">4. Data Security</h2>
            <p className="mb-4">We implement appropriate technical and organizational measures to protect the security of your personal information.</p>
            <h2 className="text-2xl font-bold text-[#111111] mt-8 mb-4">5. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us.</p>
          </div>
        </div>
      </main>
    </div>
  );
}