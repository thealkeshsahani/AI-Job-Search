"use client";

import { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { JobCard } from "@/components/jobs/JobCard";
import { JobDetailModal } from "@/components/jobs/JobDetailModal";
import { ApplyWithAIModal } from "@/components/jobs/ApplyWithAIModal";
import { AutoApplyProgressModal } from "@/components/resume/AutoApplyProgressModal";
import { DemoJob } from "@/data/demo-jobs";
import {
  Search,
  MapPin,
  IndianRupee,
  Briefcase,
  Clock,
  Filter,
  ArrowUpDown,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  X
} from "lucide-react";

const INDIAN_CITIES = [
  "All Locations",
  "Bangalore",
  "Mumbai",
  "Gurugram (Delhi NCR)",
  "Pune",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Jaipur",
  "Ahmedabad",
  "Remote",
];

const SALARY_RANGES = [
  { label: "Any Salary", min: 0 },
  { label: "₹4+ LPA", min: 4.0 },
  { label: "₹6+ LPA", min: 6.0 },
  { label: "₹10+ LPA", min: 10.0 },
  { label: "₹15+ LPA", min: 15.0 },
  { label: "₹25+ LPA", min: 25.0 },
];

const NOTICE_PERIODS = ["Any Notice", "Immediate", "15 Days", "30 Days", "60 Days", "90 Days"];
const WORK_MODES = ["All Modes", "Remote", "Hybrid", "On-site"];

export default function JobSearchPage() {
  const [jobs, setJobs] = useState<DemoJob[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [query, setQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedSalaryMin, setSelectedSalaryMin] = useState(0);
  const [selectedNotice, setSelectedNotice] = useState("Any Notice");
  const [selectedWorkMode, setSelectedWorkMode] = useState("All Modes");
  const [sortBy, setSortBy] = useState<"match" | "salary" | "date">("match");

  // Modal State
  const [selectedJob, setSelectedJob] = useState<DemoJob | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Apply with AI Modal State
  const [applyModalJob, setApplyModalJob] = useState<DemoJob | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isAutoApplyOpen, setIsAutoApplyOpen] = useState(false);

  // Fetch Jobs Function
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append("query", query);
      if (selectedLocation !== "All Locations") params.append("location", selectedLocation);
      if (selectedWorkMode !== "All Modes") params.append("workMode", selectedWorkMode);
      if (selectedNotice !== "Any Notice") params.append("noticePeriod", selectedNotice);
      if (selectedSalaryMin > 0) params.append("salaryMin", selectedSalaryMin.toString());
      params.append("sortBy", sortBy);

      const res = await fetch(`/api/jobs?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setJobs(json.data);
      }
    } catch (e) {
      console.error("Error searching jobs:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedLocation, selectedWorkMode, selectedNotice, selectedSalaryMin, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleResetFilters = () => {
    setQuery("");
    setSelectedLocation("All Locations");
    setSelectedSalaryMin(0);
    setSelectedNotice("Any Notice");
    setSelectedWorkMode("All Modes");
    setSortBy("match");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Top Search Banner */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Search className="w-6 h-6 text-blue-400" />
                  Indian Job Market Search
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Explore 20+ verified tech roles across Bangalore, Mumbai, Hyderabad, Pune & Remote.
                </p>
              </div>

              {/* Sort Selector & Auto-Apply CTA */}
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAutoApplyOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto-Apply & Mail All</span>
                </button>

                <div className="flex items-center space-x-2">
                  <ArrowUpDown className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-400">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="match">AI Match Score</option>
                    <option value="salary">Salary (High to Low)</option>
                    <option value="date">Date Posted</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by job title, skill (Python, React, Docker), or company (Razorpay, Swiggy)..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-2xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </form>
          </div>

          {/* Main Content Layout: Left Filters + Right Results */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filter Sidebar (Desktop) */}
            <aside className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-6 h-fit">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                  <span className="font-bold text-white text-sm">Indian Market Filters</span>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Location Filter */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" /> Location / Metro City
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {INDIAN_CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Salary LPA Filter */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-400" /> Minimum Salary (LPA)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SALARY_RANGES.map((sal) => (
                    <button
                      key={sal.label}
                      type="button"
                      onClick={() => setSelectedSalaryMin(sal.min)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        selectedSalaryMin === sal.min
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {sal.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Work Mode */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> Work Setup
                </label>
                <select
                  value={selectedWorkMode}
                  onChange={(e) => setSelectedWorkMode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {WORK_MODES.map((mode) => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
              </div>

              {/* Notice Period Filter */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Max Notice Period
                </label>
                <select
                  value={selectedNotice}
                  onChange={(e) => setSelectedNotice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {NOTICE_PERIODS.map((notice) => (
                    <option key={notice} value={notice}>{notice}</option>
                  ))}
                </select>
              </div>
            </aside>

            {/* Job Search Results Column */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Showing <strong className="text-white">{jobs.length}</strong> matching positions</span>
                {selectedLocation !== "All Locations" && (
                  <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
                    Location: {selectedLocation}
                  </span>
                )}
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-44 bg-slate-900 animate-pulse rounded-2xl border border-slate-800"></div>
                  ))}
                </div>
              ) : jobs.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">No matching jobs found</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Try broadening your filters or clearing search keywords to view available Indian tech positions.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job, idx) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      matchScore={Math.max(65, 96 - idx * 2)}
                      onViewDetails={(j) => {
                        setSelectedJob(j);
                        setIsModalOpen(true);
                      }}
                      onApplyWithAI={(j) => {
                        setApplyModalJob(j);
                        setIsApplyModalOpen(true);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <JobDetailModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <ApplyWithAIModal
        job={applyModalJob}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />

      <AutoApplyProgressModal
        isOpen={isAutoApplyOpen}
        onClose={() => setIsAutoApplyOpen(false)}
      />
    </div>
  );
}
