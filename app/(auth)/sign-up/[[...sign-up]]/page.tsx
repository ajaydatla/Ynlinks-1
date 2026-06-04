import { SignUp } from '@clerk/nextjs';
import { Layout, DollarSign, Gem, BarChart3, Star } from 'lucide-react';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex bg-white font-sans antialiased">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-4 lg:px-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-3">
            <h2 className="text-2xl font-bold tracking-tight text-[#111111]">
              <span className="text-[#0b8a3c]">YN</span>Links
            </h2>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-[2rem] leading-tight font-bold text-[#111111] tracking-tight">
              Create your account
            </h1>
            <p className="mt-2 text-[15px] text-gray-500 leading-relaxed">
              Join 50,000+ creators and start growing today.
            </p>
          </div>

          {/* Clerk Form */}
          <SignUp />
        </div>
      </div>

      {/* Right Side - Marketing */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#d8f3e3] via-[#b8ecc8] to-[#7dd09a]">
        <div className="flex flex-col justify-center px-12 xl:px-16 py-14 text-[#0b2e1a] w-full">

          {/* Hero Headline */}
          <h1
            className="text-[2.6rem] xl:text-[2.8rem] leading-[1.18] tracking-tight text-[#0b2e1a] max-w-[460px] mb-10"
            style={{ fontFamily: " Georgia, serif", fontWeight: 700 }}
          >
            Designed for the next generation of creators.
          </h1>

          {/* Feature List */}
          <div className="flex flex-col gap-12 max-w-[360px]">
            {[
              {
                icon: <Layout size={18} className="text-[#0b8a3c]" />,
                title: "Create Bio Page",
                desc: "Build a professional landing page in seconds.",
              },
              {
                icon: <DollarSign size={18} className="text-[#0b8a3c]" />,
                title: "Earn Revenue",
                desc: "Monetize your traffic with sponsored ads.",
              },
              {
                icon: <Gem size={18} className="text-[#0b8a3c]" />,
                title: "Get Brand Deals",
                desc: "Connect with 100+ active brands.",
              },
              {
                icon: <BarChart3 size={18} className="text-[#0b8a3c]" />,
                title: "Track Analytics",
                desc: "Advanced insights to scale your audience.",
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-[14px]">
                <div className="w-[42px] h-[42px] rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                  {icon}
                </div>
                <div>
                  <p className="font-bold text-[14px] text-[#0b2e1a] mb-[3px]">{title}</p>
                  <p className="text-[13px] text-[#0b2e1a]/60 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial Card */}
          <div className="mt-8 max-w-[360px] rounded-[18px] bg-white p-[18px_20px] shadow-[0_6px_24px_rgba(0,0,0,0.07)] border border-white/90">
            <div className="flex items-center justify-between mb-3">
              <div className="flex">
                <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-orange-300 to-orange-500 border-2 border-white z-[3] -mr-2" />
                <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-purple-300 to-purple-500 border-2 border-white z-[2] -mr-2" />
                <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-pink-300 to-pink-500 border-2 border-white z-[1]" />
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={13} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            <p className="text-[13px] text-[#0b2e1a]/75 italic leading-relaxed">
              &ldquo;YnLink has completely transformed how I manage my sponsorships. The analytics alone saved me 10 hours a week.&rdquo;
            </p>
          </div>
        </div>

        {/* Decorative blurs */}
        <div className="absolute top-[-30px] right-[-30px] w-44 h-44 bg-white/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-40px] right-16 w-56 h-56 bg-white/10 rounded-full blur-[50px] pointer-events-none" />
      </div>
    </div>
  );
}
