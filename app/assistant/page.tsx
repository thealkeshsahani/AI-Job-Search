"use client";

import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { ChatMessageItem } from "@/components/assistant/ChatMessageItem";
import { ConversationSidebar, ConversationItem } from "@/components/assistant/ConversationSidebar";
import { JobDetailModal } from "@/components/jobs/JobDetailModal";
import { AIChatMessage } from "@/lib/ai/service";
import { DemoJob } from "@/data/demo-jobs";
import {
  Sparkles,
  Send,
  Bot,
  User,
  Trash2,
  Paperclip,
  FileText,
  Search,
  Briefcase,
  Building2,
  Award,
  BookOpen,
  MapPin,
  IndianRupee,
  RefreshCw,
  Plus,
  CheckCircle2,
  X
} from "lucide-react";

const SUGGESTED_PROMPTS = [
  { icon: "🔎", text: "Find jobs for me" },
  { icon: "📄", text: "Analyze my resume" },
  { icon: "🎯", text: "Am I a good match for this job?" },
  { icon: "💼", text: "Improve my resume" },
  { icon: "🏢", text: "Research this company" },
  { icon: "💰", text: "What salary should I expect?" },
  { icon: "🎤", text: "Prepare me for an interview" },
  { icon: "📚", text: "What skills should I learn?" },
  { icon: "💡", text: "Create a career roadmap" },
  { icon: "🔗", text: "Improve my LinkedIn profile" },
];

export default function AssistantPage() {
  // Conversation History state
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);

  // Chat Messages state
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Context Attachments
  const [resumeConnected, setResumeConnected] = useState(true);
  const [attachedJob, setAttachedJob] = useState<DemoJob | null>(null);

  // Job Modal
  const [selectedJob, setSelectedJob] = useState<DemoJob | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Load conversations history
  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/conversations");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setConversations(json.data);
      }
    } catch (e) {
      console.error("Error loading conversations:", e);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Load active conversation messages
  const loadConversationMessages = async (id: string) => {
    setActiveConvId(id);
    try {
      const res = await fetch(`/api/conversations/${id}`);
      const json = await res.json();
      if (json.success && json.data) {
        setMessages(json.data.messages || []);
      }
    } catch (e) {
      console.error("Error loading conversation messages:", e);
    }
  };

  const handleNewChat = () => {
    setActiveConvId(null);
    setMessages([]);
  };

  const handleDeleteConversation = async (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConvId === id) handleNewChat();
    try {
      await fetch(`/api/conversations/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error("Error deleting conversation:", e);
    }
  };

  const handleRenameConversation = async (id: string, newTitle: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
    );
    try {
      await fetch(`/api/conversations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });
    } catch (e) {
      console.error("Error renaming conversation:", e);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: AIChatMessage = { role: "user", content: query };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          conversationId: activeConvId,
          attachedContext: attachedJob ? { jobId: attachedJob.id } : undefined,
        }),
      });
      const json = await res.json();
      if (json.success && json.message) {
        setMessages([...newMessages, json.message]);
        if (json.conversationId && json.conversationId !== activeConvId) {
          setActiveConvId(json.conversationId);
          fetchConversations();
        }
      }
    } catch (e) {
      console.error("AI Assistant error:", e);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "I encountered an error connecting to the AI service. You can retry or switch to Demo Mode in Settings.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* Conversation Threads Sidebar */}
        <ConversationSidebar
          conversations={conversations}
          activeId={activeConvId}
          onSelectConversation={loadConversationMessages}
          onNewChat={handleNewChat}
          onDeleteConversation={handleDeleteConversation}
          onRenameConversation={handleRenameConversation}
        />

        {/* Main Chat Assistant Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full flex flex-col h-[calc(100vh-4rem)]">
          {/* Header Bar */}
          <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-3xl flex items-center justify-between shrink-0 mb-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center border border-blue-400/30 shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
                  Byte Builder AI Assistant
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-normal bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/80">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    AI Online
                  </span>
                </h1>
                <p className="text-xs text-slate-400">Your personal AI career coach</p>
              </div>
            </div>

            {/* Context Badges */}
            <div className="flex items-center space-x-2">
              {resumeConnected && (
                <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Resume Connected ✓</span>
                </div>
              )}

              {attachedJob && (
                <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-300 bg-blue-950/60 border border-blue-800/80 px-2.5 py-1 rounded-full">
                  <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                  <span className="truncate max-w-[120px]">{attachedJob.title}</span>
                  <button onClick={() => setAttachedJob(null)} className="hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Messages Area / Empty State */}
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 overflow-y-auto space-y-4 mb-4 relative">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-2xl mx-auto py-8">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-blue-500/20">
                  <Sparkles className="w-8 h-8" />
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    "How can I help with your career today?"
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Select a prompt below or type your custom career query.
                  </p>
                </div>

                {/* 10 Suggested Prompts Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left">
                  {SUGGESTED_PROMPTS.map((item) => (
                    <button
                      key={item.text}
                      onClick={() => handleSend(item.text)}
                      className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/40 rounded-2xl text-xs font-medium text-slate-200 hover:text-white transition-all flex items-center space-x-2.5 group"
                    >
                      <span className="text-base">{item.icon}</span>
                      <span className="truncate group-hover:text-blue-400 transition-colors">{item.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <ChatMessageItem
                  key={msg.id || idx}
                  message={msg}
                  onRegenerate={() => handleSend(messages[messages.length - 2]?.content)}
                  onViewJobDetails={(j) => {
                    setSelectedJob(j);
                    setIsModalOpen(true);
                  }}
                />
              ))
            )}

            {loading && (
              <div className="flex gap-3 justify-start items-center p-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
                  <Bot className="w-4 h-4 animate-bounce" />
                </div>
                <div className="bg-slate-950 border border-slate-800 text-slate-300 text-xs px-4 py-3 rounded-2xl flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
                  <span className="font-semibold">AI is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions Row */}
          <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => handleSend("Find Python developer jobs in Bangalore")}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 shrink-0 font-medium"
            >
              🔎 Find Jobs
            </button>
            <button
              onClick={() => handleSend("What are the weaknesses in my resume?")}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 shrink-0 font-medium"
            >
              📄 Analyze Resume
            </button>
            <button
              onClick={() => handleSend("How can I improve my resume for ATS?")}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 shrink-0 font-medium"
            >
              💼 Improve Resume
            </button>
            <button
              onClick={() => handleSend("Start a Python technical interview")}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 shrink-0 font-medium"
            >
              🎤 Practice Interview
            </button>
            <button
              onClick={() => handleSend("Create a 6-month career roadmap to become an AI Engineer")}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 shrink-0 font-medium"
            >
              💡 Career Roadmap
            </button>
            <button
              onClick={() => handleSend("What salary should I expect in Bangalore for 3 years experience?")}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 shrink-0 font-medium"
            >
              💰 Salary Advice
            </button>
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-2 flex items-center space-x-2 shrink-0"
          >
            <textarea
              rows={1}
              placeholder="Ask anything about your career... (Enter to send, Shift+Enter for newline)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1 bg-transparent px-3 py-2 text-slate-200 text-xs sm:text-sm focus:outline-none placeholder:text-slate-500 resize-none font-sans"
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </main>
      </div>

      <JobDetailModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
