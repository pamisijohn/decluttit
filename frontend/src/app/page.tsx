"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Search,
  Shield,
  Zap,
  Users,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  MessageCircle,
  Star,
  ChevronRight,
  Play,
  Globe,
  Lock,
  BadgeCheck,
} from "lucide-react";

// Animated counter component
const AnimatedCounter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

// Floating orb component
const FloatingOrb = ({
  color,
  size,
  position,
  delay = "0s",
}: {
  color: string;
  size: string;
  position: string;
  delay?: string;
}) => (
  <div
    className={`floating-orb ${color} ${size} ${position} animate-float`}
    style={{ animationDelay: delay }}
  />
);

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-dark-500 mesh-bg noise-overlay overflow-hidden">
      {/* Floating background orbs */}
      <FloatingOrb
        color="bg-primary-500"
        size="w-96 h-96"
        position="top-20 -left-48"
        delay="0s"
      />
      <FloatingOrb
        color="bg-accent-500"
        size="w-80 h-80"
        position="top-40 -right-40"
        delay="2s"
      />
      <FloatingOrb
        color="bg-neon-500"
        size="w-64 h-64"
        position="bottom-40 left-1/4"
        delay="4s"
      />
      <FloatingOrb
        color="bg-primary-600"
        size="w-72 h-72"
        position="bottom-20 -right-36"
        delay="1s"
      />

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "glass-strong py-3 shadow-lg shadow-black/20"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group" data-testid="logo-link">
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-shadow duration-300">
                <span className="text-white font-black text-xl">D</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full animate-pulse" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              DECLUTTIT
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <Link href="/search" className="nav-link px-4" data-testid="browse-link">
              Browse
            </Link>
            <Link href="/requests" className="nav-link px-4" data-testid="requests-link">
              Requests
            </Link>
            <Link href="/login" className="btn-ghost text-sm" data-testid="login-link">
              Login
            </Link>
            <Link href="/register" className="btn-primary text-sm" data-testid="get-started-btn">
              Get Started
              <Sparkles className="w-4 h-4 inline ml-2" />
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-gray-400 hover:text-white" data-testid="mobile-menu-btn">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="animate-fade-in">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6 animate-slide-down">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-500" />
                </span>
                <span className="text-sm text-gray-300">
                  Trusted by <span className="text-white font-semibold">10,000+</span> users
                </span>
              </div>

              {/* Main heading */}
              <h1 className="text-5xl md:text-7xl font-black leading-[1.1] mb-6">
                <span className="text-white">Declutter.</span>
                <br />
                <span className="gradient-text animate-gradient bg-[length:200%_auto]">
                  Earn.
                </span>
                <br />
                <span className="text-white">Trust.</span>
              </h1>

              <p className="text-xl text-gray-400 max-w-lg mb-8 leading-relaxed">
                The trust-first marketplace for buying and selling pre-loved items. 
                <span className="text-primary-400"> No cap</span>, just secure vibes 
                with verified users. ✨
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  href="/register"
                  className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-8 py-4 group"
                  data-testid="hero-cta-primary"
                >
                  Start Selling
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/search"
                  className="btn-secondary inline-flex items-center justify-center gap-2 text-lg px-8 py-4"
                  data-testid="hero-cta-secondary"
                >
                  <Play className="w-5 h-5" />
                  See How It Works
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap gap-6">
                {[
                  { icon: Shield, label: "Escrow Protected", color: "text-primary-400" },
                  { icon: BadgeCheck, label: "Verified Users", color: "text-neon-400" },
                  { icon: Zap, label: "Instant Matching", color: "text-accent-400" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                  >
                    <item.icon className={`w-5 h-5 ${item.color} group-hover:scale-110 transition-transform`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right content - Stats cards */}
            <div className="relative lg:pl-12">
              {/* Main stat card */}
              <div className="glass-card p-8 mb-6 hover:shadow-glow transition-all duration-500 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-gray-400 font-medium">Total Transactions</h3>
                  <span className="chip-neon">Live</span>
                </div>
                <div className="text-5xl font-black text-white mb-2">
                  ₦<AnimatedCounter target={847} />M+
                </div>
                <div className="flex items-center gap-2 text-neon-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+24.5% this month</span>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-6 hover:shadow-glow-sm transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                  <Users className="w-8 h-8 text-primary-400 mb-3" />
                  <div className="text-2xl font-bold text-white">
                    <AnimatedCounter target={12} />K+
                  </div>
                  <p className="text-gray-500 text-sm">Active Users</p>
                </div>
                <div className="glass-card p-6 hover:shadow-glow-sm transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                  <Star className="w-8 h-8 text-amber-400 mb-3" />
                  <div className="text-2xl font-bold text-white">4.9</div>
                  <p className="text-gray-500 text-sm">User Rating</p>
                </div>
                <div className="glass-card p-6 hover:shadow-glow-sm transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                  <CheckCircle2 className="w-8 h-8 text-neon-400 mb-3" />
                  <div className="text-2xl font-bold text-white">
                    <AnimatedCounter target={98} />%
                  </div>
                  <p className="text-gray-500 text-sm">Success Rate</p>
                </div>
                <div className="glass-card p-6 hover:shadow-glow-sm transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                  <Globe className="w-8 h-8 text-accent-400 mb-3" />
                  <div className="text-2xl font-bold text-white">
                    <AnimatedCounter target={36} />
                  </div>
                  <p className="text-gray-500 text-sm">States Covered</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid */}
      <section className="relative py-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="chip mb-4">✦ Features</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Why DECLUTTIT <span className="gradient-text">hits different</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              We&apos;re not just another marketplace. We&apos;re building trust, one transaction at a time.
            </p>
          </div>

          {/* Bento grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Large feature card */}
            <div className="md:col-span-2 bento-card">
              <div className="flex flex-col h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-2xl flex items-center justify-center mb-6 bento-icon">
                  <Search className="w-7 h-7 text-primary-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Smart Request Matching
                </h3>
                <p className="text-gray-400 mb-6 flex-grow">
                  Post what you need and our AI matches you with the perfect listings. 
                  No more endless scrolling through irrelevant stuff. We got you. 💯
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="chip">AI-Powered</span>
                  <span className="chip-pink">Real-time</span>
                  <span className="chip-neon">Personalized</span>
                </div>
              </div>
            </div>

            {/* Small feature card */}
            <div className="bento-card bg-gradient-to-br from-accent-500/10 to-transparent">
              <div className="w-14 h-14 bg-gradient-to-br from-accent-500/20 to-accent-600/20 rounded-2xl flex items-center justify-center mb-6 bento-icon">
                <Shield className="w-7 h-7 text-accent-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Secure Escrow
              </h3>
              <p className="text-gray-400">
                Your money stays safe until you confirm receipt. Zero stress, 100% secure. 🔒
              </p>
            </div>

            {/* Small feature card */}
            <div className="bento-card bg-gradient-to-br from-neon-500/10 to-transparent">
              <div className="w-14 h-14 bg-gradient-to-br from-neon-500/20 to-neon-600/20 rounded-2xl flex items-center justify-center mb-6 bento-icon">
                <BadgeCheck className="w-7 h-7 text-neon-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Trust Scores
              </h3>
              <p className="text-gray-400">
                Every user has a visible trust score. See who&apos;s legit before you deal. ✅
              </p>
            </div>

            {/* Large feature card */}
            <div className="md:col-span-2 bento-card">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-2xl flex items-center justify-center shrink-0 bento-icon">
                  <MessageCircle className="w-7 h-7 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    In-App Chat & Negotiation
                  </h3>
                  <p className="text-gray-400">
                    Chat directly with buyers or sellers. Negotiate prices, ask questions, 
                    and finalize deals—all within the app. No need for external messaging. 💬
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="chip-pink mb-4">✦ How It Works</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Simple as <span className="gradient-text-pink">1, 2, 3</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* For Sellers */}
            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">For Sellers</h3>
              </div>
              <div className="space-y-6">
                {[
                  { step: "01", title: "List your item", desc: "Snap some pics and add details" },
                  { step: "02", title: "Set your price", desc: "You decide what it's worth" },
                  { step: "03", title: "Get matched", desc: "We find interested buyers" },
                  { step: "04", title: "Get paid secure", desc: "Escrow protects your bag 💰" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="relative">
                      <div className="w-12 h-12 bg-primary-500/10 border border-primary-500/30 rounded-xl flex items-center justify-center font-bold text-primary-400 group-hover:bg-primary-500/20 group-hover:border-primary-500/50 transition-all">
                        {item.step}
                      </div>
                      {i < 3 && (
                        <div className="absolute top-14 left-1/2 w-px h-6 bg-gradient-to-b from-primary-500/50 to-transparent" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* For Buyers */}
            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">For Buyers</h3>
              </div>
              <div className="space-y-6">
                {[
                  { step: "01", title: "Post what you need", desc: "Tell us what you're looking for" },
                  { step: "02", title: "Browse matches", desc: "See listings that fit your vibe" },
                  { step: "03", title: "Chat with sellers", desc: "Verify everything before buying" },
                  { step: "04", title: "Pay with confidence", desc: "Release funds when satisfied 🎉" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="relative">
                      <div className="w-12 h-12 bg-accent-500/10 border border-accent-500/30 rounded-xl flex items-center justify-center font-bold text-accent-400 group-hover:bg-accent-500/20 group-hover:border-accent-500/50 transition-all">
                        {item.step}
                      </div>
                      {i < 3 && (
                        <div className="absolute top-14 left-1/2 w-px h-6 bg-gradient-to-b from-accent-500/50 to-transparent" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="chip-neon mb-4">✦ Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Real people, <span className="gradient-text">real trust</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Chika A.",
                role: "Seller",
                avatar: "C",
                color: "from-primary-500 to-primary-600",
                content: "Sold my old iPhone in 2 days! The escrow feature gave me peace of mind. No more getting scammed 🙌",
                rating: 5,
              },
              {
                name: "Emeka O.",
                role: "Buyer",
                avatar: "E",
                color: "from-accent-500 to-accent-600",
                content: "Found exactly what I needed without scrolling for hours. The matching system is lowkey genius fr fr 💯",
                rating: 5,
              },
              {
                name: "Amina B.",
                role: "Power User",
                avatar: "A",
                color: "from-neon-500 to-neon-600",
                content: "Been using DECLUTTIT for 6 months. Made ₦200K selling stuff I didn't need. This app is elite! ✨",
                rating: 5,
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="glass-card p-6 hover:shadow-glow-sm transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.color} rounded-full flex items-center justify-center text-white font-bold`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative glass-card p-12 text-center overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/10" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-primary-400" />
                <span className="text-sm text-gray-300">Join 10,000+ users</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Ready to start? <span className="gradient-text">Let&apos;s go!</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                Create your free account in 30 seconds. No credit card required. 
                Start buying or selling today! 🚀
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-8 py-4"
                  data-testid="cta-register-btn"
                >
                  Create Free Account
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/login"
                  className="btn-secondary inline-flex items-center justify-center gap-2 text-lg px-8 py-4"
                  data-testid="cta-login-btn"
                >
                  I have an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="text-lg font-bold text-white">DECLUTTIT</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/support" className="hover:text-white transition-colors">Support</Link>
            </div>
            
            <p className="text-gray-500 text-sm">
              © 2025 DECLUTTIT. Made with 💜 in Nigeria
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
