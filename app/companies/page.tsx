"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { DemoCompany } from "@/data/demo-companies";
import {
  Search,
  Building2,
  Globe,
  Users,
  Star,
  Sparkles,
  MapPin,
  ExternalLink,
  Briefcase,
  CheckCircle2
} from "lucide-react";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<DemoCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<DemoCompany | null>(null);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/companies?query=${encodeURIComponent(query)}`);
      const json = await res.json();
      if (json.success) {
        setCompanies(json.data);
      }
    } catch (e) {
      console.error("Error loading companies:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [query]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Header */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-blue-400" />
                  Company Research & Culture Insights
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Evaluate tech companies, startup culture, tech stacks, and AI "Should I Apply?" assessments before interviewing.
                </p>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search companies (TCS, Infosys, Google, Razorpay, Swiggy)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Companies Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-slate-900 animate-pulse rounded-3xl border border-slate-800"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {companies.map((comp) => (
                <div
                  key={comp.id}
                  className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-3xl p-6 transition-all duration-200 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                          {comp.logo && comp.logo.startsWith("http") ? (
                            <img src={comp.logo} alt={comp.name} className="w-full h-full object-cover" />
                          ) : (
                            <Building2 className="w-6 h-6 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-lg leading-tight">{comp.name}</h3>
                          <p className="text-xs text-slate-400 font-medium">{comp.industry}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{comp.rating}</span>
                      </div>
                    </div>

                    {/* Metadata Badges */}
                    <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        {comp.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-emerald-400" />
                        {comp.size}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                        {comp.openJobsCount} Open Jobs
                      </span>
                    </div>

                    {/* Overview */}
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {comp.overview}
                    </p>

                    {/* Tech Stack */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Primary Tech Stack
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {comp.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="text-[11px] font-medium bg-slate-950 text-slate-300 px-2.5 py-0.5 rounded-md border border-slate-800"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* AI Should I Apply? Box */}
                    <div className="bg-blue-950/40 border border-blue-800/60 p-3.5 rounded-2xl space-y-1 text-xs text-blue-200">
                      <div className="flex items-center space-x-1.5 font-bold text-blue-400">
                        <Sparkles className="w-4 h-4" />
                        <span>AI "Should I Apply?" Assessment:</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {comp.shouldApplySummary}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <a
                      href={comp.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Visit Website</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>

                    <a
                      href={`/jobs?query=${encodeURIComponent(comp.name)}`}
                      className="text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-xl transition-colors"
                    >
                      View Open Jobs ({comp.openJobsCount})
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
