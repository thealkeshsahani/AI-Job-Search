"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`p-2 rounded-xl border transition-all duration-200 flex items-center justify-center cursor-pointer ${
        theme === "dark"
          ? "bg-slate-800/80 border-slate-700/80 text-amber-300 hover:bg-slate-700 hover:text-amber-200 shadow-sm"
          : "bg-slate-100 border-slate-300 text-indigo-600 hover:bg-slate-200 hover:text-indigo-700 shadow-sm"
      } ${className}`}
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle Light/Dark Theme"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}
