import Link from 'next/link';
import { Layers, Gamepad2, Trophy, Users, Zap } from 'lucide-react';

export default function NichGamesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900">
      <header className="fixed top-0 left-0 right-0 z-50 bg-purple-900/80 backdrop-blur-md border-b border-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-800 rounded-lg flex items-center justify-center">
                <Layers className="h-5 w-5 text-[#2EE6A6]" />
              </div>
              <span className="font-display font-bold text-xl text-white">YNLinks</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/sign-in" className="text-sm font-medium text-purple-200 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/sign-up" className="bg-[#2EE6A6] text-purple-900 px-4 py-2 rounded-lg font-semibold hover:bg-[#1FD695] transition-all">
                Join Gaming
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-pink-500/20 text-pink-400 px-4 py-2 rounded-full mb-4">
              <Gamepad2 className="w-4 h-4" />
              <span className="text-sm font-medium">Gaming Niche</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              Level Up Your<br />Gaming Links
            </h1>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto">
              The perfect link-in-bio for gaming creators. Stream, content, and community all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-pink-500/30 rounded-2xl p-6">
              <Trophy className="w-8 h-8 text-pink-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Tournament Links</h3>
              <p className="text-purple-200 text-sm">Share tournament registrations and esports event links.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-pink-500/30 rounded-2xl p-6">
              <Zap className="w-8 h-8 text-pink-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Streaming</h3>
              <p className="text-purple-200 text-sm">Twitch, YouTube, and all your streaming platforms.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-pink-500/30 rounded-2xl p-6">
              <Users className="w-8 h-8 text-pink-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Community</h3>
              <p className="text-purple-200 text-sm">Discord servers, subreddits, and gaming communities.</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/sign-up" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-pink-400 hover:to-purple-400 transition-all shadow-lg inline-flex items-center gap-2">
              Start Your Gaming Page
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}