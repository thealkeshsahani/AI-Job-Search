"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessageItem } from "./ChatMessageItem";
import { AIChatMessage } from "@/lib/ai/service";
import {
  Sparkles,
  X,
  Send,
  Bot,
  Trash2,
  Minimize2,
  Maximize2,
  ChevronRight
} from "lucide-react";

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! I'm **Byte Builder AI**, your personal career coach. Ask me about jobs in Bangalore, resume fixes, or salary advice!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: AIChatMessage = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const json = await res.json();
      if (json.success && json.message) {
        setMessages([...newMessages, json.message]);
      }
    } catch (err) {
      console.error("Floating widget error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center">
          {/* Desktop Floating Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center space-x-2.5 px-5 py-3.5 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-full shadow-2xl shadow-blue-500/40 border border-blue-400/30 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>✨ Ask Byte Builder</span>
          </button>

          {/* Mobile Floating Circular Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="sm:hidden w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/40 border border-blue-400/30 transition-all active:scale-95"
            aria-label="Open AI Assistant"
          >
            <Sparkles className="w-6 h-6 text-amber-300" />
          </button>
        </div>
      )}

      {/* Floating Chat Panel Drawer */}
      {isOpen && (
        <div
          className={`fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col transition-all duration-300 ${
            isExpanded
              ? "w-full h-full sm:w-[650px] sm:h-[750px]"
              : "w-full h-[85vh] sm:w-[420px] sm:h-[580px]"
          }`}
        >
          {/* Header */}
          <div className="p-4 bg-slate-950/90 border-b border-slate-800 rounded-t-3xl flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                  Byte Builder AI Assistant
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </h3>
                <p className="text-[10px] text-slate-400">Personal AI Career Coach</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/50">
            {messages.map((msg, idx) => (
              <ChatMessageItem key={idx} message={msg} />
            ))}

            {loading && (
              <div className="flex gap-2 items-center text-xs text-slate-400 p-2">
                <Bot className="w-4 h-4 text-blue-400 animate-bounce" />
                <span>AI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions Bar */}
          <div className="px-3 py-2 bg-slate-900 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() => {
                setInput("Find Python jobs in Bangalore under 12 LPA");
              }}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg shrink-0"
            >
              🔎 Find Jobs
            </button>
            <button
              onClick={() => {
                setInput("What are the weaknesses in my resume?");
              }}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg shrink-0"
            >
              📄 Analyze Resume
            </button>
            <button
              onClick={() => {
                setInput("Start a Python interview");
              }}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg shrink-0"
            >
              🎤 Practice Interview
            </button>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              placeholder="Ask anything about your career..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
