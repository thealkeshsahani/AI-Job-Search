"use client";

import { useState, useEffect } from "react";
import { DemoJob } from "@/data/demo-jobs";
import { MatchScoreBadge } from "./MatchScoreBadge";
import { normalizeSkills } from "@/lib/jobs/normalizeJob";
import {
  X,
  Sparkles,
  Send,
  Save,
  RefreshCw,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Mail,
  Building2,
  MapPin,
  ExternalLink,
  Info,
  Paperclip,
  Check
} from "lucide-react";

interface ApplyWithAIModalProps {
  job: DemoJob | null;
  isOpen: boolean;
  onClose: () => void;
  userSkills?: string[];
  onApplicationComplete?: (appData: any) => void;
}

export function ApplyWithAIModal({
  job,
  isOpen,
  onClose,
  userSkills = ["Python", "React", "Node.js", "SQL", "FastAPI", "Git", "Docker"],
  onApplicationComplete,
}: ApplyWithAIModalProps) {
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [editing, setEditing] = useState(false);
  const [emailData, setEmailData] = useState<{
    recipient: string;
    subject: string;
    body: string;
    attachment: string;
    companyEmailAvailable: boolean;
    applicationUrl?: string;
  } | null>(null);

  const [promptInput, setPromptInput] = useState("");
  const [refining, setRefining] = useState(false);
  const [attachResume, setAttachResume] = useState(true);
  const [selectedResume, setSelectedResume] = useState("Resume_Rahul_Sharma.pdf");
  
  // Status feedback state
  const [alertState, setAlertState] = useState<{
    type: "SUCCESS" | "WARNING" | "ERROR" | "DEMO" | null;
    message: string;
    previousEmail?: any;
  }>({ type: null, message: "" });

  const [duplicateConfirmed, setDuplicateConfirmed] = useState(false);

  // Compute skill matches
  const jobSkills = normalizeSkills(job?.skills);
  const matchingSkills = jobSkills.filter((s) =>
    userSkills.some((us) => us.toLowerCase() === s.toLowerCase())
  );
  const missingSkills = jobSkills.filter(
    (s) => !userSkills.some((us) => us.toLowerCase() === s.toLowerCase())
  );

  const matchScore = Math.min(
    98,
    Math.max(65, Math.round((matchingSkills.length / Math.max(1, jobSkills.length)) * 100 + 35))
  );

  // Generate Email when modal opens
  useEffect(() => {
    if (isOpen && job) {
      handleGenerateEmail();
      setAlertState({ type: null, message: "" });
      setDuplicateConfirmed(false);
      setEditing(false);
    }
  }, [isOpen, job?.id]);

  const handleGenerateEmail = async () => {
    if (!job) return;
    setLoading(true);
    try {
      const res = await fetch("/api/emails/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.id,
          jobTitle: job.title,
          companyName: job.companyName,
          jobDescription: job.description,
          recruiterEmail: job.recruiterEmail,
          applicationUrl: job.applicationUrl,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setEmailData(json.data);
      }
    } catch (err) {
      console.error("Failed to generate email:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefineWithAI = async () => {
    if (!promptInput.trim() || !emailData) return;
    setRefining(true);
    try {
      const res = await fetch("/api/emails/modify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentEmail: emailData,
          instruction: promptInput,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setEmailData((prev) => (prev ? { ...prev, ...json.data } : null));
        setPromptInput("");
      }
    } catch (err) {
      console.error("Refine email error:", err);
    } finally {
      setRefining(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!emailData || !job) return;
    try {
      const res = await fetch("/api/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.id,
          jobTitle: job.title,
          companyName: job.companyName,
          recipient: emailData.recipient,
          subject: emailData.subject,
          emailBody: emailData.body,
          attachment: attachResume ? selectedResume : "",
          isDraftOnly: true,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setAlertState({
          type: "SUCCESS",
          message: "Application saved to drafts in Email History!",
        });
      }
    } catch (err) {
      console.error("Save draft error:", err);
    }
  };

  const handleSendApplication = async (forceSend = false) => {
    if (!emailData || !job) return;
    setSending(true);
    setAlertState({ type: null, message: "" });

    try {
      const res = await fetch("/api/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.id,
          jobTitle: job.title,
          companyName: job.companyName,
          recipient: emailData.recipient,
          subject: emailData.subject,
          emailBody: emailData.body,
          attachment: attachResume ? selectedResume : "",
          ignoreDuplicateWarning: forceSend || duplicateConfirmed,
        }),
      });

      const json = await res.json();

      if (!json.success) {
        if (json.error === "DUPLICATE_APPLICATION_WARNING") {
          setAlertState({
            type: "WARNING",
            message: json.message,
            previousEmail: json.previousEmail,
          });
          setSending(false);
          return;
        }

        if (json.error === "DAILY_LIMIT_REACHED") {
          setAlertState({
            type: "ERROR",
            message: json.message,
          });
          setSending(false);
          return;
        }

        setAlertState({
          type: "ERROR",
          message: json.message || "We couldn't send the email.",
        });
        setSending(false);
        return;
      }

      // Success / Demo mode success
      if (json.sendResult?.provider === "DEMO" || json.data?.status === "DEMO_SENT") {
        setAlertState({
          type: "DEMO",
          message: `Demo Mode: Application email generated & logged successfully. No real email was dispatched. Recipient: ${emailData.recipient}`,
        });
      } else {
        setAlertState({
          type: "SUCCESS",
          message: `Email successfully sent to ${emailData.recipient}! Status updated to APPLIED in Application Tracker.`,
        });
      }

      if (onApplicationComplete) {
        onApplicationComplete(json.data);
      }
    } catch (err) {
      console.error("Send application error:", err);
      setAlertState({
        type: "ERROR",
        message: "Failed to send email. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col my-8 max-h-[90vh]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between border-b border-blue-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight flex items-center gap-2">
                Apply with AI
                <span className="text-xs bg-blue-500/30 text-blue-200 border border-blue-400/30 px-2 py-0.5 rounded-full font-mono">
                  Personalized Workflow
                </span>
              </h2>
              <p className="text-xs text-blue-200">
                {job.title} • {job.companyName} ({job.location})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Alert Status Banners */}
          {alertState.type === "DEMO" && (
            <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 p-4 rounded-2xl flex items-start space-x-3">
              <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-900 dark:text-amber-200 text-sm">
                  Demo Mode Active
                </h4>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1 leading-relaxed">
                  {alertState.message}
                </p>
                <div className="mt-2 text-xs font-semibold text-amber-800 dark:text-amber-300">
                  Status logged in Application Tracker: <span className="underline">Demo Sent</span>
                </div>
              </div>
            </div>
          )}

          {alertState.type === "SUCCESS" && (
            <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-4 rounded-2xl flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">
                  Application Sent Successfully!
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                  {alertState.message}
                </p>
              </div>
            </div>
          )}

          {alertState.type === "WARNING" && (
            <div className="bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800 p-4 rounded-2xl space-y-3">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-orange-900 dark:text-orange-200 text-sm">
                    You already contacted this company about this position.
                  </h4>
                  <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                    An application email was previously sent to {emailData?.recipient} for {job.title}.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 pt-2 border-t border-orange-200 dark:border-orange-800">
                <button
                  type="button"
                  onClick={() => {
                    setDuplicateConfirmed(true);
                    handleSendApplication(true);
                  }}
                  className="text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 px-3.5 py-1.5 rounded-lg shadow-sm"
                >
                  Send Anyway
                </button>
                <button
                  type="button"
                  onClick={() => setAlertState({ type: null, message: "" })}
                  className="text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {alertState.type === "ERROR" && (
            <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 p-4 rounded-2xl flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-rose-900 dark:text-rose-200 text-sm">
                  We couldn't send the email.
                </h4>
                <p className="text-xs text-rose-700 dark:text-rose-300 mt-1">
                  {alertState.message}
                </p>
              </div>
            </div>
          )}

          {/* Section 1: Job Match Overview */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 space-y-2 border-r border-slate-200 dark:border-slate-700 pr-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-500">AI Compatibility</span>
                <MatchScoreBadge score={matchScore} size="md" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Resume aligns well with {matchingSkills.length} key required skills.
              </p>
            </div>

            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Matching Skills:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{matchingSkills.join(", ") || "Python, SQL"}</span>
              </div>
              {missingSkills.length > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Missing Skills:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-medium">{missingSkills.join(", ")}</span>
                </div>
              )}
              {/* Recruiter Email Verification Banner */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-500" />
                  Contact Recruiter Email:
                </span>
                {emailData?.companyEmailAvailable ? (
                  <span className="font-semibold text-slate-800 dark:text-slate-200 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
                    {emailData.recipient}
                  </span>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500 italic">No verified company email available.</span>
                    {job.applicationUrl && (
                      <a
                        href={job.applicationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 dark:text-blue-400 font-bold underline flex items-center gap-1 hover:text-blue-700"
                      >
                        Apply on Job Portal <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Resume Attachment Picker */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center shrink-0">
                <Paperclip className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Resume Attachment</h4>
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Check className="w-3 h-3" /> Verified PDF/DOCX
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Attached resume will be referenced in your application email body.</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <select
                value={selectedResume}
                onChange={(e) => setSelectedResume(e.target.value)}
                className="text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Resume_Rahul_Sharma.pdf">Resume_Rahul_Sharma.pdf (Primary ATS Resume)</option>
                <option value="Rahul_Sharma_FullStack_2026.pdf">Rahul_Sharma_FullStack_2026.pdf</option>
                <option value="Rahul_Sharma_Python_Dev.docx">Rahul_Sharma_Python_Dev.docx</option>
              </select>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={attachResume}
                  onChange={(e) => setAttachResume(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Attach Resume ✓</span>
              </label>
            </div>
          </div>

          {/* Section 3: AI Email Preview & Editor */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Email Preview & Editor
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setEditing(!editing)}
                  className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
                    editing
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{editing ? "Preview Mode" : "Edit Email"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleGenerateEmail}
                  disabled={loading}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-3 py-1 rounded-lg transition-colors flex items-center gap-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  <span>Regenerate</span>
                </button>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  AI is analyzing resume & job description to write personalized application email...
                </p>
              </div>
            ) : emailData ? (
              <div className="p-4 space-y-3 font-sans text-xs">
                {/* To Field */}
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-500 w-16">To:</span>
                  {editing ? (
                    <input
                      type="email"
                      value={emailData.recipient}
                      onChange={(e) => setEmailData({ ...emailData, recipient: e.target.value })}
                      className="flex-1 font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-2 py-1 rounded-md"
                    />
                  ) : (
                    <span className="font-semibold text-slate-900 dark:text-white">{emailData.recipient}</span>
                  )}
                </div>

                {/* Subject Field */}
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-500 w-16">Subject:</span>
                  {editing ? (
                    <input
                      type="text"
                      value={emailData.subject}
                      onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                      className="flex-1 font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-2 py-1 rounded-md"
                    />
                  ) : (
                    <span className="font-bold text-slate-900 dark:text-white">{emailData.subject}</span>
                  )}
                </div>

                {/* Email Body */}
                <div>
                  {editing ? (
                    <textarea
                      rows={12}
                      value={emailData.body}
                      onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                      className="w-full font-mono text-xs p-3 bg-slate-50 dark:bg-slate-850 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 p-4 rounded-xl whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-200 font-sans">
                      {emailData.body}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          {/* Section 4: AI Natural Language Refine Box */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/80 dark:to-slate-800 border border-blue-200/80 dark:border-slate-700 p-3.5 rounded-2xl flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRefineWithAI();
              }}
              placeholder="Refine with AI e.g. 'Make it shorter', 'Mention my Django project', 'Make more formal'..."
              className="flex-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleRefineWithAI}
              disabled={refining || !promptInput.trim()}
              className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-2 rounded-xl transition-colors shrink-0 disabled:opacity-50"
            >
              {refining ? "Refining..." : "Refine"}
            </button>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Draft</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-2"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => handleSendApplication()}
              disabled={sending || loading || !emailData}
              className="text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{sending ? "Sending Application..." : "Send Application"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
