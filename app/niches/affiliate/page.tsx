import Link from 'next/link';
import { Layers, ShoppingCart, Gift, Percent } from 'lucide-react';

export default function NichAffiliatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-950 via-red-900 to-orange-950">
      <header className="fixed top-0 left-0 right-0 z-50 bg-orange-900/80 backdrop-blur-md border-b border-orange-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-800 rounded-lg flex items-center justify-center">
                <Layers className="h-5 w-5 text-[#2EE6A6]" />
              </div>
              <span className="font-display font-bold text-xl text-white">YNLinks</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/sign-in" className="text-sm font-medium text-orange-200 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/sign-up" className="bg-[#2EE6A6] text-orange-900 px-4 py-2 rounded-lg font-semibold hover:bg-[#1FD695] transition-all">
                Join Affiliate
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full mb-4">
              <Percent className="w-4 h-4" />
              <span className="text-sm font-medium">Affiliate Niche</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              Maximize Your<br />Affiliate Earnings
            </h1>
            <p className="text-xl text-orange-200 max-w-2xl mx-auto">
              Perfect for affiliate marketers. Organize your referral links, deals, and product recommendations in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-6">
              <ShoppingCart className="w-8 h-8 text-orange-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Product Links</h3>
              <p className="text-orange-200 text-sm">Organize your affiliate product recommendations.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-6">
              <Gift className="w-8 h-8 text-orange-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Deals & Coupons</h3>
              <p className="text-orange-200 text-sm">Share exclusive deals and discount codes.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-6">
              <Percent className="w-8 h-8 text-orange-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Comparison</h3>
              <p className="text-orange-200 text-sm">Help your audience compare products and prices.</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/sign-up" className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-orange-400 hover:to-red-400 transition-all shadow-lg inline-flex items-center gap-2">
              Start Your Affiliate Page
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}