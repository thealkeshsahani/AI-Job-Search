"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { JobCard } from "@/components/jobs/JobCard";
import { JobDetailModal } from "@/components/jobs/JobDetailModal";
import { DemoJob } from "@/data/demo-jobs";
import {
  Sparkles,
  TrendingUp,
  FileText,
  Briefcase,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  PieChart as PieIcon,
  BarChart3,
  Search,
  Plus
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

const APPLICATION_STATUS_DATA = [
  { name: "Saved", value: 4, color: "#64748B" },
  { name: "Applied", value: 5, color: "#3B82F6" },
  { name: "Screening", value: 2, color: "#8B5CF6" },
  { name: "Interview", value: 3, color: "#F59E0B" },
  { name: "Offer", value: 1, color: "#10B981" },
  { name: "Rejected", value: 1, color: "#EF4444" },
];

const SKILLS_DISTRIBUTION_DATA = [
  { skill: "Python", matchPct: 95 },
  { skill: "SQL", matchPct: 90 },
  { skill: "React", matchPct: 88 },
  { skill: "FastAPI", matchPct: 82 },
  { skill: "Git", matchPct: 85 },
  { skill: "Docker", matchPct: 45 },
];

export default function DashboardPage() {
  const [jobs, setJobs] = useState<DemoJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<DemoJob | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await fetch("/api/jobs");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setJobs(json.data.slice(0, 6));
        }
      } catch (e) {
        console.error("Failed to load jobs:", e);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  const handleViewDetails = (job: DemoJob) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Good morning, Rahul Sharma 👋</h1>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Here's your career activity & AI matching overview at a glance.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                href="/jobs"
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all"
              >
                <Search className="w-4 h-4" />
                <span>Search Jobs</span>
              </Link>

              <Link
                href="/resume"
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 flex items-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Upload Resume</span>
              </Link>
            </div>
          </div>

          {/* Key Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stat 1 */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Jobs Matched</span>
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-white">128</span>
                <span className="text-xs font-semibold text-emerald-400">+14 this week</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">Based on Python & Bangalore hybrid preferences</p>
            </div>

            {/* Stat 2 */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Active Applications</span>
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Briefcase className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-white">14</span>
                <span className="text-xs font-semibold text-amber-400">6 pending reply</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">Tracked in Kanban Application Board</p>
            </div>

            {/* Stat 3 */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Interviews Scheduled</span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-white">3</span>
                <span className="text-xs font-semibold text-emerald-400">Tech Round 2 next</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">TechNova Solutions & Swiggy</p>
            </div>

            {/* Stat 4 */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">ATS Resume Score</span>
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-indigo-400">82 / 100</span>
                <span className="text-xs font-semibold text-slate-400">Good</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">Missing Docker & AWS key metrics</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Applications by Status */}
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-white text-base">Applications Pipeline</h3>
                  <p className="text-xs text-slate-400">Distribution by Kanban stage</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                  <PieIcon className="w-3.5 h-3.5 text-blue-400" />
                  <span>Real-time</span>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={APPLICATION_STATUS_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {APPLICATION_STATUS_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0F172A",
                        borderColor: "#334155",
                        borderRadius: "12px",
                        color: "#FFF",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800 text-xs">
                {APPLICATION_STATUS_DATA.map((item) => (
                  <div key={item.name} className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-300 font-medium">{item.name}: <strong className="text-white">{item.value}</strong></span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 2: Skills Match Alignment Bar Chart */}
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-white text-base">Skills Market Alignment</h3>
                  <p className="text-xs text-slate-400">Your skill proficiency vs job demand</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Target Stack</span>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SKILLS_DISTRIBUTION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="skill" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0F172A",
                        borderColor: "#334155",
                        borderRadius: "12px",
                        color: "#FFF",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="matchPct" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Top Strength: <strong className="text-emerald-400">Python (95%)</strong></span>
                <span>Gap Area: <strong className="text-amber-400">Docker (45%)</strong></span>
              </div>
            </div>
          </div>

          {/* Recommended Jobs Widget Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  Recommended Jobs for You
                </h2>
                <p className="text-xs text-slate-400">
                  Hand-picked based on your resume score, LPA target, and preferred cities.
                </p>
              </div>

              <Link
                href="/jobs"
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <span>View All Jobs</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-48 bg-slate-900 animate-pulse rounded-2xl border border-slate-800"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map((job, idx) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    matchScore={94 - idx * 2}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </div>
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
