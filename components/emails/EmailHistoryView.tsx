"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  FileText,
  RefreshCw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  UserCheck
} from "lucide-react";

interface ApplicationEmailRecord {
  id: string;
  userId: string;
  applicationId?: string;
  jobId?: string;
  companyName: string;
  jobTitle: string;
  recipient: string;
  subject: string;
  body: string;
  attachment?: string;
  provider: string;
  status: "DRAFT" | "SENT" | "DEMO_SENT" | "FAILED";
  sentAt?: string;
  createdAt: string;
}

export function EmailHistoryView() {
  const [emails, setEmails] = useState<ApplicationEmailRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [quota, setQuota] = useState({ usedToday: 0, dailyLimit: 20, remainingToday: 20 });
  const [selectedEmail, setSelectedEmail] = useState<ApplicationEmailRecord | null>(null);

  // Follow-up state
  const [followupLoading, setFollowupLoading] = useState(false);
  const [followupDraft, setFollowupDraft] = useState<{ subject: string; body: string; recipient: string } | null>(null);

  const fetchEmailHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/emails");
      const json = await res.json();
      if (json.success) {
        setEmails(json.data || []);
        if (json.quota) {
          setQuota(json.quota);
        }
      }
    } catch (err) {
      console.error("Failed to fetch email history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmailHistory();
  }, []);

  const filteredEmails = emails.filter((email) => {
    const matchesSearch =
      email.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ? true : email.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleGenerateFollowup = async (emailId: string) => {
    setFollowupLoading(true);
    setFollowupDraft(null);
    try {
      const res = await fetch("/api/emails/followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailId }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setFollowupDraft(json.data);
      }
    } catch (err) {
      console.error("Failed to generate follow-up:", err);
    } finally {
      setFollowupLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "WAITING_FOR_RESPONSE":
        return (
          <span className="text-[11px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded-md border border-amber-200 dark:border-amber-800 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-500" /> Waiting for Response
          </span>
        );
      case "SENT":
        return (
          <span className="text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Sent
          </span>
        );
      case "DEMO_SENT":
        return (
          <span className="text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded-md border border-amber-200 dark:border-amber-800 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Demo Sent
          </span>
        );
      case "DRAFT":
        return (
          <span className="text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Draft
          </span>
        );
      case "FAILED":
        return (
          <span className="text-[11px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 px-2.5 py-0.5 rounded-md border border-rose-200 dark:border-rose-800 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Failed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Header + Daily Limit Quota Meter */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-500/30 flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Email History & Tracker</h1>
              <p className="text-xs text-slate-300 mt-0.5">
                Review all AI-generated application emails, drafts, and follow-up dispatches.
              </p>
            </div>
          </div>
        </div>

        {/* Daily Send Limit Meter */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-3 rounded-2xl flex items-center space-x-4">
          <div className="text-right">
            <div className="text-xs font-semibold text-blue-200">Daily Email Limit</div>
            <div className="text-sm font-bold text-white">
              {quota.usedToday} / {quota.dailyLimit} used today
            </div>
          </div>

          <div className="w-24 bg-slate-800 h-2.5 rounded-full overflow-hidden border border-white/20">
            <div
              className={`h-full transition-all duration-300 ${
                quota.usedToday >= quota.dailyLimit ? "bg-rose-500" : "bg-gradient-to-r from-blue-400 to-indigo-400"
              }`}
              style={{ width: `${Math.min(100, (quota.usedToday / quota.dailyLimit) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Controls Bar: Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company, job, recipient..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
          {["ALL", "SENT", "DEMO_SENT", "DRAFT", "FAILED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${
                statusFilter === st
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              {st === "ALL" ? "All Statuses" : st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Email History Table / Card List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-500 mx-auto mb-2" />
          Loading email history...
        </div>
      ) : filteredEmails.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <Mail className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">No Application Emails Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't generated or sent any job application emails yet. Go to **Job Search** and click **Apply with AI** on any job card.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredEmails.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedEmail(item)}
                className="p-4 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {item.jobTitle}
                    </h4>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="font-semibold text-slate-600 dark:text-slate-400 text-xs">
                      {item.companyName}
                    </span>
                    {getStatusBadge(item.status)}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">To:</span> {item.recipient} | <span className="font-semibold text-slate-700 dark:text-slate-300">Subject:</span> {item.subject}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                    <span>Provider: <span className="font-mono font-semibold text-slate-600 dark:text-slate-300">{item.provider}</span></span>
                    <span>•</span>
                    <span>Date: {new Date(item.createdAt).toLocaleDateString()}</span>
                    {item.attachment && (
                      <>
                        <span>•</span>
                        <span className="text-blue-600 dark:text-blue-400 font-medium">📎 {item.attachment}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {(item.status === "SENT" || item.status === "DEMO_SENT") && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEmail(item);
                        handleGenerateFollowup(item.id);
                      }}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate Follow-up</span>
                    </button>
                  )}

                  <button
                    type="button"
                    className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>View Email</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Email Details Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div>
                <h3 className="font-bold text-base">{selectedEmail.jobTitle} at {selectedEmail.companyName}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Application Email Details</p>
              </div>

              <button
                onClick={() => {
                  setSelectedEmail(null);
                  setFollowupDraft(null);
                }}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-xs">
                <div>
                  <span className="font-bold text-slate-500">Recipient:</span>{" "}
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedEmail.recipient}</span>
                </div>
                <div>{getStatusBadge(selectedEmail.status)}</div>
              </div>

              <div className="text-xs space-y-1">
                <div className="font-bold text-slate-500">Subject:</div>
                <div className="font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  {selectedEmail.subject}
                </div>
              </div>

              <div className="text-xs space-y-1">
                <div className="font-bold text-slate-500">Email Body:</div>
                <div className="font-sans text-xs p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-200">
                  {selectedEmail.body}
                </div>
              </div>

              {/* Followup Draft Display if generated */}
              {followupLoading && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin text-blue-500" />
                  Generating 5-7 business day polite follow-up email...
                </div>
              )}

              {followupDraft && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-850 border border-blue-200 dark:border-slate-700 p-4 rounded-xl space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 dark:text-blue-200">
                    <Sparkles className="w-4 h-4 text-amber-400" /> AI Follow-Up Email Draft
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{followupDraft.subject}</div>
                  <div className="text-xs whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    {followupDraft.body}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Created: {new Date(selectedEmail.createdAt).toLocaleString()}</span>
              <button
                onClick={() => {
                  setSelectedEmail(null);
                  setFollowupDraft(null);
                }}
                className="font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 px-4 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
