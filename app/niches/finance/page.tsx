import Link from 'next/link';
import { Layers, Briefcase, TrendingUp, GraduationCap, Users, Shield } from 'lucide-react';

export default function NichFinancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                <Layers className="h-5 w-5 text-[#2EE6A6]" />
              </div>
              <span className="font-display font-bold text-xl text-white">YNLinks</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/sign-in" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/sign-up" className="bg-[#2EE6A6] text-slate-900 px-4 py-2 rounded-lg font-semibold hover:bg-[#1FD695] transition-all">
                Join Finance
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full mb-4">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Finance Niche</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              Finance Content<br />Made Profitable
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Connect with finance influencers and monetize your financial content. Perfect for fintech, investing, and personal finance creators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <Briefcase className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Personal Finance</h3>
              <p className="text-slate-300 text-sm">Budgeting, saving, and investing advice for everyday people.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <TrendingUp className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Investing</h3>
              <p className="text-slate-300 text-sm">Stock market, crypto, and portfolio building strategies.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <GraduationCap className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Financial Education</h3>
              <p className="text-slate-300 text-sm">Courses, tutorials, and educational content.</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/sign-up" className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg inline-flex items-center gap-2">
              Start Your Finance Page
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}