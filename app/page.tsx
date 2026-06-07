"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Layers,
  ArrowRight,
  CheckCircle,
  Wallet,
  BarChart3,
  MousePointerClick,
  Gem,
  PenTool,
  Share2,
  DollarSign,
  Layout,
  Link2,
  Zap,
  ShieldCheck,
  Smartphone,
  Quote,
  ChevronDown,
  Star,
  X,
  Megaphone,
  BarChart2,
  Globe,
  Play,
  TrendingUp,
  Link as LinkIcon,
  Menu,
  Instagram,
  Facebook,
  Send,
} from "lucide-react";

import { api } from "../convex/_generated/api";

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAdvertiserForm, setShowAdvertiserForm] = useState(false);
  const [advertiserForm, setAdvertiserForm] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    website: "",
    budget: "",
    message: "",
  });
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll(".reveal").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleAdvertiserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    try {
      // Call the API directly
      const response = await fetch("/api/submit-advertiser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(advertiserForm),
      });

      if (!response.ok) {
        throw new Error("Failed to submit inquiry");
      }

      setFormSuccess(true);
      setAdvertiserForm({
        company_name: "",
        contact_name: "",
        email: "",
        phone: "",
        website: "",
        budget: "",
        message: "",
      });
    } catch (error: any) {
      setFormError(
        error.message || "Failed to submit inquiry. Please try again.",
      );
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="bg-white text-[#111111] antialiased font-sans selection:bg-[#2EE6A6] selection:text-white overflow-x-hidden">
      <nav
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] sm:w-[85%] max-w-7xl
        backdrop-blur-2xl bg-white/30 border border-white/30
        shadow-[0_8px_30px_rgba(0,0,0,0.06)]
        rounded-full transition-all duration-300"
      >
        <div className="px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 hover:bg-white/60 rounded-lg transition-colors"
            data-testid="button-mobile-menu"
          >
            <Menu size={22} className="text-[#111111]" />
          </button>

          {/* LOGO */}
          <Link href="/" className="flex items-center group">
  <img
    src="/logoYnLinks.jpeg"
    alt="YNLinks Logo"
    width={140}
    height={40}
    className="h-8 sm:h-14 w-auto object-contain pl-8"
  />
