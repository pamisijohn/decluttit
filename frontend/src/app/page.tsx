import Link from "next/link";
import { Search, Shield, Zap, Users, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <span className="text-xl font-bold text-gray-900">DECLUTTIT</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/search" className="text-gray-600 hover:text-gray-900">
              Browse
            </Link>
            <Link
              href="/requests"
              className="text-gray-600 hover:text-gray-900">
              Requests
            </Link>
            <Link href="/login" className="btn-secondary">
              Login
            </Link>
            <Link href="/register" className="btn-primary">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Declutter. <span className="text-primary-600">Earn.</span> Trust.
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          The trust-first marketplace for buying and selling pre-loved items. No
          doomscrolling, no endless feeds—just secure transactions with verified
          users.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/register"
            className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-8 py-3">
            Start Selling <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/search"
            className="btn-secondary inline-flex items-center justify-center gap-2 text-lg px-8 py-3">
            Browse Items
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-8 flex-wrap">
          <div className="flex items-center gap-2 text-gray-600">
            <Shield className="w-5 h-5 text-primary-600" />
            <span>Escrow Protection</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-5 h-5 text-primary-600" />
            <span>Verified Users</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Zap className="w-5 h-5 text-primary-600" />
            <span>Instant Matching</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why DECLUTTIT?</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Request-Based Matching
            </h3>
            <p className="text-gray-600">
              Post what you need and get matched with listings that fit—no
              endless scrolling through irrelevant items.
            </p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Escrow</h3>
            <p className="text-gray-600">
              Your money is held safely until you confirm receipt. Buy with
              confidence, sell without worry.
            </p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Trust Scores</h3>
            <p className="text-gray-600">
              Every user has a visible trust score based on verification,
              transactions, and reviews.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-primary-600">
                For Sellers
              </h3>
              <div className="space-y-4">
                {[
                  "List your item with photos and details",
                  "Set your price and condition",
                  "Get matched with interested buyers",
                  "Complete secure transaction via escrow",
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                      {i + 1}
                    </div>
                    <span className="text-gray-700">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-6 text-primary-600">
                For Buyers
              </h3>
              <div className="space-y-4">
                {[
                  "Post a request for what you need",
                  "Browse matched listings",
                  "Chat with verified sellers",
                  "Pay securely and release funds on receipt",
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                      {i + 1}
                    </div>
                    <span className="text-gray-700">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
        <p className="text-gray-600 mb-8">
          Join thousands of Nigerians decluttering their homes securely.
        </p>
        <Link
          href="/register"
          className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-3">
          Create Free Account <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">D</span>
            </div>
            <span className="font-semibold">DECLUTTIT</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2024 DECLUTTIT. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
