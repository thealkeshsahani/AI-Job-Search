"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  Sparkles,
  Menu,
  X,
  User,
  Briefcase,
  ChevronRight,
  LogOut,
  LogIn,
  UserPlus
} from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Job Search", href: "/jobs" },
    { name: "Resume Analyzer", href: "/resume" },
    { name: "AI Assistant", href: "/assistant" },
    { name: "Company Research", href: "/companies" },
    { name: "Applications", href: "/applications" },
  ];

  const getInitials = (nameStr?: string) => {
    if (!nameStr) return "BB";
    const parts = nameStr.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return nameStr.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 dark:bg-slate-900 light:bg-white border-b border-slate-800 dark:border-slate-800 light:border-slate-200 text-white dark:text-white light:text-slate-800 shadow-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-lg tracking-tight text-white dark:text-white light:text-slate-900">
                    Byte Builder
                  </span>
                  <span className="bg-blue-500/20 text-blue-400 dark:text-blue-400 light:text-blue-600 text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-500 font-medium tracking-wide">
                  Indian Job Companion
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-3.5 py-2 text-sm font-medium text-slate-300 dark:text-slate-300 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-slate-800/80 dark:hover:bg-slate-800/80 light:hover:bg-slate-100 rounded-lg transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons / Profile & Theme */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />

            {isAuthenticated && user ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 bg-slate-800 dark:bg-slate-800 light:bg-slate-100 hover:bg-slate-700/80 dark:hover:bg-slate-700/80 light:hover:bg-slate-200 text-slate-200 dark:text-slate-200 light:text-slate-700 border border-slate-700/80 dark:border-slate-700/80 light:border-slate-300 px-3 py-1.5 rounded-xl text-sm transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                    {getInitials(user.name)}
                  </div>
                  <span className="font-semibold">{user.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 dark:hover:bg-slate-800/80 light:hover:bg-slate-100 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-white dark:hover:text-white light:hover:text-slate-900 border border-slate-700 dark:border-slate-700 light:border-slate-300 rounded-xl transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-500/20 transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button & Theme toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-white hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 dark:bg-slate-900 light:bg-white border-b border-slate-800 dark:border-slate-800 light:border-slate-200 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 text-base font-medium text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-white hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-slate-100 rounded-lg"
            >
              <span>{link.name}</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-800 dark:border-slate-800 light:border-slate-200 space-y-1">
            {isAuthenticated && user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2.5 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-white hover:bg-slate-800 rounded-lg"
                >
                  <User className="w-5 h-5 text-blue-400" />
                  <span>My Profile ({user.name})</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 text-rose-400 hover:bg-rose-950/30 rounded-lg text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-3 text-center text-sm font-semibold rounded-xl bg-slate-800 dark:bg-slate-800 light:bg-slate-100 text-slate-200 dark:text-slate-200 light:text-slate-800"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-3 text-center text-sm font-semibold rounded-xl bg-blue-600 text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
