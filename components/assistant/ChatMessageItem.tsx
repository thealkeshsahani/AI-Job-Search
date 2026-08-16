"use client";

import { useState } from "react";
import { AIChatMessage } from "@/lib/ai/service";
import { JobCard } from "@/components/jobs/JobCard";
import {
  Bot,
  User,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp,
  Activity
} from "lucide-react";

interface ChatMessageItemProps {
  message: AIChatMessage;
  onRegenerate?: () => void;
  onViewJobDetails?: (job: any) => void;
}

export function ChatMessageItem({
  message,
  onRegenerate,
  onViewJobDetails,
}: ChatMessageItemProps) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"helpful" | "unhelpful" | null>(null);
  const [showToolTrace, setShowToolTrace] = useState(false);

  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-3.5 ${isUser ? "justify-end" : "justify-start"} group my-4`}>
      {/* AI Avatar */}
      {!isUser && (
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 border border-blue-400/30 shadow-md shadow-blue-500/10">
          <Sparkles className="w-4 h-4" />
        </div>
      )}

      {/* Message Box */}
      <div className={`max-w-[90%] sm:max-w-[80%] space-y-3`}>
        {/* Tool Badge & Activity Panel Trigger */}
        {!isUser && message.toolUsed && (
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 bg-blue-950/80 px-3 py-1 rounded-full border border-blue-800/80">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>{message.toolUsed}</span>
            </span>

            {message.toolTrace && message.toolTrace.length > 0 && (
              <button
                onClick={() => setShowToolTrace(!showToolTrace)}
                className="text-[11px] text-slate-400 hover:text-slate-200 bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-700/60 flex items-center gap-1 transition-colors"
              >
                <Activity className="w-3 h-3 text-emerald-400" />
                <span>Tool Activity ({message.toolTrace.length})</span>
                {showToolTrace ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
          </div>
        )}

        {/* Collapsible Tool Trace Log */}
        {!isUser && showToolTrace && message.toolTrace && (
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3 space-y-1.5 text-xs font-mono text-slate-300">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              AI Agent Execution Trace
            </span>
            {message.toolTrace.map((step, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-[11px]">
                <span className="text-emerald-400 font-bold">✓</span>
                <span className="text-slate-300">{step}</span>
              </div>
            ))}
          </div>
        )}

        {/* Text Content Bubble */}
        <div
          className={`rounded-3xl p-5 text-xs sm:text-sm leading-relaxed shadow-sm ${
            isUser
              ? "bg-blue-600 text-white font-medium shadow-md shadow-blue-500/10"
              : "bg-slate-900 border border-slate-800 text-slate-200"
          }`}
        >
          {/* Simple Markdown Formatting Parser */}
          <div className="whitespace-pre-line font-sans space-y-2">
            {message.content}
          </div>

          {/* Embedded Interactive Job Cards */}
          {!isUser && message.embeddedJobs && message.embeddedJobs.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Matching Jobs Found ({message.embeddedJobs.length}):
              </span>
              <div className="grid grid-cols-1 gap-3">
                {message.embeddedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    matchScore={92}
                    onViewDetails={(j) => onViewJobDetails && onViewJobDetails(j)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Action Buttons Footer (Copy, Regenerate, Feedback) */}
        {!isUser && (
          <div className="flex items-center space-x-2 text-xs text-slate-500 pt-0.5 px-1">
            <button
              onClick={handleCopy}
              className="p-1.5 hover:text-slate-200 hover:bg-slate-800 rounded-lg flex items-center gap-1 transition-colors"
              title="Copy message"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="text-[11px]">{copied ? "Copied" : "Copy"}</span>
            </button>

            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="p-1.5 hover:text-slate-200 hover:bg-slate-800 rounded-lg flex items-center gap-1 transition-colors"
                title="Regenerate response"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="text-[11px]">Regenerate</span>
              </button>
            )}

            <div className="h-3 w-px bg-slate-800 my-auto"></div>

            <button
              onClick={() => setFeedback("helpful")}
              className={`p-1.5 rounded-lg flex items-center gap-1 transition-colors ${
                feedback === "helpful" ? "text-emerald-400 bg-emerald-500/10" : "hover:text-slate-200 hover:bg-slate-800"
              }`}
              title="Helpful"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setFeedback("unhelpful")}
              className={`p-1.5 rounded-lg flex items-center gap-1 transition-colors ${
                feedback === "unhelpful" ? "text-rose-400 bg-rose-500/10" : "hover:text-slate-200 hover:bg-slate-800"
              }`}
              title="Not Helpful"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-9 h-9 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-700 shadow-sm">
          RS
        </div>
      )}
    </div>
  );
}
