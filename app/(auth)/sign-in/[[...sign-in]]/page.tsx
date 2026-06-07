import { SignIn } from "@clerk/nextjs";
import { Activity, Lock, TrendingUp, Users, Eye, ArrowUpRight } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex bg-white">

     {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0b8a3c]">
        <div className="flex flex-col justify-center px-10 xl:px-16 py-10 text-white w-full">
          {/* Hero Content */}
          <div className="max-w-xl">
            <h1 className="text-5xl xl:text-5xl font-bold  leading-[1.1] tracking-tight">
              Turn Your <span className="font-serif">Bio</span> Into <br />
               Income
            </h1>

            <p className="mt-6 text-base xl:text-base text-white/90 leading-relaxed max-w-md">
              Create a beautiful bio page, monetize your traffic, and grow your audience from one place. Join the next generation of professional creators.
            </p>
          </div>

          {/* Floating Cards - Asymmetric layout */}
          <div className="mt-12 relative h-64 max-w-xl">
            {/* Earnings Card - large, left */}
            <div className="absolute left-0 top-0 w-64 rounded-3xl border border-white/20 bg-white/15 backdrop-blur-md p-5 shadow-2xl rotate-[-2deg] hover:rotate-0 transition-transform">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/25 flex items-center justify-center">
                    <TrendingUp size={16} className="text-white" />
                  </div>
                  <p className="text-xs font-semibold tracking-wider">EARNINGS</p>
                </div>
                <span className="text-[10px] text-white/80">This month</span>
              </div>
              <p className="text-3xl font-serif font-bold tracking-tight">₹45,280</p>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-white/90">
                <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-white/20">
                  <ArrowUpRight size={10} />
                  <span>+12%</span>
                </div>
                <span>vs last month</span>
              </div>
            </div>

            {/* Live Visits Card - top right */}
            <div className="absolute right-0 top-4 w-56 rounded-3xl border border-white/20 bg-white/15 backdrop-blur-md p-5 shadow-2xl rotate-[3deg] hover:rotate-0 transition-transform">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-white/25 flex items-center justify-center">
                  <Eye size={16} className="text-white" />
                </div>
                <p className="text-xs font-semibold tracking-wider">LIVE VISITS</p>
              </div>
              <p className="text-3xl font-serif font-bold tracking-tight">12,482</p>
              <div className="mt-3 flex items-end gap-1 h-10">
                <div className="flex-1 bg-white/40 rounded-t" style={{ height: "35%" }} />
                <div className="flex-1 bg-white/50 rounded-t" style={{ height: "55%" }} />
                <div className="flex-1 bg-white/60 rounded-t" style={{ height: "45%" }} />
                <div className="flex-1 bg-white/75 rounded-t" style={{ height: "75%" }} />
                <div className="flex-1 bg-white/90 rounded-t" style={{ height: "90%" }} />
                <div className="flex-1 bg-white rounded-t" style={{ height: "100%" }} />
              </div>
            </div>

            {/* Active Creators Card - bottom center */}
            <div className="absolute left-16 bottom-0 w-60 rounded-3xl border border-white/20 bg-white/15 backdrop-blur-md p-5 shadow-2xl rotate-[1deg] hover:rotate-0 transition-transform">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/25 flex items-center justify-center">
                  <Users size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wider">CREATORS</p>
                  <p className="text-xl font-serif font-bold">50,000+</p>
                </div>
                <div className="ml-auto flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-white/40 border-2 border-[#0b8a3c]" />
                  <div className="w-7 h-7 rounded-full bg-white/30 border-2 border-[#0b8a3c]" />
                  <div className="w-7 h-7 rounded-full bg-white/50 border-2 border-[#0b8a3c] flex items-center justify-center text-[10px] font-bold">
                    +
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Glow Effects */}
        <div className="absolute top-16 right-16 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-16 right-20 h-60 w-60 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
      </div>


      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-8 lg:px-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-2">
            <h2 className="text-2xl font-bold tracking-tight text-[#111111]">
              <span className="text-[#0b8a3c]">YN</span>Links
            </h2>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#111111]">
              Welcome back
            </h1>
            <p className="mt- text-gray-500">
              Please enter your details to sign in.
            </p>
          </div>

          {/* Clerk Form */}
          <SignIn forceRedirectUrl="/onboarding/username" />
        </div>
      </div>

     
    </div>
  );
}