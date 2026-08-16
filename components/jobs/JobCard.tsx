"use client";

import { useState } from "react";
import { DemoJob } from "@/data/demo-jobs";
import { MatchScoreBadge } from "./MatchScoreBadge";
import { normalizeSkills } from "@/lib/jobs/normalizeJob";
import {
  MapPin,
  IndianRupee,
  Briefcase,
  Clock,
  Bookmark,
  BookmarkCheck,
  Building2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Send
} from "lucide-react";

interface JobCardProps {
  job: DemoJob;
  matchScore?: number;
  isSaved?: boolean;
  onViewDetails: (job: DemoJob) => void;
  onToggleSave?: (jobId: string) => void;
  onTrackApplication?: (job: DemoJob) => void;
  onApplyWithAI?: (job: DemoJob) => void;
}

export function JobCard({
  job,
  matchScore = 88,
  isSaved = false,
  onViewDetails,
  onToggleSave,
  onTrackApplication,
  onApplyWithAI,
}: JobCardProps) {
  const [saved, setSaved] = useState(isSaved);
  const normalizedSkills = normalizeSkills(job?.skills);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(!saved);
    if (onToggleSave) onToggleSave(job.id);
  };

  return (
    <div
      onClick={() => onViewDetails(job)}
      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 rounded-2xl p-5 transition-all duration-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Header: Title, Company, Logo, Save */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
              {job.companyLogo && job.companyLogo.startsWith("http") ? (
                <img
                  src={job.companyLogo}
                  alt={job.companyName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <Building2 className="w-6 h-6 text-slate-400" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                {job.title}
              </h3>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span>{job.companyName}</span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-xs text-slate-500">{job.postedDate}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <MatchScoreBadge score={matchScore} size="sm" />
            <button
              onClick={handleSave}
              className={`p-2 rounded-xl border transition-colors ${
                saved
                  ? "bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400"
                  : "border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              title={saved ? "Unsave Job" : "Save Job"}
            >
              {saved ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Key Job Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-900/50">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="truncate">
              ₹{job.salaryMin}–{job.salaryMax} LPA
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{job.experienceMin}–{job.experienceMax} yrs</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{job.workMode}</span>
          </div>
        </div>

        {/* Short Summary */}
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {job.summary}
        </p>

        {/* Skill Badges */}
        <div className="flex flex-wrap gap-1.5">
          {normalizedSkills.length === 0 ? (
            <span className="text-[11px] font-medium bg-slate-100 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500 px-2.5 py-0.5 rounded-md italic border border-dashed border-slate-200 dark:border-slate-800">
              Skills not specified
            </span>
          ) : (
            <>
              {normalizedSkills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60"
                >
                  {skill}
                </span>
              ))}
              {normalizedSkills.length > 4 && (
                <span className="text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-md">
                  +{normalizedSkills.length - 4} more
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">
          Notice: <span className="text-slate-700 dark:text-slate-300 font-semibold">{job.noticePeriodReq}</span>
        </span>

        <div className="flex items-center space-x-2">
          {onApplyWithAI && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onApplyWithAI(job);
              }}
              className="text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-3 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1.5 group-hover:shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Apply with AI</span>
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(job);
            }}
            className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
          >
            <span>View Job</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
