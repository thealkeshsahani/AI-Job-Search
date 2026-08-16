"use client";

import { useState } from "react";
import { DemoJob } from "@/data/demo-jobs";
import { MatchScoreBadge } from "./MatchScoreBadge";
import {
  X,
  MapPin,
  IndianRupee,
  Briefcase,
  Clock,
  Building2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Bookmark,
  BookmarkCheck,
  Send,
  Kanban,
  Check
} from "lucide-react";

import { normalizeSkills } from "@/lib/jobs/normalizeJob";

interface JobDetailModalProps {
  job: DemoJob | null;
  isOpen: boolean;
  onClose: () => void;
  onTrackApplication?: (job: DemoJob) => void;
}

export function JobDetailModal({
  job,
  isOpen,
  onClose,
  onTrackApplication,
}: JobDetailModalProps) {
  const [saved, setSaved] = useState(false);
  const [tracked, setTracked] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  if (!isOpen || !job) return null;

  const skillsList = normalizeSkills(job?.skills);

  // Conceptual match breakdown
  const matchResult = {
    overall: 92,
    skillsMatch: 95,
    experienceMatch: 88,
    locationMatch: 100,
    salaryMatch: 85,
    matchingSkills: skillsList.slice(0, Math.ceil(skillsList.length * 0.75)),
    missingSkills: ["Docker", "AWS", "Kubernetes"].filter(
      (s) => !skillsList.includes(s)
    ),
    aiAdvice: `Your profile is a strong match (92%) for this ${job.title} position at ${job.companyName}. Your skills in ${skillsList.slice(0, 2).join(" & ") || "software engineering"} align well with the role requirements. Consider adding Docker or AWS exposure before interviewing to stand out even further.`,
  };

  const handleApply = () => {
    setApplying(true);
    setTimeout(() => {
      setApplying(false);
      setApplied(true);
      if (onTrackApplication) onTrackApplication(job);
    }, 800);
  };

  const handleTrack = () => {
    setTracked(true);
    if (onTrackApplication) onTrackApplication(job);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Sticky Modal Header */}
        <div className="sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
              <Building2 className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-lg leading-tight line-clamp-1">
                {job.title}
              </h2>
              <p className="text-xs font-medium text-slate-500">{job.companyName} • {job.location}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* AI Match Overview Banner */}
          <div className="bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-slate-900/10 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-slate-900/40 border border-blue-200 dark:border-blue-800/60 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="font-bold text-slate-900 dark:text-white text-base">Your AI Match Breakdown</span>
              </div>
              <MatchScoreBadge score={matchResult.overall} size="lg" />
            </div>

            {/* Score Progress Bar Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/80 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[11px] font-medium text-slate-500">Skills Match</span>
                <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">{matchResult.skillsMatch}%</p>
              </div>

              <div className="bg-white/80 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[11px] font-medium text-slate-500">Experience</span>
                <p className="text-base font-bold text-blue-600 dark:text-blue-400">{matchResult.experienceMatch}%</p>
              </div>

              <div className="bg-white/80 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[11px] font-medium text-slate-500">Location</span>
                <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">{matchResult.locationMatch}%</p>
              </div>

              <div className="bg-white/80 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[11px] font-medium text-slate-500">Salary Alignment</span>
                <p className="text-base font-bold text-indigo-600 dark:text-indigo-400">{matchResult.salaryMatch}%</p>
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="bg-blue-50/80 dark:bg-blue-950/60 p-3.5 rounded-xl border border-blue-200/60 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
              <span className="font-bold block mb-1">AI Recommendation:</span>
              {matchResult.aiAdvice}
            </div>

            {/* Missing Skills Warning */}
            {matchResult.missingSkills.length > 0 && (
              <div className="flex items-start space-x-2 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-900/50">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Missing/Suggested Skills for higher ATS score: </span>
                  {matchResult.missingSkills.join(", ")}
                </div>
              </div>
            )}
          </div>

          {/* Quick Specs Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-500 block">Salary Scale</span>
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                ₹{job.salaryMin}–{job.salaryMax} LPA
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-500 block">Experience Req.</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {job.experienceMin}–{job.experienceMax} Years
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-500 block">Work Setup</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {job.workMode}
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-500 block">Notice Period</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {job.noticePeriodReq}
              </span>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">Job Overview</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Required Skills */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2.5">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg border border-blue-200 dark:border-blue-800 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Key Responsibilities & Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">Key Requirements</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300 list-disc list-inside">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="leading-relaxed">{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">Perks & Benefits</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                {job.benefits.map((b, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSaved(!saved)}
              className={`px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-2 transition-colors ${
                saved
                  ? "bg-blue-50 dark:bg-blue-950 border-blue-300 text-blue-600"
                  : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {saved ? <BookmarkCheck className="w-4 h-4 text-blue-600 fill-current" /> : <Bookmark className="w-4 h-4" />}
              <span>{saved ? "Saved" : "Save Job"}</span>
            </button>

            <a
              href={`/assistant`}
              className="px-4 py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask AI About Job</span>
            </a>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleTrack}
              className={`px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-2 transition-colors ${
                tracked
                  ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-600"
                  : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Kanban className="w-4 h-4 text-slate-500" />
              <span>{tracked ? "Tracked in Kanban" : "Track Application"}</span>
            </button>

            <button
              onClick={handleApply}
              disabled={applying || applied}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all disabled:opacity-80"
            >
              {applied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Applied Successfully</span>
                </>
              ) : applying ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Apply Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
