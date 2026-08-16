"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  Kanban,
  Plus,
  Trash2,
  Calendar,
  Building2,
  MapPin,
  IndianRupee,
  Edit2,
  Check,
  X,
  Clock,
  Sparkles
} from "lucide-react";

interface ApplicationItem {
  id: string;
  jobId?: string;
  jobTitle: string;
  companyName: string;
  location: string;
  salary: string;
  status: "SAVED" | "APPLIED" | "SCREENING" | "INTERVIEW" | "OFFER" | "REJECTED";
  appliedDate: string;
  nextFollowUp?: string | null;
  notes?: string;
}

const KANBAN_COLUMNS: { key: ApplicationItem["status"]; title: string; color: string }[] = [
  { key: "SAVED", title: "Saved", color: "bg-slate-500" },
  { key: "APPLIED", title: "Applied", color: "bg-blue-500" },
  { key: "SCREENING", title: "Screening", color: "bg-purple-500" },
  { key: "INTERVIEW", title: "Interview", color: "bg-amber-500" },
  { key: "OFFER", title: "Offer", color: "bg-emerald-500" },
  { key: "REJECTED", title: "Rejected", color: "bg-rose-500" },
];

export default function ApplicationTrackerPage() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);

  // New Application Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newLocation, setNewLocation] = useState("Bangalore");
  const [newSalary, setNewSalary] = useState("₹10–16 LPA");
  const [newStatus, setNewStatus] = useState<ApplicationItem["status"]>("APPLIED");
  const [newNotes, setNewNotes] = useState("");

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/applications");
      const json = await res.json();
      if (json.success) {
        setApplications(json.data);
      }
    } catch (e) {
      console.error("Error fetching applications:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (id: string, newStat: ApplicationItem["status"]) => {
    // Optimistic UI Update
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStat } : app))
    );

    try {
      await fetch("/api/applications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStat }),
      });
    } catch (e) {
      console.error("Failed to update status:", e);
    }
  };

  const handleDelete = async (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
    try {
      await fetch(`/api/applications?id=${id}`, { method: "DELETE" });
    } catch (e) {
      console.error("Failed to delete application:", e);
    }
  };

  const handleAddApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCompany) return;

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: newTitle,
          companyName: newCompany,
          location: newLocation,
          salary: newSalary,
          status: newStatus,
          notes: newNotes,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setIsAddModalOpen(false);
        setNewTitle("");
        setNewCompany("");
        setNewNotes("");
        fetchApplications();
      }
    } catch (e) {
      console.error("Failed to add application:", e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Header */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <Kanban className="w-6 h-6 text-blue-400" />
                Kanban Application Tracker
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Track your active job applications, interview rounds, and follow-ups in real-time.
              </p>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Application</span>
            </button>
          </div>

          {/* Kanban Board Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
            {KANBAN_COLUMNS.map((col) => {
              const colApps = applications.filter((a) => a.status === col.key);

              return (
                <div key={col.key} className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-3.5 flex flex-col min-h-[500px]">
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 px-1">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${col.color}`}></span>
                      <span className="font-bold text-white text-xs">{col.title}</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                      {colApps.length}
                    </span>
                  </div>

                  {/* Cards List */}
                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {colApps.map((app) => (
                      <div
                        key={app.id}
                        className="bg-slate-900 border border-slate-800 hover:border-blue-500/40 rounded-2xl p-3.5 space-y-2.5 shadow-sm transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-white text-xs line-clamp-1">{app.jobTitle}</h4>
                            <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                              <span className="truncate">{app.companyName}</span>
                            </p>
                          </div>
                          <button
                            onClick={() => handleDelete(app.id)}
                            className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-[10px] text-slate-400 flex flex-wrap items-center gap-2">
                          <span className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            {app.location}
                          </span>
                          <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/50 font-semibold">
                            <IndianRupee className="w-3 h-3" />
                            {app.salary}
                          </span>
                        </div>

                        {app.nextFollowUp && (
                          <div className="text-[10px] text-amber-300 bg-amber-950/40 p-2 rounded-lg border border-amber-900/50 flex items-center gap-1">
                            <Clock className="w-3 h-3 shrink-0" />
                            <span className="truncate">{app.nextFollowUp}</span>
                          </div>
                        )}

                        {app.notes && (
                          <p className="text-[10px] text-slate-400 line-clamp-2 italic bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                            "{app.notes}"
                          </p>
                        )}

                        {/* Move Status Selector */}
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                          <span className="text-[10px] text-slate-500">Move:</span>
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, e.target.value as any)}
                            className="bg-slate-950 border border-slate-800 text-[10px] font-semibold text-slate-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            {KANBAN_COLUMNS.map((c) => (
                              <option key={c.key} value={c.key}>{c.title}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Add Application Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Add New Job Application</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddApplication} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Python Developer"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Razorpay"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Salary (LPA)</label>
                  <input
                    type="text"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Initial Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {KANBAN_COLUMNS.map((c) => (
                    <option key={c.key} value={c.key}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notes / Follow-up</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Referred by friend, interview scheduled for Friday..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md"
                >
                  Add Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
