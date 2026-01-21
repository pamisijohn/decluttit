"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  Sparkles,
  ArrowLeft,
  Shield,
  Zap,
} from "lucide-react";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError("");
    try {
      const response = await authAPI.login(data);
      setAuth(response.data.user, response.data.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-500 mesh-bg noise-overlay flex relative overflow-hidden">
      {/* Floating orbs */}
      <div className="floating-orb bg-primary-500 w-96 h-96 -top-48 -left-48 animate-float" />
      <div className="floating-orb bg-accent-500 w-80 h-80 top-1/2 -right-40 animate-float" style={{ animationDelay: '2s' }} />
      <div className="floating-orb bg-neon-500 w-64 h-64 -bottom-32 left-1/4 animate-float" style={{ animationDelay: '4s' }} />

      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative">
        <div>
          <Link href="/" className="flex items-center gap-3 group" data-testid="logo-link">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-shadow duration-300">
                <span className="text-white font-black text-xl">D</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full animate-pulse" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              DECLUTTIT
            </span>
          </Link>
        </div>

        <div className="space-y-8">
          <h1 className="text-5xl font-black text-white leading-tight">
            Welcome back,<br />
            <span className="gradient-text">legend! ✨</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-md">
            Your trusted marketplace awaits. Log in to continue your journey.
          </p>

          {/* Features */}
          <div className="space-y-4">
            {[
              { icon: Shield, text: "Escrow protection on all transactions" },
              { icon: Zap, text: "Instant matching with verified users" },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-gray-300">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-primary-400" />
                </div>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-gray-500 text-sm">
          © 2025 DECLUTTIT. All rights reserved.
        </p>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-3 justify-center">
              <div className="w-11 h-11 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-glow-sm">
                <span className="text-white font-black text-xl">D</span>
              </div>
              <span className="text-xl font-bold text-white">DECLUTTIT</span>
            </Link>
          </div>

          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to home</span>
          </Link>

          <div className="glass-card p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-white mb-2">Sign In</h2>
              <p className="text-gray-400">Enter your credentials to continue</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-2" data-testid="login-error">
                <span className="w-2 h-2 bg-red-500 rounded-full" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    {...register("email")}
                    className="input-field pl-12"
                    placeholder="you@example.com"
                    data-testid="email-input"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-400 rounded-full" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="input-field pl-12 pr-12"
                    placeholder="••••••••"
                    data-testid="password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    data-testid="toggle-password-btn"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-400 rounded-full" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-white/5 text-primary-500 focus:ring-primary-500/50" />
                  <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg"
                data-testid="login-submit-btn"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <Sparkles className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-gray-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-primary-400 hover:text-primary-300 font-semibold transition-colors"
                  data-testid="register-link"
                >
                  Sign up free →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
