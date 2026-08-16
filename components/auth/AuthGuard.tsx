"use client";

import { useAuth } from "./AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const PUBLIC_ROUTES = ["/", "/login", "/signup"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublic = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (!loading && !isAuthenticated && !isPublic) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, loading, isPublic, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 dark:bg-slate-950 flex flex-col items-center justify-center text-slate-200">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-400">Loading Byte Builder AI...</p>
      </div>
    );
  }

  if (!isAuthenticated && !isPublic) {
    return (
      <div className="min-h-screen bg-slate-950 dark:bg-slate-950 flex flex-col items-center justify-center text-slate-200">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-400">Redirecting to login...</p>
      </div>
    );
  }

  return <>{children}</>;
}