</Link>

          {/* CENTER LINKS */}
          <div className="hidden md:flex items-center gap-1">
            <a
              href="/"
              className="px-4 py-2 text-md font-medium text-gray-900
              hover:text-[#111111] hover:bg-white/60
              rounded-lg transition-all"
            >
              Home
            </a>

            <a
              href="#how-it-works"
              className="px-4 py-2 text-md font-medium text-gray-900
              hover:text-[#111111] hover:bg-white/60
              rounded-lg transition-all"
            >
              How It Works
            </a>

            {/* <a
              href="#creators"
              className="px-4 py-2 text-md font-medium text-gray-900
              hover:text-[#111111] hover:bg-white/60
              rounded-lg transition-all"
            >
              Features
            </a> */}

            <button
              onClick={() => setShowAdvertiserForm(true)}
              className="px-4 py-2 text-md font-medium text-gray-900
              hover:text-[#111111] hover:bg-white/60
              rounded-lg transition-all flex items-center gap-2"
            >
              <Megaphone size={20} />
              Advertise
            </button>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-1 sm:gap-3">
            <Link
              href="/sign-in"
              className="hidden sm:block text-md font-semibold text-gray-900
              hover:text-[#111111] transition-colors px-4 py-2"
            >
              Log In
            </Link>

            <Link
              href="/sign-up"
              className="bg-[#10b981] text-[#0a2e1f]
              px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold
              shadow-[0_8px_20px_rgba(46,230,166,0.45)]
              hover:shadow-[0_12px_30px_rgba(46,230,166,0.55)]
              hover:scale-[1.03] transition-all"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] md:hidden">
          <div className="fixed top-0 left-0 w-[280px] h-full bg-white shadow-2xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="w-8 h-8 flex items-center justify-center bg-[#10b981] text-white rounded-lg">
                  <Layers size={18} />
                </div>
                <span className="font-display font-bold text-2xl text-[#111111]">
                  YNLinks
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <nav className="space-y-2">
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-xl"
              >
                How Works
              </a>
              <a
                href="#earnings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-xl"
              >
                Partners
              </a>
              <a
                href="#creators"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-xl"
              >
                Features
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowAdvertiserForm(true);
                }}
                className="w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-xl flex items-center gap-2"
              >
                <Megaphone size={18} />
                Advertise
              </button>
            </nav>

            <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
              <Link
                href="/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-3 text-base font-medium text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                Log In
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-3 text-base font-semibold text-white bg-[#10b981] rounded-xl hover:bg-[#0ea574]"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
          <div
            className="absolute inset-0 z-[-1]"
            onClick={() => setMobileMenuOpen(false)}
          />
        </div>
      )}

      {showAdvertiserForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border-2 border-[#111111] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowAdvertiserForm(false);
                setFormSuccess(false);
                setFormError("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#111111] transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={24} />
            </button>

            {formSuccess ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} className="text-green-600" />
                </div>
                <h3 className="text-3xl font-black text-[#111111] mb-3">
                  Thank You!
                </h3>
                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                  We&apos;ve received your advertising inquiry. Our team will review
                  your submission and get back to you within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setShowAdvertiserForm(false);
                    setFormSuccess(false);
                  }}
                  className="bg-[#2EE6A6] text-[#111111] px-8 py-3 rounded-full font-bold hover:bg-[#1FD695] transition-all"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#2EE6A6] to-[#1FD695] rounded-xl flex items-center justify-center">
                      <Megaphone size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-black text-[#111111]">
                        Advertise with YNLinks
                      </h3>
                      <p className="text-sm text-gray-600">
                        Reach 1.4M+ engaged creators worldwide
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    Partner with us to display your ads to millions of engaged
                    users. Fill out the form below and our advertising team will
                    contact you.
                  </p>
                </div>

                {formError && (
                  <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium mb-6">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleAdvertiserSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="company_name"
                        className="block text-sm font-bold text-[#111111] mb-2"
                      >
                        Company Name *
                      </label>
                      <input
                        type="text"
                        id="company_name"
                        required
                        value={advertiserForm.company_name}
                        onChange={(e) =>
                          setAdvertiserForm({
                            ...advertiserForm,
                            company_name: e.target.value,
                          })
                        }
                        className="block w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2EE6A6] focus:border-[#2EE6A6] transition-all"
                        placeholder="Your Company Inc."
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact_name"
                        className="block text-sm font-bold text-[#111111] mb-2"
                      >
                        Contact Name *
                      </label>
                      <input
                        type="text"
                        id="contact_name"
                        required
                        value={advertiserForm.contact_name}
                        onChange={(e) =>
                          setAdvertiserForm({
                            ...advertiserForm,
                            contact_name: e.target.value,
                          })
                        }
                        className="block w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2EE6A6] focus:border-[#2EE6A6] transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-bold text-[#111111] mb-2"
                      >
                        Business Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={advertiserForm.email}
                        onChange={(e) =>
                          setAdvertiserForm({
                            ...advertiserForm,
                            email: e.target.value,
                          })
                        }
                        className="block w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2EE6A6] focus:border-[#2EE6A6] transition-all"
                        placeholder="john@company.com"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-bold text-[#111111] mb-2"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={advertiserForm.phone}
                        onChange={(e) =>
                          setAdvertiserForm({
                            ...advertiserForm,
                            phone: e.target.value,
                          })
                        }
                        className="block w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2EE6A6] focus:border-[#2EE6A6] transition-all"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="website"
                        className="block text-sm font-bold text-[#111111] mb-2"
                      >
                        Website
                      </label>
                      <input
                        type="url"
                        id="website"
                        value={advertiserForm.website}
                        onChange={(e) =>
                          setAdvertiserForm({
                            ...advertiserForm,
                            website: e.target.value,
                          })
                        }
                        className="block w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2EE6A6] focus:border-[#2EE6A6] transition-all"
                        placeholder="https://yourcompany.com"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="budget"
                        className="block text-sm font-bold text-[#111111] mb-2"
                      >
                        Monthly Budget *
                      </label>
                      <select
                        id="budget"
                        required
                        value={advertiserForm.budget}
                        onChange={(e) =>
                          setAdvertiserForm({
                            ...advertiserForm,
                            budget: e.target.value,
                          })
                        }
                        className="block w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2EE6A6] focus:border-[#2EE6A6] transition-all"
                      >
                        <option value="">Select budget range</option>
                        <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                        <option value="$5,000 - $10,000">
                          $5,000 - $10,000
                        </option>
                        <option value="$10,000 - $25,000">
                          $10,000 - $25,000
                        </option>
                        <option value="$25,000 - $50,000">
                          $25,000 - $50,000
                        </option>
                        <option value="$50,000+">$50,000+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-bold text-[#111111] mb-2"
                    >
                      Tell us about your advertising goals *
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={4}
                      value={advertiserForm.message}
                      onChange={(e) =>
                        setAdvertiserForm({
                          ...advertiserForm,
                          message: e.target.value,
                        })
                      }
                      className="block w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2EE6A6] focus:border-[#2EE6A6] transition-all resize-none"
                      placeholder="Tell us about your campaign objectives, target audience, and any specific requirements..."
                    />
                  </div>

                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-900 font-semibold mb-2">
                      Why Advertise with YNLinks?
                    </p>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle
                          size={14}
                          className="text-blue-600 flex-shrink-0"
                        />
                        10878+ creators with engaged audiences
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle
                          size={14}
                          className="text-blue-600 flex-shrink-0"
                        />
                        5M+ clicks monthly across 195 countries
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle
                          size={14}
                          className="text-blue-600 flex-shrink-0"
                        />
                        Premium placements with high visibility
                      </li>
                    </ul>
                  </div>

                  <button
                    type="submit"
                    disabled={formLoading}
                    className="w-full bg-gradient-to-r from-[#2EE6A6] to-[#1FD695] text-[#111111] py-4 rounded-full font-black text-lg hover:shadow-xl hover:shadow-[#2EE6A6]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {formLoading ? (
                      "Submitting..."
                    ) : (
                      <>
                        Submit Inquiry
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>

                  <p className="text-xs text-center text-gray-500">
                    By submitting this form, you agree to our Terms of Service
                    and Privacy Policy
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <section className="relative pt-24 sm:pt-28 pb-16 sm:pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] md:w-[800px] md:h-[800px] bg-gradient-to-br from-[#2EE6A6]/5 to-transparent rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-gradient-to-tr from-[#2EE6A6]/3 to-transparent rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left order-1 lg:order-1">
              <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-4 mt-6 sm:mb-6 text-[#111111]">
                Earn from your bio link
                <br />
                <span className="relative inline-block">
                  <span className="text-[#10b981]"> — every click.</span>
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-800 mb-6 sm:mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 px-2 sm:px-0">
                Turn your bio into an earning page with smart ads.
              </p>

              {/* Desktop CTA Bar */}
              <div
                className="hidden sm:flex w-full mb-10 sm:mb-14 mt-6 sm:mt-8 max-w-[400px] mx-auto lg:mx-0
                items-center justify-between gap-2 sm:gap-3
                rounded-xl bg-white p-1.5 pl-4 sm:pl-6
                ring-1 ring-gray-200
                shadow-[0_14px_30px_rgba(0,0,0,0.10)]
                hover:shadow-[0_18px_40px_rgba(0,0,0,0.16)]
                transition-all duration-300"
              >
                <div className="flex flex-1 items-center gap-1 overflow-hidden">
                  <div className="flex w-full items-center overflow-hidden whitespace-nowrap text-sm sm:text-lg">
                    <span className="shrink-0 text-gray-500 font-normal tracking-tight">
                      ynlinks.bio/
                    </span>
                    <input
                      type="text"
                      placeholder="you"
                      className="w-full min-w-0 border-none bg-transparent p-0 pl-0 text-gray-800 placeholder:text-gray-200 focus:outline-none focus:ring-0 font-normal"
                      spellCheck={false}
                    />
                  </div>
                </div>
                <Link href="/sign-up">
                  <button className="group relative shrink-0 rounded-xl bg-[#10b981] px-4 sm:px-4 py-2.5 sm:py-3.5 text-sm sm:text-lg font-semibold text-[#0a2e1f] transition-all hover:bg-[#10b981] hover:shadow-sm active:scale-[0.98]">
                    Get Started Now
                  </button>
                </Link>
              </div>

              {/* Mobile CTA Button - same style as desktop */}
              <div
                className="flex sm:hidden w-full mt-6 max-w-[320px] mx-auto
                items-center gap-2
                rounded-xl bg-white p-2
                ring-1 ring-gray-200
                shadow-[0_14px_20px_rgba(0,0,0,0.10)]
                transition-all mb-4"
              >
                <div className="flex flex-1 items-center overflow-hidden text-sm px-4">
                  <span className="shrink-0 text-gray-500 font-normal tracking-tight">
                    YNLinks.bio/
                  </span>
                  <input
                    type="text"
                    placeholder="you"
                    className="w-full min-w-0 border-none bg-transparent pl-1 text-gray-800 placeholder:text-gray-200 focus:outline-none"
                    spellCheck={false}
                  />
                </div>

                <Link href="/sign-up">
                  <button className="shrink-0 rounded-xl bg-[#10b981] px-4 py-2 text-sm font-semibold text-[#0a2e1f] active:scale-[0.97]">
                    Create
                  </button>
                </Link>
              </div>

              {/* <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-8 text-sm sm:text-md text-gray-800 px-4 sm:pl-8 sm:px-0">
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-[#10b981]" />
                  <span className="font-medium">No Credit Card</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-[#10b981]" />
                  <span className="font-medium">2-Min Setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-[#10b981]" />
                  <span className="font-medium">Free Forever</span>
                </div>
              </div> */}

              <div className="hidden sm:flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-8 text-sm sm:text-md text-gray-800 px-4 sm:pl-8 sm:px-0">
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-[#10b981]" />
                  <span className="font-medium">No Credit Card</span>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-[#10b981]" />
                  <span className="font-medium">2-Min Setup</span>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-[#10b981]" />
                  <span className="font-medium">Free Forever</span>
                </div>
              </div>
            </div>

            {/* <div className="relative order-2 lg:order-2 flex items-center justify-center mt-2 lg:mt-0"> */}

            <div className="hidden sm:flex relative order-2 lg:order-2 items-center justify-center mt-2 lg:mt-0">
              {/* Decorative social icons - hidden on mobile */}
              <div
                className="hidden md:flex absolute left-28 top-8 w-16 h-16 bg-white rounded-full
                border-2 border-black items-center justify-center z-20
                shadow-[0_4px_0_0_#000]
                animate-[spin_6s_linear_infinite]"
              >
                <svg
                  className="w-8 h-8 text-black"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" fill="white" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="white" />
                </svg>
              </div>

              <div
                className="hidden lg:flex absolute left-1 top-148 w-12 h-12 bg-white rounded-full
                border-2 border-black items-center justify-center z-20
                shadow-[0_4px_0_0_#000]
                animate-[spin_6s_linear_infinite]"
              >
                <svg
                  className="w-8 h-8 text-black"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2V9.8c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 3h-1.9v7A10 10 0 0 0 22 12z" />
                </svg>
              </div>

              <div
                className="hidden lg:flex absolute -right-6 top-158 w-15 h-15 bg-white rounded-full
                border-2 border-black items-center justify-center z-20
                shadow-[0_4px_0_0_#000]
                animate-[spin_6s_linear_infinite]"
              >
                <svg
                  className="w-8 h-8 text-black ml-[2px]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>

              {/* Plus signs - hidden on mobile */}
              <div className="hidden md:block absolute left-20 bottom-12 text-gray-900 text-3xl font-mono z-20">
                <div className="flex flex-col items-center gap-0.5">
                  <span>++</span>
                  <span>++</span>
                  <span>++</span>
                  <span>++</span>
                  <span>++</span>
                  <span>++</span>
                  <span>++</span>
                  <span>++</span>
                </div>
              </div>

              {/* Starburst - hidden on mobile */}
              <div className="absolute top-1/2 right-1/2 translate-x-[280px] -translate-y-[280px] w-64 h-64 z-0 pointer-events-none hidden lg:block">
                <div className="relative w-full h-full flex items-center justify-center animate-[spin_20s_linear_infinite]">
                  <div className="absolute w-4 h-32 bg-emerald-500 rounded-full border-2 border-gray-900 shadow-[4px_4px_0_0_rgba(17,24,39,1)] origin-bottom -translate-y-1/2 rotate-0"></div>
                  <div className="absolute w-4 h-32 bg-emerald-500 rounded-full border-2 border-gray-900 shadow-[4px_4px_0_0_rgba(17,24,39,1)] origin-bottom -translate-y-1/2 rotate-[30deg]"></div>
                  <div className="absolute w-4 h-32 bg-emerald-500 rounded-full border-2 border-gray-900 shadow-[4px_4px_0_0_rgba(17,24,39,1)] origin-bottom -translate-y-1/2 rotate-[60deg]"></div>
                  <div className="absolute w-4 h-32 bg-emerald-500 rounded-full border-2 border-gray-900 shadow-[4px_4px_0_0_rgba(17,24,39,1)] origin-bottom -translate-y-1/2 rotate-[90deg]"></div>
                  <div className="absolute w-4 h-32 bg-emerald-500 rounded-full border-2 border-gray-900 shadow-[4px_4px_0_0_rgba(17,24,39,1)] origin-bottom -translate-y-1/2 rotate-[120deg]"></div>
                  <div className="absolute w-4 h-32 bg-emerald-500 rounded-full border-2 border-gray-900 shadow-[4px_4px_0_0_rgba(17,24,39,1)] origin-bottom -translate-y-1/2 rotate-[150deg]"></div>
                  <div className="absolute w-4 h-32 bg-emerald-500 rounded-full border-2 border-gray-900 shadow-[4px_4px_0_0_rgba(17,24,39,1)] origin-bottom -translate-y-1/2 rotate-[180deg]"></div>
                  <div className="absolute w-4 h-32 bg-emerald-500 rounded-full border-2 border-gray-900 shadow-[4px_4px_0_0_rgba(17,24,39,1)] origin-bottom -translate-y-1/2 rotate-[210deg]"></div>
                  <div className="absolute w-4 h-32 bg-emerald-500 rounded-full border-2 border-gray-900 shadow-[4px_4px_0_0_rgba(17,24,39,1)] origin-bottom -translate-y-1/2 rotate-[240deg]"></div>
                  <div className="absolute w-4 h-32 bg-emerald-500 rounded-full border-2 border-gray-900 shadow-[4px_4px_0_0_rgba(17,24,39,1)] origin-bottom -translate-y-1/2 rotate-[270deg]"></div>
                  <div className="absolute w-4 h-32 bg-emerald-500 rounded-full border-2 border-gray-900 shadow-[4px_4px_0_0_rgba(17,24,39,1)] origin-bottom -translate-y-1/2 rotate-[300deg]"></div>
                  <div className="absolute w-4 h-32 bg-emerald-500 rounded-full border-2 border-gray-900 shadow-[4px_4px_0_0_rgba(17,24,39,1)] origin-bottom -translate-y-1/2 rotate-[330deg]"></div>
                </div>
              </div>

              {/* Phone mockup - responsive sizing */}
              <div className="relative w-full max-w-[300px] sm:max-w-[280px] md:max-w-[300px] lg:max-w-[320px] mx-auto">
                <div className="relative bg-[#e8f2fb] rounded-[2.5rem] overflow-hidden border-[3px] border-gray-900 shadow-[0_10px_0_0_#000]">
                  <div className="w-full pt-2 px-5 pb-6">
                    <div className="flex flex-col items-center">
                      <div className="relative mb-3">
                        <div className="w-16 h-16 rounded-full overflow-hidden ring-[2px] ring-black ring-offset-2 ring-offset-[#F5F0E6]">
                          <img
                            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
                            alt="Jenn"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      <h2 className="text-base font-bold text-[#111111] mb-0.5">
                        Jenn
                      </h2>
                      <p className="text-[11px] text-gray-600 mb-3 text-center px-4">
                        Curating all things home decor, fashion, food, and
                        travel
                      </p>

                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-5 h-5 rounded-full bg-[#1877F2] flex items-center justify-center">
                          <svg
                            className="w-2.5 h-2.5 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center">
                          <svg
                            className="w-2.5 h-2.5 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-[#FF0000] flex items-center justify-center">
                          <svg
                            className="w-2.5 h-2.5 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                          </svg>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-[#E60023] flex items-center justify-center">
                          <svg
                            className="w-2.5 h-2.5 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
                          </svg>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-[#111111] flex items-center justify-center">
                          <svg
                            className="w-2.5 h-2.5 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                          </svg>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-[#0A66C2] flex items-center justify-center">
                          <svg
                            className="w-2.5 h-2.5 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </div>
                      </div>

                      <div className="w-full space-y-2">
                        <div className="bg-white rounded-md p-2.5 shadow-sm border border-gray-900 hover:shadow-md transition-all cursor-pointer">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=80&h=80&fit=crop"
                                alt="Sofa"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-[#111111] text-xs leading-tight">
                              Home Decor Favorites
                              </h3>
                            </div>
                            <svg
                              className="w-4 h-4 text-gray-400 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>

                        <div className="bg-white rounded-md p-2.5 shadow-sm border border-gray-900 hover:shadow-md transition-all cursor-pointer">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-amber-100">
                              <img
                                src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=80&h=80&fit=crop"
                                alt="Coffee"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-[#111111] text-xs leading-tight">
                              My Everyday Coffee Essentials
                              </h3>
                            </div>
                            <svg
                              className="w-4 h-4 text-gray-400 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>

                        <div className="bg-white rounded-md p-2.5 shadow-sm border border-gray-900 hover:shadow-md transition-all cursor-pointer">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src="https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=80&h=80&fit=crop"
                                alt="Art"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-[#111111] text-xs leading-tight">
                              Art Pieces That Inspire My Space
                              </h3>
                            </div>
                            <svg
                              className="w-4 h-4 text-gray-400 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>

                        <div className="bg-white rounded-md p-2.5 shadow-sm border border-gray-900 hover:shadow-md transition-all cursor-pointer">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=80&h=80&fit=crop"
                                alt="Diamond"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-[#111111] text-xs leading-tight">
                              Timeless Jewellery I Love
                              </h3>
                            </div>
                            <svg
                              className="w-4 h-4 text-gray-400 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>

                        <div className="bg-white rounded-md p-2.5 shadow-sm border border-gray-900 hover:shadow-md transition-all cursor-pointer">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=80&h=80&fit=crop"
                                alt="Interior"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-[#111111] text-xs leading-tight">
                              Interior Finds Worth Investing 
                              </h3>
                            </div>
                            {/* <span className="text-xs font-semibold text-[#10b981] flex-shrink-0">
                              $22.00
                            </span> */}
                            <svg
                              className="w-4 h-4 text-gray-400 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-only Image */}
        <div className="flex sm:hidden items-center justify-center mt-6 px-1">
          <img
            src="/Gemini_image.webp"
            alt="Mobile Preview"
            className="w-full max-w-[500px] h-auto"
          />
        </div>
      </section>
      <section
        className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-stone-50"
        id="features"
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 sm:mb-12 md:mb-16 text-center max-w-3xl mx-auto reveal-on-scroll">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl  font-bold tracking-tightest mb-3 sm:mb-4">
              Built for Creators
            </h2>
            <p className="text-base sm:text-lg text-stone-500 font-medium px-4 sm:px-0">
              Everything you need to grow your audience and your income.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 auto-rows-auto sm:auto-rows-[280px]">
            {/* Card 1 - Phone Mockup with Floating Elements */}
            <div className="group sm:col-span-2 sm:row-span-2 bg-stone-50 rounded-2xl sm:rounded-3xl border border-stone-200 shadow-sm overflow-hidden relative transition-all hover:shadow-xl hover:border-[#10b981]/30 min-h-[250px] sm:min-h-[350px] flex flex-col lg:block">
              {/* MAIN IMAGE */}
              <img
                src="/finalgrid.jpeg"
                alt="Social preview"
                className="w-full h-auto object-contain lg:h-full lg:object-cover"
              />

              {/* DESKTOP TEXT - Right Top (hidden on mobile) */}
              <div className="absolute top-6 right-0 max-w-[190px] hidden lg:block">
                <h2 className="text-2xl font-bold text-[#10b981] leading-tight">
                  Works Anywhere
                </h2>
                <p className="text-xs text-gray-800 mt-2">
                  Share your link on Instagram, YouTube, Facebook, TikTok,
                  messengers or SMS.
                </p>
              </div>

              {/* MOBILE TEXT - Bottom (visible only on mobile) */}
              <div className="bg-white p-6 lg:hidden lg:absolute lg:bottom-0 lg:left-0 lg:right-0">
                <h2 className="text-lg font-bold text-[#10b981] leading-tight mb-2">
                  Works Anywhere
                </h2>
                <p className="text-sm text-gray-800 leading-relaxed">
                  Share your link on any social or digital platform: Instagram,
                  YouTube, Facebook or TikTok, in messengers or via SMS.
                </p>
              </div>
            </div>

            {/* Card 2 - Live Analytics */}
            <div className="bg-stone-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-stone-800 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all reveal-on-scroll delay-75">
              <div className="flex justify-between items-start mb-6 sm:mb-12">
                <h3 className="font-display font-bold text-lg sm:text-xl">
                  Live Analytics
                </h3>
                <span
                  className="iconify text-stone-500"
                  data-icon="lucide:bar-chart-2"
                  data-width="24"
                ></span>
              </div>

              <div className="flex items-end gap-1 h-16 sm:h-24 w-full">
                <div className="flex-1 bg-stone-700 rounded-t h-[40%] group-hover:bg-[#11ba82] transition-colors duration-300"></div>
                <div className="flex-1 bg-stone-700 rounded-t h-[60%] group-hover:bg-[#11ba82] transition-colors duration-300 delay-75"></div>
                <div className="flex-1 bg-stone-700 rounded-t h-[30%] group-hover:bg-[#11ba82] transition-colors duration-300 delay-100"></div>
                <div className="flex-1 bg-stone-700 rounded-t h-[80%] group-hover:bg-[#11ba82] transition-colors duration-300 delay-150"></div>
                <div className="flex-1 bg-stone-700 rounded-t h-[55%] group-hover:bg-[#11ba82] transition-colors duration-300 delay-200"></div>
              </div>

              <p className="mt-3 sm:mt-4 text-2xl sm:text-3xl font-display font-bold">
                $3,240.50
                <span className="text-xs sm:text-sm font-normal text-stone-400 ml-1">
                  revenue
                </span>
              </p>
            </div>

            {/* Card 3 - Global Monetization */}
            {/* <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-stone-200 bg-white shadow-sm flex flex-col justify-between group hover:border-blue-200 transition-all reveal-on-scroll delay-100">
              <div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-3 sm:mb-4">
                  <span
                    className="iconify"
                    data-icon="lucide:globe"
                    data-width="20"
                  ></span>
                </div>
                <h3 className="font-display font-bold text-base sm:text-lg">
                  Global Monetization
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 mt-2">
                  Earn from visitors anywhere in the world.
                </p>
              </div>
            </div> */}

            {/* <div className="relative rounded-2xl sm:rounded-3xl border border-stone-200 bg-white shadow-sm flex flex-col group hover:border-blue-200 transition-all reveal-on-scroll delay-100 overflow-hidden">
             
              <img
                src="/secondgrid.jpeg"
                alt="Manage links preview"
                className="w-full h-[180px] sm:h-[220px] object-cover"
              />

             
              <div className="p-0 sm:pl-6 ">
                <h3 className="font-display font-bold text-base sm:text-sm text-black">
                  Smart Ad Placement
                </h3>

                <p className="text-xs sm:text-xs text-stone-800 mt-0">
                  Ads blend naturally with your links, never spammy.
                </p>
              </div>
            </div> */}

            {/* DESKTOP CARD */}
            <div className="hidden sm:flex relative rounded-2xl sm:rounded-3xl border border-stone-200 bg-white shadow-sm flex-col group hover:border-blue-200 transition-all reveal-on-scroll delay-100 overflow-hidden">
              <img
                src="/secondgrid.jpeg"
                alt="Manage links preview"
                className="w-full h-[180px] sm:h-[220px] object-cover"
              />

              <div className="p-0 sm:pl-6 sm:mb-2">
                <h3 className="font-display font-bold text-base sm:text-sm text-[#10b981]">
                  Manage your links as you wish
                </h3>

                <p className="text-xs sm:text-xs text-stone-800 mt-0">
                  Optimize your links with YNLinks.com.
                </p>
              </div>
            </div>

            {/* MOBILE CARD */}
            <div className="sm:hidden bg-white rounded-2xl shadow-sm border border-stone-200 p-4">
              <img
                src="/secondgrid.jpeg"
                alt="Manage links preview"
                className="w-full rounded-xl mb-4"
              />

              <h3 className="text-lg font-semibold text-[#10b981] mb-2">
                Manage your links as you wish
              </h3>

              <p className="text-sm text-stone-800 leading-relaxed">
                Optimize your links. YNLinks.com allows you to connect any links
                and effectively manage your audience.
              </p>
            </div>

            {/* Card 4 - Smart Ad Placement */}
            <div className="rounded-2xl sm:rounded-3xl p-0 border border-stone-200 bg-black overflow-hidden relative group reveal-on-scroll min-h-[180px] sm:min-h-0">
              <img
                src="https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&w=600&q=80"
                className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity absolute inset-0"
              />
              <div className="relative z-10 flex flex-col justify-end p-5 sm:p-6 h-full min-h-[180px] sm:min-h-full">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  <span
                    className="iconify"
                    data-icon="lucide:play"
                    data-width="16"
                  ></span>
                </div>
                <h3 className="font-display font-bold text-base sm:text-lg text-white">
                  Smart Ad Placement
                </h3>
                <p className="text-xs sm:text-sm text-stone-300">
                  Ads blend naturally with your links, never spammy.
                </p>
              </div>
            </div>

            {/* Card 5 - Smart Linking */}
            <div
              className="
                sm:col-span-1
                sm:row-span-2
                rounded-2xl sm:rounded-3xl
                bg-gradient-to-br from-emerald-50 via-white to-teal-50
                border border-stone-200
                shadow-lg
                p-1 sm:p-2
                flex flex-col justify-between
                text-center
                reveal-on-scroll
                relative
                overflow-hidden
                group
              "
            >
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#00d66f]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-400/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

              {/* Animated Grid Pattern */}
              <div className="absolute inset-0 opacity-[0.02]">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `linear-gradient(#00d66f 1px, transparent 1px), linear-gradient(90deg, #00d66f 1px, transparent 1px)`,
                    backgroundSize: "20px 20px",
                  }}
                ></div>
              </div>

              {/* Content - with relative positioning to stay above decorative elements */}
              <div className="relative z-10">
                <div className="">
                  {/* IMAGE */}
                  <img
                    src="/analytics.jpeg"
                    alt="Analytics preview"
                    className="w-full h-[260px] sm:h-[320px] object-contain"
                  />

                  {/* HEADING SECTION (ADDED AFTER IMAGE) */}
                  <div className="px-4 sm:px-6 pt-2 text-center">
                    <div className="inline-flex items-center gap-1 bg-[#10b981] text-white px-2 py-2 rounded-xl shadow-md mb-1">
                      <svg
                        className="w-5 h-5 mt-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 13a5 5 0 007.54.54l1.42-1.42a5 5 0 00-7.07-7.07L10.5 6.5"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 11a5 5 0 01-7.54-.54L5.04 9.04a5 5 0 017.07-7.07L13.5 3.5"
                        />
                      </svg>
                      <span className="font-semibold text-lg sm:text-base">
                        The One link
                      </span>
                    </div>

                    <p className="text-black font-bold text-base sm:text-lg">
                      To rule them all
                    </p>
                  </div>

                  {/* FEATURES LIST */}
                  <div className="p-4 sm:p-2 space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-emerald-100 flex items-center justify-center">
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4 text-[#00d66f]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-700 font-medium">
                        Unlimited link customization
                      </p>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-emerald-100 flex items-center justify-center">
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4 text-[#00d66f]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-700 font-medium">
                        Advanced analytics dashboard
                      </p>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-emerald-100 flex items-center justify-center">
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4 text-[#00d66f]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-700 font-medium">
                        Monetization built-in
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 6 - Fast Payouts */}
            <div className="sm:col-span-2 lg:col-span-2 bg-[#F2FCE2] rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-[#e2f0d9] shadow-sm relative overflow-hidden group reveal-on-scroll delay-75">
              <div className="relative z-10 max-w-xs">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-900 text-white flex items-center justify-center mb-3 sm:mb-4">
                  <span
                    className="iconify"
                    data-icon="lucide:dollar-sign"
                    data-width="24"
                  ></span>
                </div>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-green-900 mb-2">
                  Fast Payouts
                </h3>
                <p className="text-sm sm:text-base text-green-800/80">
                  Withdraw earnings easily once threshold is reached. Daily
                  payments available.
                </p>
                <button className="mt-4 sm:mt-6 bg-green-900 text-white px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold hover:bg-green-800 transition-colors">
                  View Options
                </button>
              </div>

              <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 hidden md:block">
                <div className="w-40 sm:w-48 h-28 sm:h-32 bg-white rounded-xl shadow-lg border border-green-100 p-3 sm:p-4 rotate-3 group-hover:rotate-6 transition-transform">
                  <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <span className="text-[10px] sm:text-xs font-bold text-stone-400">
                      BALANCE
                    </span>
                    <span className="text-green-600">
                      <span
                        className="iconify"
                        data-icon="lucide:trending-up"
                      ></span>
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-display font-bold text-stone-900">
                    $4,290.00
                  </div>
                </div>
              </div>
            </div>

            {/* Card 7 - Short Links */}
            <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-stone-200 bg-white shadow-sm flex flex-col items-center justify-center text-center group hover:border-[#10b981]/50 transition-all reveal-on-scroll delay-100">
              <div className="w-20 h-20 sm:w-32 sm:h-32 bg-[#000000] rounded-lg sm:rounded-xl mb-3 sm:mb-4 p-2 group-hover:scale-105 transition-transform">
                <span
                  className="iconify w-full h-full text-[#10b981]"
                  data-icon="lucide:link"
                ></span>
              </div>
              <h3 className="font-display font-bold text-base text-[#10b981] sm:text-xl">
                Short Links
              </h3>
              <p className="text-xs sm:text-sm text-stone-700">
                Share branded short links that also earn revenue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <h3 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-[#111111] mb-2">
                23K+
              </h3>
              <p className="text-sm text-gray-600 font-medium">Total Clicks</p>
            </div>

            <div className="text-center">
              <h3 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-[#111111] mb-2">
                65K+
              </h3>
              <p className="text-sm text-gray-600 font-medium">Total Links</p>
            </div>

            <div className="text-center">
              <h3 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-[#111111] mb-2">
                1.4K+
              </h3>
              <p className="text-sm text-gray-600 font-medium">Creators</p>
            </div>

            <div className="text-center">
              <h3 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-[#2EE6A6] mb-2">
                $11K+
              </h3>
              <p className="text-sm text-gray-600 font-medium">Paid Out</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Globe size={48} className="text-[#2EE6A6]" />
                <div>
                  <h3 className="font-display text-xl font-bold text-[#111111] mb-1">
                    Trusted Globally
                  </h3>
                  <p className="text-gray-600">
                    Creators from 195 countries use YNLinks
                  </p>
                </div>
              </div>
              <div className="flex -space-x-2">
                <div className="w-12 h-12 rounded-full border-4 border-white bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  US
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-white bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  IN
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-white bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  UK
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-white bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  AU
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-white bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  CA
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      {/* <div className="w-full py-8 border-y border-stone-800 bg-black overflow-hidden">
        <marquee behavior="scroll" direction="left" scrollamount="10">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-[#e6bb44] drop-shadow-[0_0_6px_rgba(230,187,68,0.6)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>

              <span className="text-2xl font-display font-bold text-[#03cd69] uppercase tracking-tighter">
                PASSIVE INCOME
              </span>
            </div>

            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-[#e6bb44] drop-shadow-[0_0_6px_rgba(230,187,68,0.6)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-2xl font-display font-bold text-[#03cd69] uppercase tracking-tighter">
                GLOBAL ADS
              </span>
            </div>

            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-[#e6bb44] drop-shadow-[0_0_6px_rgba(230,187,68,0.6)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-2xl font-display font-bold text-[#03cd69] uppercase tracking-tighter">
                LINK IN BIO MONETIZATION
              </span>
            </div>

            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-[#e6bb44] drop-shadow-[0_0_6px_rgba(230,187,68,0.6)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-2xl font-display font-bold text-[#03cd69] uppercase tracking-tighter">
                CREATOR FIRST
              </span>
            </div>

           
            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-[#e6bb44] drop-shadow-[0_0_6px_rgba(230,187,68,0.6)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-2xl font-display font-bold text-[#03cd69] uppercase tracking-tighter">
                Earn From Clicks
              </span>
            </div>
          </div>
        </marquee>
      </div> */}

      {/* <div className="w-full py-4 border-y border-stone-800 bg-black overflow-hidden">
        <div className="relative flex overflow-hidden">
          <div className="flex min-w-max animate-marquee gap-12">
            {Array(3)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="flex items-center gap-12">
                  {[
                    "PASSIVE INCOME",
                    "GLOBAL ADS",
                    "LINK IN BIO MONETIZATION",
                    "CREATOR FIRST",
                    "EARN FROM CLICKS",
                  ].map((text, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <svg
                        className="w-8 h-8 text-[#e6bb44] drop-shadow-[0_0_6px_rgba(230,187,68,0.6)]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>

                      <span className="text-6xl font-display font-bold text-[#03cd69] uppercase tracking-tighter whitespace-nowrap">
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>
 */}

      <div className="w-full py-4 border-y border-stone-800 bg-black overflow-hidden">
  <div className="relative flex overflow-hidden">
    <div className="flex min-w-max animate-marquee">
      {Array(2)
        .fill(null)
        .map((_, i) => (
          <div key={i} className="flex items-center gap-20">
            {[
              "PASSIVE INCOME",
              "GLOBAL ADS",
              "LINK IN BIO MONETIZATION",
              "CREATOR FIRST",
              "EARN FROM CLICKS",
            ].map((text, index) => (
              <div key={index} className="flex items-center gap-4 px-10">
                <svg
                  className="w-8 h-8 text-[#e6bb44] drop-shadow-[0_0_6px_rgba(230,187,68,0.6)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-6xl font-display font-bold text-[#03cd69] uppercase tracking-tighter whitespace-nowrap">
                  {text}
                </span>
              </div>
            ))}
          </div>
        ))}
    </div>
  </div>
</div>

      <section className="py-16 sm:py-20 md:py-24 bg-white" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20 reveal">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4 text-[#111111]">
              How It Works
            </h2>
            <p className="text-gray-600 text-base sm:text-lg px-4 sm:px-0">
              Start earning in minutes. No technical knowledge required.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {/* CARD 1 */}
            <div className="relative group">
              <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-12 h-12 sm:w-16 sm:h-16 bg-[#2EE6A6]/10 rounded-full flex items-center justify-center">
                <span className="text-lg sm:text-2xl font-bold text-[#03cd69]">
                  1
                </span>
              </div>

              <div className="bg-gray-50 p-5 sm:p-8 rounded-2xl hover:shadow-lg transition-all h-full pt-8 sm:pt-12">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#10b981] text-white rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <PenTool size={18} className="sm:hidden" />
                  <PenTool size={22} className="hidden sm:block" />
                </div>

                <h3 className="font-display text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-[#111111]">
                  Sign Up Free
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Create your account in seconds. No credit card required.
                </p>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="relative group">
              <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-12 h-12 sm:w-16 sm:h-16 bg-[#2EE6A6]/10 rounded-full flex items-center justify-center">
                <span className="text-lg sm:text-2xl font-bold text-[#03cd69]">
                  2
                </span>
              </div>

              <div className="bg-gray-50 p-5 sm:p-8 rounded-2xl hover:shadow-lg transition-all h-full pt-8 sm:pt-12">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#10b981] text-white rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <Link2 size={18} className="sm:hidden" />
                  <Link2 size={22} className="hidden sm:block" />
                </div>

                <h3 className="font-display text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-[#111111]">
                  Add Your Links
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Add all your important links to your custom bio page.
                </p>
              </div>
            </div>

            {/* CARD 3 */}
            <div className="relative group">
              <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-12 h-12 sm:w-16 sm:h-16 bg-[#2EE6A6]/10 rounded-full flex items-center justify-center">
                <span className="text-lg sm:text-2xl font-bold text-[#03cd69]">
                  3
                </span>
              </div>

              <div className="bg-gray-50 p-5 sm:p-8 rounded-2xl hover:shadow-lg transition-all h-full pt-8 sm:pt-12">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#10b981] text-white rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <Share2 size={18} className="sm:hidden" />
                  <Share2 size={22} className="hidden sm:block" />
                </div>

                <h3 className="font-display text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-[#111111]">
                  Share Your Link
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Share your bio link across all your social platforms.
                </p>
              </div>
            </div>

            {/* CARD 4 */}
            <div className="relative group">
              <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-12 h-12 sm:w-16 sm:h-16 bg-[#2EE6A6]/10 rounded-full flex items-center justify-center">
                <span className="text-lg sm:text-2xl font-bold text-[#03cd69]">
                  4
                </span>
              </div>

              <div className="bg-[#1c1917] text-white p-5 sm:p-8 rounded-2xl hover:shadow-xl hover:shadow-[#2EE6A6]/30 transition-all h-full pt-8 sm:pt-12">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white text-[#03cd69] rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <DollarSign size={18} className="sm:hidden" />
                  <DollarSign size={22} className="hidden sm:block" />
                </div>

                <h3 className="font-display text-[#10b981] text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                  Start Earning
                </h3>
                <p className="text-sm text-[#10b981] leading-relaxed">
                  Earn automatically from every visitor. No extra work needed.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center reveal">
            <Link
              href="/sign-up"
              className="bg-[#111111] text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all inline-flex items-center gap-2"
            >
              Get Started Now
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* DESKTOP SECTION */}
      <section className="hidden lg:block py-14 bg-stone-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#03cd69] rounded-full blur-[120px] opacity-10"></div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block px-3 py-1 rounded-full border border-stone-700 bg-stone-800/50 text-xs font-semibold text-[#03cd69] mb-6">
              ANALYTICS
            </span>

            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Real-time Data <br />
              <span className="text-[#03cd69]">Track earnings.</span>
            </h2>

            <div className="grid grid-cols-2 gap-8 mt-12">
              <div>
                <div className="text-4xl font-bold">142k</div>
                <div className="text-stone-400 text-sm">Total Clicks</div>
              </div>

              <div>
                <div className="text-4xl font-bold">28k</div>
                <div className="text-stone-400 text-sm">Ad Clicks</div>
              </div>

              <div>
                <div className="text-4xl font-bold">$3.2k</div>
                <div className="text-stone-400 text-sm">Est. Revenue</div>
              </div>

              <div>
                <div className="text-4xl font-bold">$458</div>
                <div className="text-stone-400 text-sm">Weekly Earnings</div>
              </div>
            </div>
          </div>

          {/* Avatar Grid */}
          <div className="relative h-[400px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent z-10"></div>
            <div className="grid grid-cols-4 gap-4 h-full">
              <div className="overflow-hidden rounded-2xl">
                <img
                  className="opacity-70 w-full h-full object-cover object-center"
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300"
                />
              </div>
              <div className="col-span-2 overflow-hidden rounded-2xl translate-y-8">
                <img
                  className="opacity-70 w-full h-full object-cover object-center"
                  src="https://images.unsplash.com/photo-1613634232667-224ae71a307a?w=800"
                />
              </div>
              <div className="overflow-hidden rounded-2xl">
                <img
                  className="opacity-70 w-full h-full object-cover object-center"
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300"
                />
              </div>
              <div className="col-span-2 row-span-1 overflow-hidden rounded-2xl -translate-y-4">
                <img
                  className="opacity-70 w-full h-full object-cover object-center"
                  src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500"
                />
              </div>
              <div className="overflow-hidden rounded-2xl translate-y-4">
                <img
                  className="opacity-70 w-full h-full object-cover object-center"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300"
                />
              </div>
              <div className="overflow-hidden rounded-2xl">
                <img
                  className="opacity-70 w-full h-full object-cover object-center"
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE SECTION */}
      <section className="lg:hidden py-12 bg-stone-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#03cd69] rounded-full blur-[100px] opacity-10"></div>

        <div className="px-5 flex flex-col gap-10">
          {/* Text */}
          <div className="text-center">
            <span className="inline-block px-3 py-1 rounded-full border border-stone-700 bg-stone-800/50 text-xs font-semibold text-[#03cd69] mb-4">
              ANALYTICS
            </span>

            <h2 className="text-3xl font-bold leading-tight mb-4">
              Real-time Data <br />
              <span className="text-[#03cd69]">Track earnings.</span>
            </h2>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold">142k</div>
              <div className="text-stone-400 text-sm">Total Clicks</div>
            </div>

            <div>
              <div className="text-3xl font-bold">28k</div>
              <div className="text-stone-400 text-sm">Ad Clicks</div>
            </div>

            <div>
              <div className="text-3xl font-bold">$3.2k</div>
              <div className="text-stone-400 text-sm">Revenue</div>
            </div>

            <div>
              <div className="text-3xl font-bold">$458</div>
              <div className="text-stone-400 text-sm">Weekly</div>
            </div>
          </div>

          {/* Avatars */}
          <div className="grid grid-cols-3 gap-3">
            <img
              className="rounded-xl opacity-70"
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300"
            />
            <img
              className="rounded-xl opacity-70"
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300"
            />
            <img
              className="rounded-xl opacity-70"
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300"
            />
            <img
              className="rounded-xl opacity-70"
              src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300"
            />
            <img
              className="rounded-xl opacity-70"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300"
            />
            <img
              className="rounded-xl opacity-70"
              src="https://images.unsplash.com/photo-1613634232667-224ae71a307a?w=300"
            />
          </div>
        </div>
      </section>

     
  

      <section className="bg-white h-50 flex items-center justify-center py-20">
        <div className="bg-white h-50 flex items-center justify-center p-1 font-['Inter',sans-serif]">
          <div className="flex flex-col w-full">
            {/* Badge */}

            {/* Icons */}
            <div className="flex flex-col items-center gap-3 py-1">
              {/* Blue Badge */}
              <div className="bg-[#10b981] text-white px-4 py-3 rounded-md text-5xl font-semibold mb-2">
                Connect to
              </div>

              {/* Text */}
              <p className="text-[#10b981] text-xl font-semibold mb-4">
                Everything you adore
              </p>

              {/* Icons Row - Horizontal Slider */}
              <div className="w-full overflow-hidden">
                <div
                  className="flex items-center gap-2.5 animate-scroll-left"
                  style={{
                    animation: "scrollLeft 20s linear infinite",
                    width: "max-content",
                  }}
                >
                  {/* Twitch */}
                  <div className="w-7 h-7 sm:w-9 sm:h-9 bg-[#9146FF] rounded-md flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
                    </svg>
                  </div>

                  {/* Reddit */}
                  <div className="w-9 h-9 bg-[#FF4500] rounded-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                    </svg>
                  </div>

                  {/* Apple */}
                  <div className="w-9 h-9 bg-black rounded-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                  </div>

                  {/* Amazon */}
                  <div className="w-9 h-9 bg-[#FF9900] rounded-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-black"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.654-1.244.743-2.64 1.316-4.185 1.726-1.53.406-3.045.608-4.516.608-2.595 0-5.39-.56-8.388-1.684-1.096-.41-2.042-.82-2.857-1.224-.105-.054-.18-.127-.21-.215l-.113-.343.597.39zm14.384-4.103c-.483.488-1.214.73-2.19.73-.93 0-1.68-.24-2.25-.72-.57-.48-.855-1.135-.855-1.965 0-.81.27-1.455.81-1.935.54-.48 1.275-.72 2.205-.72.93 0 1.68.24 2.25.72.57.48.855 1.125.855 1.935 0 .825-.275 1.485-.825 1.965v-.01zm-4.44-7.005c.36-.405.87-.607 1.53-.607.675 0 1.185.202 1.53.607.345.405.517.945.517 1.62v.315c0 .135-.045.225-.135.27-.09.045-.27.023-.54-.068-.27-.09-.585-.135-.945-.135-.36 0-.69.045-.99.135-.3.09-.51.135-.63.135-.12 0-.225-.045-.315-.135-.09-.09-.135-.202-.135-.337v-.315c0-.675.165-1.215.495-1.62l.022-.045zm7.425 9.945c-.36 0-.705-.045-1.035-.135-.33-.09-.615-.225-.855-.405-.24-.18-.405-.405-.495-.675-.09-.27-.045-.57.135-.9.18-.33.42-.495.72-.495.18 0 .36.045.54.135.18.09.345.202.495.337.15.135.315.247.495.337.18.09.405.135.675.135.36 0 .645-.09.855-.27.21-.18.315-.42.315-.72 0-.27-.09-.495-.27-.675-.18-.18-.42-.315-.72-.405-.3-.09-.63-.18-.99-.27-.36-.09-.72-.202-1.08-.337-.36-.135-.675-.315-.945-.54-.27-.225-.48-.51-.63-.855-.15-.345-.225-.765-.225-1.26 0-.675.165-1.26.495-1.755.33-.495.78-.87 1.35-1.125.57-.255 1.215-.382 1.935-.382.48 0 .915.067 1.305.202.39.135.72.315.99.54.27.225.48.495.63.81.15.315.165.63.045.945-.12.315-.345.495-.675.54-.225.03-.48-.015-.765-.135-.285-.12-.585-.225-.9-.315-.315-.09-.63-.135-.945-.135-.45 0-.81.09-1.08.27-.27.18-.405.45-.405.81 0 .27.09.495.27.675.18.18.42.315.72.405.3.09.63.18.99.27.36.09.72.202 1.08.337.36.135.675.315.945.54.27.225.48.51.63.855.15.345.225.765.225 1.26 0 .675-.165 1.26-.495 1.755-.33.495-.78.87-1.35 1.125-.57.255-1.215.382-1.935.382z" />
                    </svg>
                  </div>

                  {/* PayPal */}
                  <div className="w-9 h-9 bg-[#003087] rounded-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8.32 23.295c-.26 0-.52-.052-.764-.158a1.814 1.814 0 01-.97-1.316l-1.55-9.83H2.58c-.89 0-1.6-.76-1.53-1.648C1.52 4.154 5.89.002 11.14.002h5.784c1.562 0 2.94.878 3.548 2.264.535 1.217.694 2.657.433 3.946l-1.474 7.296c-.29 1.434-1.517 2.45-2.996 2.45h-4.44c-.89 0-1.6.76-1.53 1.648l-.002.002.86 5.448c.065.408-.02.82-.235 1.15-.214.33-.543.578-.927.698-.29.09-.59.136-.888.136l.013.255zm5.062-20.78h-5.78c-3.76 0-6.88 2.958-7.34 6.96h3.67c.89 0 1.6.76 1.53 1.648l1.67 10.574c.065.408.437.698.858.698.13 0 .26-.03.374-.08.247-.102.408-.345.408-.627l-.902-5.716h.002c-.29-1.434 1.517-2.45 2.996-2.45h4.44c.89 0 1.6-.76 1.53-1.648l1.488-7.353c.188-.93.082-1.916-.29-2.704-.37-.788-1.034-1.3-1.82-1.3l.166-.002z" />
                    </svg>
                  </div>

                  {/* YouTube */}
                  <div className="w-9 h-9 bg-[#FF0000] rounded-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </div>

                  {/* Instagram */}
                  <div className="w-9 h-9 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </div>

                  {/* Facebook */}
                  <div className="w-9 h-9 bg-[#1877F2] rounded-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>

                  {/* Twitter / X */}
                  <div className="w-9 h-9 bg-black rounded-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.2 2H21l-6.5 7.4L22 22h-6.7l-5.2-6.5L4.6 22H2l6.9-7.9L2 2h6.8l4.7 5.9L18.2 2z" />
                    </svg>
                  </div>

                  {/* LinkedIn */}
                  <div className="w-9 h-9 bg-[#0A66C2] rounded-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5zM3 8.98h4v12H3zM9 8.98h3.8v1.6h.1c.5-.9 1.8-1.8 3.7-1.8 4 0 4.7 2.6 4.7 6v6.2h-4v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.6H9z" />
                    </svg>
                  </div>
                  {/* WhatsApp */}
                  <div className="w-9 h-9 bg-[#25D366] rounded-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2z" />
                    </svg>
                  </div>

                  {/* Telegram */}
                  <div className="w-9 h-9 bg-[#229ED9] rounded-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9.6 16.7l-.4 3.8c.6 0 .9-.3 1.3-.6l3.1-3 6.4 4.7c1.2.7 2 .3 2.3-1.1L24 3.7c.4-1.8-.6-2.6-1.8-2.1L1.3 9.7C-.4 10.4-.4 11.4 1 11.8l5.4 1.7L19.6 5.4c.6-.4 1.1-.2.7.2" />
                    </svg>
                  </div>
                  {/* TikTok */}
                  <div className="w-9 h-9 bg-black rounded-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                    </svg>
                  </div>

                  {/* LinkedIn */}
                  <div className="w-9 h-9 bg-[#0077B5] rounded-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>

                  {/* Snapchat */}
                  <div className="w-9 h-9 bg-[#FFFC00] rounded-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-black"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3 0 .588-.15.767-.15.303 0 .548.18.548.528 0 .286-.27.496-.736.686-.12.048-.259.097-.412.153-.456.181-.75.421-.976.676.362.112.744.279 1.053.418.27.12.582.27.582.602 0 .468-.596.81-1.278.81-.279 0-.54-.06-.735-.135-.15-.06-.33-.135-.495-.195a4.55 4.55 0 0 0-.762-.135c-.391 0-.7.165-.985.3-.3.135-.586.27-.945.27-.495 0-.884-.354-1.144-.659-.09-.104-.165-.195-.225-.27-.375-.495-.87-1.176-1.86-1.176-.99 0-1.485.681-1.86 1.176-.06.075-.136.166-.226.27-.259.305-.648.659-1.143.659-.36 0-.645-.135-.945-.27-.285-.135-.594-.3-.985-.3a4.62 4.62 0 0 0-.762.135c-.166.06-.346.135-.496.195-.195.075-.456.135-.735.135-.682 0-1.278-.342-1.278-.81 0-.332.312-.482.582-.602.309-.14.69-.306 1.053-.418-.226-.255-.52-.495-.976-.676a6.69 6.69 0 0 1-.412-.153c-.465-.19-.735-.4-.735-.686 0-.348.244-.528.547-.528.18 0 .467.15.768.15.197 0 .326-.045.401-.09a42.14 42.14 0 0 1-.03-.51l-.003-.06c-.104-1.628-.23-3.654.299-4.847 1.583-3.545 4.94-3.821 5.93-3.821z" />
                    </svg>
                  </div>

                  {/* Google */}
                  <div className="w-9 h-9 bg-white rounded-md flex items-center justify-center border border-gray-200">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </div>

                  {/* Substack */}
                  <div className="w-9 h-9 bg-[#FF6719] rounded-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
                    </svg>
                  </div>

                  {/* Vimeo */}
                  <div className="w-9 h-9 bg-[#1AB7EA] rounded-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197a315.065 315.065 0 0 0 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.797l-.013.01z" />
                    </svg>
                  </div>

                  {/* Messenger */}
                  <div className="w-9 h-9 bg-gradient-to-br from-[#00B2FF] to-[#006AFF] rounded-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.11C24 4.975 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z" />
                    </svg>
                  </div>

                  {/* Duplicate icons for seamless loop */}
                  <div className="w-7 h-7 sm:w-9 sm:h-9 bg-[#9146FF] rounded-md flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
                    </svg>
                  </div>
                  <div className="w-9 h-9 bg-[#FF4500] rounded-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                    </svg>
                  </div>
                  <div className="w-9 h-9 bg-black rounded-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                  </div>
                  <div className="w-9 h-9 bg-[#FF9900] rounded-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-black"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.654-1.244.743-2.64 1.316-4.185 1.726-1.53.406-3.045.608-4.516.608-2.595 0-5.39-.56-8.388-1.684-1.096-.41-2.042-.82-2.857-1.224-.105-.054-.18-.127-.21-.215l-.113-.343.597.39z" />
                    </svg>
                  </div>
                  <div className="w-9 h-9 bg-[#003087] rounded-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8.32 23.295c-.26 0-.52-.052-.764-.158a1.814 1.814 0 01-.97-1.316l-1.55-9.83H2.58c-.89 0-1.6-.76-1.53-1.648C1.52 4.154 5.89.002 11.14.002h5.784c1.562 0 2.94.878 3.548 2.264.535 1.217.694 2.657.433 3.946l-1.474 7.296c-.29 1.434-1.517 2.45-2.996 2.45h-4.44c-.89 0-1.6.76-1.53 1.648l-.002.002.86 5.448c.065.408-.02.82-.235 1.15-.214.33-.543.578-.927.698-.29.09-.59.136-.888.136l.013.255z" />
                    </svg>
                  </div>
                  <div className="w-9 h-9 bg-[#FF0000] rounded-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </div>
                  <div className="w-9 h-9 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </div>
                  <div className="w-9 h-9 bg-[#1877F2] rounded-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <div className="w-9 h-9 bg-black rounded-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.2 2H21l-6.5 7.4L22 22h-6.7l-5.2-6.5L4.6 22H2l6.9-7.9L2 2h6.8l4.7 5.9L18.2 2z" />
                    </svg>
                  </div>
                  <div className="w-9 h-9 bg-[#0A66C2] rounded-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5zM3 8.98h4v12H3zM9 8.98h3.8v1.6h.1c.5-.9 1.8-1.8 3.7-1.8 4 0 4.7 2.6 4.7 6v6.2h-4v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.6H9z" />
                    </svg>
                  </div>
                  <div className="w-9 h-9 bg-[#25D366] rounded-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2z" />
                    </svg>
                  </div>
                  <div className="w-9 h-9 bg-[#229ED9] rounded-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9.6 16.7l-.4 3.8c.6 0 .9-.3 1.3-.6l3.1-3 6.4 4.7c1.2.7 2 .3 2.3-1.1L24 3.7c.4-1.8-.6-2.6-1.8-2.1L1.3 9.7C-.4 10.4-.4 11.4 1 11.8l5.4 1.7L19.6 5.4c.6-.4 1.1-.2.7.2" />
                    </svg>
                  </div>
                  <div className="w-9 h-9 bg-black rounded-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                    </svg>
                  </div>
                  <div className="w-9 h-9 bg-[#0077B5] rounded-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                  <div className="w-9 h-9 bg-[#FFFC00] rounded-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-black"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3 0 .588-.15.767-.15.303 0 .548.18.548.528 0 .286-.27.496-.736.686-.12.048-.259.097-.412.153-.456.181-.75.421-.976.676.362.112.744.279 1.053.418.27.12.582.27.582.602 0 .468-.596.81-1.278.81-.279 0-.54-.06-.735-.135-.15-.06-.33-.135-.495-.195a4.55 4.55 0 0 0-.762-.135c-.391 0-.7.165-.985.3-.3.135-.586.27-.945.27-.495 0-.884-.354-1.144-.659-.09-.104-.165-.195-.225-.27-.375-.495-.87-1.176-1.86-1.176-.99 0-1.485.681-1.86 1.176-.06.075-.136.166-.226.27-.259.305-.648.659-1.143.659-.36 0-.645-.135-.945-.27-.285-.135-.594-.3-.985-.3a4.62 4.62 0 0 0-.762.135c-.166.06-.346.135-.496.195-.195.075-.456.135-.735.135-.682 0-1.278-.342-1.278-.81 0-.332.312-.482.582-.602.309-.14.69-.306 1.053-.418-.226-.255-.52-.495-.976-.676a6.69 6.69 0 0 1-.412-.153c-.465-.19-.735-.4-.735-.686 0-.348.244-.528.547-.528.18 0 .467.15.768.15.197 0 .326-.045.401-.09a42.14 42.14 0 0 1-.03-.51l-.003-.06c-.104-1.628-.23-3.654.299-4.847 1.583-3.545 4.94-3.821 5.93-3.821z" />
                    </svg>
                  </div>
                  <div className="w-9 h-9 bg-white rounded-md flex items-center justify-center border border-gray-200">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </div>
                  <div className="w-9 h-9 bg-[#FF6719] rounded-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
                    </svg>
                  </div>
                  <div className="w-9 h-9 bg-[#1AB7EA] rounded-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197a315.065 315.065 0 0 0 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.797l-.013.01z" />
                    </svg>
                  </div>
                  <div className="w-9 h-9 bg-gradient-to-br from-[#00B2FF] to-[#006AFF] rounded-md flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.11C24 4.975 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[#111111]">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-lg">
              Everything you need to know about YNLinks
            </p>
          </div>

          <div className="space-y-4">
            <details className="group bg-white p-6 rounded-xl cursor-pointer border border-gray-200 hover:border-[#2EE6A6] transition-all">
              <summary className="flex justify-between items-center font-semibold text-lg text-[#111111]">
                Is YNLinks really free to use?
                <ChevronDown
                  className="transform transition-transform group-open:rotate-180 text-[#2EE6A6]"
                  size={24}
                />
              </summary>
              <p className="text-gray-600 mt-4 leading-relaxed">
                Yes, absolutely! Creators never pay anything. You earn revenue
                from ads shown to your visitors. There are no hidden fees, setup
                costs, or monthly charges.
              </p>
            </details>

            <details className="group bg-white p-6 rounded-xl cursor-pointer border border-gray-200 hover:border-[#2EE6A6] transition-all">
              <summary className="flex justify-between items-center font-semibold text-lg text-[#111111]">
                How do the ads work?
                <ChevronDown
                  className="transform transition-transform group-open:rotate-180 text-[#2EE6A6]"
                  size={24}
                />
              </summary>
              <p className="text-gray-600 mt-4 leading-relaxed">
                Premium ads from top networks are intelligently placed between
                your links. They&apos;re matched to your audience and region for
                maximum relevance and earnings. Visitors see ads naturally
                integrated with your content.
              </p>
            </details>

            <details className="group bg-white p-6 rounded-xl cursor-pointer border border-gray-200 hover:border-[#2EE6A6] transition-all">
              <summary className="flex justify-between items-center font-semibold text-lg text-[#111111]">
                How much can I earn?
                <ChevronDown
                  className="transform transition-transform group-open:rotate-180 text-[#2EE6A6]"
                  size={24}
                />
              </summary>
              <p className="text-gray-600 mt-4 leading-relaxed">
                Earnings depend on your traffic volume and audience location.
                Creators typically earn $0.50-$5 per 1000 visitors. With
                consistent traffic, many creators earn $100-$500+ monthly.
              </p>
            </details>

            <details className="group bg-white p-6 rounded-xl cursor-pointer border border-gray-200 hover:border-[#2EE6A6] transition-all">
              <summary className="flex justify-between items-center font-semibold text-lg text-[#111111]">
                When and how do I get paid?
                <ChevronDown
                  className="transform transition-transform group-open:rotate-180 text-[#2EE6A6]"
                  size={24}
                />
              </summary>
              <p className="text-gray-600 mt-4 leading-relaxed">
                You can request withdrawal once you reach the minimum threshold.
                Payments are processed quickly and sent directly to your bank
                account or preferred payment method.
              </p>
            </details>

            <details className="group bg-white p-6 rounded-xl cursor-pointer border border-gray-200 hover:border-[#2EE6A6] transition-all">
              <summary className="flex justify-between items-center font-semibold text-lg text-[#111111]">
                Will this affect my brand or audience trust?
                <ChevronDown
                  className="transform transition-transform group-open:rotate-180 text-[#2EE6A6]"
                  size={24}
                />
              </summary>
              <p className="text-gray-600 mt-4 leading-relaxed">
                No. We only show premium, brand-safe ads that are relevant and
                non-intrusive. Thousands of creators trust us to maintain their
                professional image while earning revenue.
              </p>
            </details>
          </div>
        </div>
      </section>

      <main className="w-full max-w-5xl mx-auto text-center py-10">
        {/* Main Headline */}
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[#111111]">
          Trusted by creators worldwide earning
          <span className="block text-[#10b981] mt-4">
            passive income daily
          </span>
        </h1>

        {/* Spacer */}
        <div className="h-20 md:h-8"></div>

        {/* Social Proof Section */}
        <div className="flex flex-col items-center">
          {/* Avatar Cluster */}
          <div className="flex items-center justify-center -space-x-4 mb-8">
            <img
              src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User"
              className="w-16 h-16 rounded-full border-[5px] border-white object-cover shadow-sm z-10"
            />
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User"
              className="w-16 h-16 rounded-full border-[5px] border-white object-cover shadow-sm z-20"
            />
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User"
              className="w-16 h-16 rounded-full border-[5px] border-white object-cover shadow-sm z-30"
            />
            <img
              src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User"
              className="w-16 h-16 rounded-full border-[5px] border-white object-cover shadow-sm z-40"
            />
            <img
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User"
              className="w-16 h-16 rounded-full border-[5px] border-white object-cover shadow-sm z-50"
            />
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User"
              className="w-16 h-16 rounded-full border-[5px] border-white object-cover shadow-sm z-[60]"
            />
          </div>

          {/* Customer Count */}
          <div className="text-2xl sm:text-3xl font-semibold text-[#111111] tracking-tight mb-3">
            10,878 creators
          </div>

          {/* Subtext */}
          <p className="text-lg text-slate-700 font-medium">
            from 195 countries trust YNLinks.com
          </p>
        </div>
      </main>

      <section className="bg-stone-50 min-h-[50vh] sm:min-h-[40vh] py-4 sm:py-2 flex items-center justify-center px-4 sm:p-8">
        <div className="w-full max-w-4xl">
          <div className="relative bg-[#10b981] rounded-2xl sm:rounded-[2.5rem] shadow-xl shadow-emerald-500/10 overflow-hidden isolate">
            <div className="relative z-10 flex flex-col items-center justify-center py-6 sm:py-4 px-6 sm:px-16 text-center">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-semibold text-neutral-900 tracking-tight leading-[1.1] mb-6 sm:mb-10 antialiased">
                Start earning with YNLinks.
              </h2>

              {/* Desktop Input Field */}
              <div
                className="hidden sm:flex w-full mb-10 sm:mb-4 mt-6 sm:mt-4 max-w-[400px] mx-auto lg:mx-0
                items-center justify-between gap-2 sm:gap-3
                rounded-xl bg-white p-1.5 pl-4 sm:pl-6
                ring-1 ring-gray-200
                shadow-[0_14px_30px_rgba(0,0,0,0.10)]
                hover:shadow-[0_18px_40px_rgba(0,0,0,0.16)]
                transition-all duration-300"
              >
                <div className="flex flex-1 items-center gap-1 overflow-hidden">
                  <div className="flex w-full items-center overflow-hidden whitespace-nowrap text-sm sm:text-lg">
                    <span className="shrink-0 text-gray-500 font-normal tracking-tight">
                      ynlinks.bio/
                    </span>
                    <input
                      type="text"
                      placeholder="you"
                      className="w-full min-w-0 border-none bg-transparent p-0 pl-0 text-gray-800 placeholder:text-gray-200 focus:outline-none focus:ring-0 font-normal"
                      spellCheck={false}
                    />
                  </div>
                </div>
                <Link href="/sign-up">
                  <button className="group relative shrink-0 rounded-xl bg-[#10b981] px-4 sm:px-4 py-2.5 sm:py-3.5 text-sm sm:text-lg font-semibold text-[#0a2e1f] transition-all hover:bg-[#10b981] hover:shadow-sm active:scale-[0.98]">
                    Get Started Now
                  </button>
                </Link>
              </div>

              {/* Mobile CTA Button */}
              <Link
                href="/sign-up"
                className="sm:hidden bg-neutral-950 text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-black transition-all"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#1c1917] pt-12 sm:pt-16 md:pt-10 pb-4 sm:pb-10 border-t border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 sm:gap-10 mb-12 sm:mb-6 md:mb-4">
            {/* Logo + Description */}
            <div className="col-span-2">
              {/* Logo + Brand */}
              <a href="#" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 flex items-center justify-center bg-stone-900 text-white rounded-lg">
                  <span
                    className="iconify"
                    data-icon="lucide:command"
                    data-width="20"
                  ></span>
                </div>
                <span className="font-display font-bold text-2xl tracking-tighter text-[#10b981]">
                  YNLinks
                </span>
              </a>

              {/* Description */}
              <p className="text-stone-100 text-lg max-w-xs leading-relaxed">
                The only link you&apos;ll ever need. Connect your audience to all of
                your content and earn from every click.
              </p>

              {/* Social Icons */}
              <div className="flex gap-4 mt-4 pr-6 text-stone-300">
                <a
                  href="https://www.instagram.com/ynlinks?utm_source=qr&igsh=cnd1Y24xMTZ3dWdo"
                  className="hover:text-stone-200 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span
                    className="iconify"
                    data-icon="lucide:instagram"
                    data-width="20"
                  ></span>
                </a>

                <a
                  href="https://www.facebook.com/profile.php?id=61586265811219"
                  className="hover:text-stone-200 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span
                    className="iconify"
                    data-icon="lucide:facebook"
                    data-width="20"
                  ></span>
                </a>
              </div>
            </div>

            {/* Company */}
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-2xl text-[#10b981]">Company</h4>
              <Link
                href="/about"
                className="text-sm text-stone-100 hover:text-stone-200 transition-colors"
                data-testid="link-about"
              >
                About YnLinks
              </Link>
              <Link
                href="/careers"
                className="text-sm text-stone-100 hover:text-stone-200 transition-colors"
                data-testid="link-careers"
              >
                Careers
              </Link>

              <Link
                href="/social-good"
                className="text-sm text-stone-100 hover:text-stone-200 transition-colors"
                data-testid="link-social-good"
              >
                Social Good
              </Link>
            </div>

            {/* Community */}
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-2xl text-[#10b981]">Community</h4>
              <Link
                href="/community"
                className="text-sm text-stone-100 hover:text-stone-200 transition-colors"
                data-testid="link-community"
              >
                Community
              </Link>
              <Link
                href="/blog"
                className="text-sm text-stone-100 hover:text-stone-200 transition-colors"
                data-testid="link-blog"
              >
                YnLinks Blog
              </Link>
              <Link
                href="/creator-report"
                className="text-sm text-stone-100 hover:text-stone-200 transition-colors"
                data-testid="link-creator-report"
              >
                Creator Report
              </Link>

              <Link
                href="/help"
                className="text-sm text-stone-100 hover:text-stone-200 transition-colors"
                data-testid="link-help"
              >
                Help Center
              </Link>
            </div>

            {/* Legal */}
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-2xl text-[#10b981]">Legal</h4>
              <Link
                href="/privacy"
                className="text-sm text-stone-100 hover:text-stone-200 transition-colors"
                data-testid="link-privacy"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-stone-100 hover:text-stone-200 transition-colors"
                data-testid="link-terms"
              >
                Terms &amp; Conditions
              </Link>
              <Link
                href="/cookies"
                className="text-sm text-stone-100 hover:text-stone-200 transition-colors"
                data-testid="link-cookies"
              >
                Cookie Notice
              </Link>
              <Link
                href="/trust-center"
                className="text-sm text-stone-100 hover:text-stone-200 transition-colors"
                data-testid="link-trust-center"
              >
                Trust Center
              </Link>
            </div>
          </div>

          {/* Big Footer Text */}
          <div className="w-full overflow-hidden">
            <h1 className="font-display font-black text-[12vw] leading-none text-gray-200 text-center tracking-tighter select-none">
              YNLINKS
            </h1>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-4 pt-6 border-t border-stone-100 text-sm text-stone-300">
            <p>© 2024 YNLinks. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
