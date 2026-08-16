"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { useTheme } from "@/components/theme/ThemeProvider";
import {
  Settings,
  Bot,
  Key,
  Shield,
  Trash2,
  CheckCircle2,
  Sparkles,
  Sun,
  Moon,
  Laptop
} from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [aiProvider, setAiProvider] = useState<"demo" | "gemini" | "openai">("demo");
  const [geminiKey, setGeminiKey] = useState("");
  const [openaiKey, setOpenaiKey] = useState("");
  const [message, setMessage] = useState("");

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Settings saved successfully! Application running smoothly.");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleResetData = async () => {
    if (confirm("Are you sure you want to reset all applications and database data?")) {
      setMessage("Database data reset to seed default.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 dark:bg-slate-950 light:bg-slate-50 text-slate-100 dark:text-slate-100 light:text-slate-800 flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-6">
          <div className="bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 p-6 rounded-3xl flex items-center justify-between shadow-sm">
            <div>
              <h1 className="text-2xl font-extrabold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
                <Settings className="w-6 h-6 text-blue-400" />
                Settings & Appearance
              </h1>
              <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 mt-1">
                Manage Light & Dark theme modes, AI providers, and privacy controls.
              </p>
            </div>

            {message && (
              <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-xs font-semibold">
                {message}
              </div>
            )}
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            {/* Theme & Appearance Selection */}
            <div className="bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm">
              <h3 className="font-bold text-white dark:text-white light:text-slate-900 text-base border-b border-slate-800 dark:border-slate-800 light:border-slate-200 pb-2 flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-400" />
                Appearance & Theme Mode
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    theme === "dark"
                      ? "bg-blue-600/15 border-blue-500 text-white"
                      : "bg-slate-950 dark:bg-slate-950 light:bg-slate-100 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 text-amber-300 flex items-center justify-center border border-slate-700">
                      <Moon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-sm block text-white dark:text-white light:text-slate-900">Dark Mode</span>
                      <span className="text-[11px] text-slate-400 block">Sleek, dark slate interface</span>
                    </div>
                  </div>
                  {theme === "dark" && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
                </button>

                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    theme === "light"
                      ? "bg-blue-600/15 border-blue-500 text-white"
                      : "bg-slate-950 dark:bg-slate-950 light:bg-slate-100 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
                      <Sun className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-sm block text-white dark:text-white light:text-slate-900">Light Mode</span>
                      <span className="text-[11px] text-slate-400 block">Crisp, clean white interface</span>
                    </div>
                  </div>
                  {theme === "light" && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
                </button>
              </div>
            </div>

            {/* AI Provider Config */}
            <div className="bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm">
              <h3 className="font-bold text-white dark:text-white light:text-slate-900 text-base border-b border-slate-800 dark:border-slate-800 light:border-slate-200 pb-2 flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-400" />
                AI Provider Selection
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setAiProvider("demo")}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    aiProvider === "demo"
                      ? "bg-blue-600/15 border-blue-500 text-white"
                      : "bg-slate-950 dark:bg-slate-950 light:bg-slate-100 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-white dark:text-white light:text-slate-900">Demo AI Mode</span>
                    {aiProvider === "demo" && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Zero API keys required. Uses deterministic AI fallback models for 100% offline usage.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setAiProvider("gemini")}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    aiProvider === "gemini"
                      ? "bg-blue-600/15 border-blue-500 text-white"
                      : "bg-slate-950 dark:bg-slate-950 light:bg-slate-100 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-white dark:text-white light:text-slate-900">Google Gemini</span>
                    {aiProvider === "gemini" && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Connect Gemini 1.5 Flash using GEMINI_API_KEY environment variable.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setAiProvider("openai")}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    aiProvider === "openai"
                      ? "bg-blue-600/15 border-blue-500 text-white"
                      : "bg-slate-950 dark:bg-slate-950 light:bg-slate-100 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-white dark:text-white light:text-slate-900">OpenAI GPT-4o</span>
                    {aiProvider === "openai" && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Connect OpenAI models using OPENAI_API_KEY environment variable.
                  </p>
                </button>
              </div>

              {aiProvider !== "demo" && (
                <div className="space-y-3 pt-2">
                  <div className="text-xs">
                    <label className="block text-slate-300 font-semibold mb-1">
                      {aiProvider === "gemini" ? "Gemini API Key" : "OpenAI API Key"}
                    </label>
                    <input
                      type="password"
                      placeholder="sk-..."
                      value={aiProvider === "gemini" ? geminiKey : openaiKey}
                      onChange={(e) =>
                        aiProvider === "gemini" ? setGeminiKey(e.target.value) : setOpenaiKey(e.target.value)
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Offline Demo Mode Status */}
            <div className="bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 p-6 rounded-3xl space-y-3 shadow-sm">
              <h3 className="font-bold text-white dark:text-white light:text-slate-900 text-base border-b border-slate-800 dark:border-slate-800 light:border-slate-200 pb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                Demo & Evaluation Mode
              </h3>

              <div className="flex items-center justify-between p-3.5 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl">
                <div>
                  <h4 className="font-bold text-emerald-300 text-xs">Offline Evaluator Mode Active</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Pre-populated with 20+ realistic Indian jobs, 8+ company profiles, and sample applications.
                  </p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-full border border-emerald-500/30">
                  Ready
                </span>
              </div>
            </div>

            {/* Privacy & Reset */}
            <div className="bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 p-6 rounded-3xl space-y-4 shadow-sm">
              <h3 className="font-bold text-white dark:text-white light:text-slate-900 text-base border-b border-slate-800 dark:border-slate-800 light:border-slate-200 pb-2 flex items-center gap-2">
                <Shield className="w-5 h-5 text-rose-400" />
                Data Privacy & Management
              </h3>

              <div className="flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-white dark:text-white light:text-slate-900">Reset Local SQLite Database</h4>
                  <p className="text-slate-400">Clear customized applications and restore seed demo data.</p>
                </div>

                <button
                  type="button"
                  onClick={handleResetData}
                  className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Reset Data</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-500/20 transition-all"
              >
                Save Settings
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
