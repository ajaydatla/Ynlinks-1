import Link from 'next/link';
import { Layers, Users, DollarSign, Zap } from 'lucide-react';

export default function AboutPage() {
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
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-[#111111] mb-6">About YNLinks</h1>
          <p className="text-xl text-[#6B7280] mb-8">
            YNLinks is a link-in-bio platform that helps creators monetize their online presence.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <Users className="w-8 h-8 text-[#2EE6A6] mb-4" />
              <h2 className="text-xl font-bold text-[#111111] mb-2">For Creators</h2>
              <p className="text-[#6B7280]">Create a beautiful bio page with all your important links and earn from every click.</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <DollarSign className="w-8 h-8 text-[#2EE6A6] mb-4" />
              <h2 className="text-xl font-bold text-[#111111] mb-2">Earn Money</h2>
              <p className="text-[#6B7280]">Every link click earns you money. Withdraw your earnings starting at just ₹150.</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-[#111111] mb-4">Our Mission</h2>
            <p className="text-[#6B7280] mb-6">
              We believe every creator deserves to monetize their audience. YNLinks provides the tools you need to transform your social media followers into engaged visitors who click on your links.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}