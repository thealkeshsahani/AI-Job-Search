"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { JobCard } from "@/components/jobs/JobCard";
import { JobDetailModal } from "@/components/jobs/JobDetailModal";
import { DemoJob } from "@/data/demo-jobs";
import { normalizeJob } from "@/lib/jobs/normalizeJob";
import { Bookmark, Search } from "lucide-react";

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<DemoJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<DemoJob | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSavedJobs = async () => {
    try {
      const res = await fetch("/api/saved-jobs");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const jobsList = json.data.map((item: any) => normalizeJob(item.job)).filter(Boolean);
        setSavedJobs(jobsList);
      }
    } catch (e) {
      console.error("Error fetching saved jobs:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleToggleSave = async (jobId: string) => {
    setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
    try {
      await fetch("/api/saved-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
    } catch (e) {
      console.error("Failed to unsave job:", e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-1">
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Bookmark className="w-6 h-6 text-blue-400 fill-current" />
              Saved Jobs ({savedJobs.length})
            </h1>
            <p className="text-xs text-slate-400">
              Manage your bookmarked job postings and compare opportunities.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-44 bg-slate-900 animate-pulse rounded-2xl border border-slate-800"></div>
              ))}
            </div>
          ) : savedJobs.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">No saved jobs yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Click the bookmark icon on any job card in Job Search to save it here for quick access.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedJobs.map((job, idx) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSaved={true}
                  matchScore={92 - idx * 2}
                  onViewDetails={(j) => {
                    setSelectedJob(j);
                    setIsModalOpen(true);
                  }}
                  onToggleSave={handleToggleSave}
                />
              ))}
            </div>
          )}
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
