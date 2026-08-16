"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import {
  LayoutDashboard,
  Search,
  FileText,
  MessageSquare,
  Building2,
  Kanban,
  Bookmark,
  User,
  Settings,
  Sparkles,
  ExternalLink,
  Mail
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Job Search", href: "/jobs", icon: Search },
    { name: "Apply with AI", href: "/emails", icon: Mail, badge: "AI" },
    { name: "Resume Analyzer", href: "/resume", icon: FileText },
    { name: "Company Research", href: "/companies", icon: Building2 },
    { name: "Application Tracker", href: "/applications", icon: Kanban },
    { name: "Saved Jobs", href: "/saved-jobs", icon: Bookmark },
  ];

  const secondaryNavigation = [
    { name: "Profile & Preferences", href: "/profile", icon: User },
    { name: "Settings & AI Provider", href: "/settings", icon: Settings },
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
    <aside className="w-64 bg-slate-900 dark:bg-slate-900 light:bg-white border-r border-slate-800 dark:border-slate-800 light:border-slate-200 flex flex-col justify-between hidden lg:flex shrink-0 min-h-[calc(100vh-4rem)] transition-colors duration-200">
      <div className="p-4 space-y-6">
        {/* Navigation Group */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 dark:text-slate-400 light:text-slate-500 tracking-wider uppercase">
            Career Tools
          </div>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-150 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-slate-800/80 dark:hover:bg-slate-800/80 light:hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400 group-hover:text-blue-400"}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-white/20 text-white" : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Preferences Group */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 dark:text-slate-400 light:text-slate-500 tracking-wider uppercase">
            Account & Config
          </div>
          <nav className="space-y-1">
            {secondaryNavigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-150 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-white dark:hover:text-white light:hover:text-slate-900 hover:bg-slate-800/80 dark:hover:bg-slate-800/80 light:hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400 group-hover:text-blue-400"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Indian Market Specs Widget */}
        <div className="bg-gradient-to-br from-slate-850 to-slate-800 dark:from-slate-850 dark:to-slate-800 light:from-slate-100 light:to-slate-200 border border-slate-750 dark:border-slate-750 light:border-slate-300 p-3.5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Target Market
            </span>
            <span className="text-[10px] bg-blue-500/20 text-blue-300 dark:text-blue-300 light:text-blue-700 px-2 py-0.5 rounded-md font-mono">
              India 🇮🇳
            </span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed">
            Optimized for LPA salary scales, 30-90 day notice periods, and Bangalore/Tier-2 hubs.
          </p>
        </div>
      </div>

      {/* User profile footer */}
      <div className="p-4 border-t border-slate-800 dark:border-slate-800 light:border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center shadow-md">
              {getInitials(user?.name)}
            </div>
            <div className="flex flex-col truncate max-w-[110px]">
              <span className="text-sm font-semibold text-white dark:text-white light:text-slate-900 leading-tight truncate">
                {user?.name || "Rahul Sharma"}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 truncate">
                {user?.currentRole || "Software Engineer"}
              </span>
            </div>
          </div>
          <Link href="/profile" className="text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-slate-100">
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
