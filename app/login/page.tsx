"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  Briefcase,
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("rahul.sharma@example.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, demoLogin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        router.push(redirect);
      } else {
        setError(res.error || "Failed to log in. Please check your credentials.");
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 dark:bg-slate-950 light:bg-slate-50 text-slate-100 dark:text-slate-100 light:text-slate-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-200">
      {/* Background Decorative Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header Controls */}
      <div className="absolute top-6 right-6 flex items-center space-x-3">
        <ThemeToggle />
        <Link
          href="/"
          className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-800 dark:border-slate-800 light:border-slate-300 bg-slate-900/60 dark:bg-slate-900/60 light:bg-white text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors shadow-sm"
        >
          Back to Home
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        {/* Brand Logo */}
        <Link href="/" className="inline-flex items-center space-x-3 group mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-xl tracking-tight text-white dark:text-white light:text-slate-900">
                Byte Builder
              </span>
              <span className="bg-blue-500/20 text-blue-400 dark:text-blue-400 light:text-blue-600 text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI
              </span>
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 font-medium">
              Career Management Portal
            </span>
          </div>
        </Link>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
          Sign in to access your AI job matcher, ATS resume scores, and application tracker.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-slate-900/90 dark:bg-slate-900/90 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 py-8 px-6 sm:px-8 shadow-2xl rounded-3xl backdrop-blur-sm">
          
          {/* Quick Demo Access Alert */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-800/60 dark:border-blue-800/60 light:border-blue-200 light:bg-blue-50">
            <div className="flex items-start space-x-3">
              <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-xs font-bold text-blue-200 dark:text-blue-200 light:text-blue-900 uppercase tracking-wider">
                  Instant Demo Access
                </h4>
                <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-700 mt-0.5">
                  Want to explore immediately without entering credentials?
                </p>
                <button
                  onClick={demoLogin}
                  type="button"
                  className="mt-2.5 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center space-x-1.5 transition-all"
                >
                  <span>⚡ Instant Demo Login (Rahul Sharma)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800 dark:border-slate-800 light:border-slate-200"></div>
            </div>
            <span className="relative px-3 bg-slate-900 dark:bg-slate-900 light:bg-white text-xs font-medium text-slate-500 uppercase tracking-wider">
              Or login with email
            </span>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full pl-10 pr-3.5 py-3 text-sm bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-300 rounded-xl text-white dark:text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-3 text-sm bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-300 rounded-xl text-white dark:text-white light:text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center text-slate-400 dark:text-slate-400 light:text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                />
                <span className="ml-2">Remember me</span>
              </label>
              <a href="#" className="font-semibold text-blue-400 hover:text-blue-300">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? "Signing in..." : "Sign In to Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
            Don't have an account?{" "}
            <Link href="/signup" className="font-bold text-blue-400 hover:text-blue-300 underline underline-offset-4">
              Create Account
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-500 light:text-slate-600 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Secure AES 256-bit encrypted authentication</span>
        </p>
      </div>
    </div>
  );
}
