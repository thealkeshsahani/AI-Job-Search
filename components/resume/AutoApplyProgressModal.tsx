"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Send,
  Building2,
  Mail,
  X,
  Kanban,
  FileText,
  ExternalLink,
  ChevronRight
} from "lucide-react";

interface AutoApplyProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeText?: string;
  userSkills?: string[];
}

export function AutoApplyProgressModal({
  isOpen,
  onClose,
  resumeText,
  userSkills = ["Python", "React", "Node.js", "SQL", "FastAPI"],
}: AutoApplyProgressModalProps) {
  const [step, setStep] = useState<"ANALYZING" | "MATCHING" | "MAILING" | "COMPLETE">("ANALYZING");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startAutoApplyWorkflow();
    }
  }, [isOpen]);

  const startAutoApplyWorkflow = async () => {
    setLoading(true);
    setStep("ANALYZING");
    setResults([]);

    // Step 1 -> Step 2 transition
    await new Promise((r) => setTimeout(r, 1000));
    setStep("MATCHING");

    // Step 2 -> Step 3 transition
    await new Promise((r) => setTimeout(r, 1200));
    setStep("MAILING");

    try {
      const res = await fetch("/api/emails/auto-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          userSkills,
          maxJobs: 4,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setResults(json.data);
      }
    } catch (err) {
      console.error("Auto apply error:", err);
    } finally {
      setStep("COMPLETE");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between border-b border-blue-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight flex items-center gap-2">
                Auto-Apply & Auto-Mail Engine
                <span className="text-[10px] bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 rounded-full font-mono">
                  Autonomous Mode
                </span>
              </h3>
              <p className="text-xs text-blue-200">
                Matching resume skills, auto-generating emails, mailing companies & waiting for response.
              </p>
            </div>
          </div>

          {!loading && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Workflow Stepper Indicator */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className={`p-2.5 rounded-xl border transition-all ${
              step === "ANALYZING"
                ? "bg-blue-50 dark:bg-blue-950/80 border-blue-500 text-blue-700 dark:text-blue-300 font-bold shadow-sm"
                : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500"
            }`}>
              1. Resume Skills
            </div>

            <div className={`p-2.5 rounded-xl border transition-all ${
              step === "MATCHING"
                ? "bg-blue-50 dark:bg-blue-950/80 border-blue-500 text-blue-700 dark:text-blue-300 font-bold shadow-sm"
                : step === "MAILING" || step === "COMPLETE"
                ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500/50 text-emerald-600 font-semibold"
                : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500"
            }`}>
              2. Match Jobs
            </div>

            <div className={`p-2.5 rounded-xl border transition-all ${
              step === "MAILING"
                ? "bg-blue-50 dark:bg-blue-950/80 border-blue-500 text-blue-700 dark:text-blue-300 font-bold shadow-sm"
                : step === "COMPLETE"
                ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500/50 text-emerald-600 font-semibold"
                : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500"
            }`}>
              3. Auto-Mail
            </div>

            <div className={`p-2.5 rounded-xl border transition-all ${
              step === "COMPLETE"
                ? "bg-amber-50 dark:bg-amber-950/80 border-amber-500 text-amber-800 dark:text-amber-300 font-bold shadow-sm"
                : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500"
            }`}>
              4. Waiting Reply
            </div>
          </div>

          {/* Dynamic Content */}
          {loading ? (
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto animate-bounce">
                <Send className="w-6 h-6" />
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  {step === "ANALYZING" && "Parsing uploaded resume skills & experience..."}
                  {step === "MATCHING" && "Scanning companies & active job openings..."}
                  {step === "MAILING" && "Auto-generating emails & mailing companies..."}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  AI is automating job applications for TechNova, Razorpay, Swiggy, and other top employers.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Status Header */}
              <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 p-4 rounded-2xl flex items-start space-x-3">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-900 dark:text-amber-200 text-sm">
                    {results.length} Companies Auto-Mailed! Status: Waiting for Company Response
                  </h4>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-1 leading-relaxed">
                    Personalized AI application emails with your attached resume have been auto-sent. All applications are now tracked in Application Tracker as **Waiting for Response**.
                  </p>
                </div>
              </div>

              {/* List of Auto-Mailed Companies */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                {results.map((res) => (
                  <div key={res.jobId} className="p-3.5 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {res.jobTitle}
                        </div>
                        <div className="text-slate-500">
                          {res.companyName} ({res.recipient})
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-[11px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-2.5 py-1 rounded-md border border-amber-300 dark:border-amber-700 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Waiting for Response
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {!loading && (
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <Link
              href="/emails"
              onClick={onClose}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1.5"
            >
              <Mail className="w-4 h-4" />
              <span>View Sent Email History</span>
            </Link>

            <div className="flex items-center space-x-3">
              <Link
                href="/applications"
                onClick={onClose}
                className="text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Kanban className="w-4 h-4" />
                <span>Go to Application Tracker</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
