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
  Phone,
  Lock,
  User,
  Loader2,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Shield,
  Zap,
  Gift,
} from "lucide-react";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password", "");

  const passwordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-neon-500"];
  const strengthLabels = ["Weak", "Fair", "Good", "Strong 💪"];

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    setError("");
    try {
      const response = await authAPI.register({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || undefined,
        password: data.password,
      });
      setAuth(response.data.user, response.data.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-500 mesh-bg noise-overlay flex relative overflow-hidden">
      {/* Floating orbs */}
      <div className="floating-orb bg-accent-500 w-96 h-96 -top-48 -right-48 animate-float" />
      <div className="floating-orb bg-primary-500 w-80 h-80 top-1/2 -left-40 animate-float" style={{ animationDelay: '2s' }} />
      <div className="floating-orb bg-neon-500 w-64 h-64 -bottom-32 right-1/4 animate-float" style={{ animationDelay: '4s' }} />

      {/* Left side - Form */}
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
              <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-4">
                <Gift className="w-4 h-4 text-accent-400" />
                <span className="text-sm text-gray-300">Free forever</span>
              </div>
              <h2 className="text-3xl font-black text-white mb-2">Create Account</h2>
              <p className="text-gray-400">Join the trusted marketplace 🚀</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-2" data-testid="register-error">
                <span className="w-2 h-2 bg-red-500 rounded-full" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    {...register("fullName")}
                    className="input-field pl-12"
                    placeholder="John Doe"
                    data-testid="fullname-input"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-400 rounded-full" />
                    {errors.fullName.message}
                  </p>
                )}
              </div>

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
                  Phone Number <span className="text-gray-500">(Optional)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="tel"
                    {...register("phone")}
                    className="input-field pl-12"
                    placeholder="+234 800 000 0000"
                    data-testid="phone-input"
                  />
                </div>
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
                {/* Password strength indicator */}
                {password && (
                  <div className="mt-3 space-y-2">
                    <div className="flex gap-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            i < passwordStrength()
                              ? strengthColors[passwordStrength() - 1]
                              : "bg-white/10"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">
                      Password strength: <span className={`font-medium ${
                        passwordStrength() === 4 ? "text-neon-400" : 
                        passwordStrength() >= 2 ? "text-yellow-400" : "text-red-400"
                      }`}>{strengthLabels[passwordStrength() - 1] || "Too weak"}</span>
                    </p>
                  </div>
                )}
                {errors.password && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-400 rounded-full" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    className="input-field pl-12"
                    placeholder="••••••••"
                    data-testid="confirm-password-input"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-400 rounded-full" />
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  id="terms"
                  className="w-4 h-4 mt-1 rounded border-gray-600 bg-white/5 text-primary-500 focus:ring-primary-500/50" 
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-400">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary-400 hover:underline">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="text-primary-400 hover:underline">Privacy Policy</Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg"
                data-testid="register-submit-btn"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Create Account
                    <Sparkles className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary-400 hover:text-primary-300 font-semibold transition-colors"
                  data-testid="login-link"
                >
                  Sign in →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative">
        <div className="flex justify-end">
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
            Start your<br />
            <span className="gradient-text">journey today! 🚀</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-md">
            Join thousands of Nigerians buying and selling with confidence.
          </p>

          {/* Benefits */}
          <div className="space-y-4">
            {[
              { icon: CheckCircle2, text: "Free to use, no hidden fees", color: "text-neon-400" },
              { icon: Shield, text: "Escrow protection on all deals", color: "text-primary-400" },
              { icon: Zap, text: "Get matched with buyers instantly", color: "text-accent-400" },
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 text-gray-300">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                  <benefit.icon className={`w-5 h-5 ${benefit.color}`} />
                </div>
                <span>{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-gray-500 text-sm text-right">
          © 2025 DECLUTTIT. All rights reserved.
        </p>
      </div>
    </div>
  );
}
