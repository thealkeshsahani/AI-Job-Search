import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import {
  Sparkles,
  ArrowRight,
  FileText,
  Search,
  Building2,
  Kanban,
  CheckCircle2,
  Shield,
  TrendingUp,
  MapPin,
  IndianRupee,
  Briefcase,
  Bot
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[250px] bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tailored for the Indian Job Market 🇮🇳</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Find the right job. <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">
                Build the right career.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Byte Builder AI searches jobs, analyzes your resume, matches you with relevant opportunities, researches companies, and helps you manage your applications — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/jobs"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Start Your Job Search</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/resume"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-base transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Analyze My Resume</span>
              </Link>
            </div>
          </div>

          {/* Hero UI Dashboard Preview Mockup */}
          <div className="mt-14 max-w-5xl mx-auto rounded-3xl bg-slate-900/90 border border-slate-800 p-4 sm:p-6 shadow-2xl shadow-blue-900/15 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                <span className="text-xs text-slate-400 font-mono ml-2">bytebuilder.ai/dashboard</span>
              </div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/80">
                Live AI Match Score: 92%
              </span>
            </div>

            {/* Dashboard Mockup Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Stat Card 1 */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
                <span className="text-xs text-slate-400">Jobs Matched Today</span>
                <p className="text-2xl font-bold text-white mt-1">128</p>
                <span className="text-[11px] text-emerald-400 font-medium">+14 new in Bangalore</span>
              </div>

              {/* Stat Card 2 */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
                <span className="text-xs text-slate-400">ATS Resume Score</span>
                <p className="text-2xl font-bold text-blue-400 mt-1">82 / 100</p>
                <span className="text-[11px] text-slate-400">Strong Python & SQL stack</span>
              </div>

              {/* Stat Card 3 */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
                <span className="text-xs text-slate-400">Applications Tracked</span>
                <p className="text-2xl font-bold text-amber-400 mt-1">14 Active</p>
                <span className="text-[11px] text-amber-400">3 Interviews Scheduled</span>
              </div>
            </div>

            {/* Recommended Job Preview */}
            <div className="mt-4 bg-slate-950/90 rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center text-sm border border-blue-500/30">
                  RZ
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Senior Full Stack AI Engineer</h4>
                  <p className="text-xs text-slate-400">Razorpay • Bangalore • ₹22–35 LPA • Hybrid</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30">
                  94% Match
                </span>
                <span className="text-xs font-semibold bg-blue-600 text-white px-3 py-1 rounded-lg">
                  View Job
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-slate-900/60 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">How Byte Builder AI Works</h2>
            <p className="text-sm text-slate-400 mt-2">
              Four simple steps from resume upload to getting interviewed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center mb-4 text-base border border-blue-500/30">
                1
              </div>
              <h3 className="font-bold text-white text-base mb-1">Upload Your Resume</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload your PDF/DOCX resume for instant ATS analysis and key skill extraction.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center mb-4 text-base border border-blue-500/30">
                2
              </div>
              <h3 className="font-bold text-white text-base mb-1">Set Preferences</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose your LPA target salary, notice period, and preferred Indian metro cities.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center mb-4 text-base border border-blue-500/30">
                3
              </div>
              <h3 className="font-bold text-white text-base mb-1">Discover AI Jobs</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Get weighted match scores comparing your experience against active tech roles.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center mb-4 text-base border border-blue-500/30">
                4
              </div>
              <h3 className="font-bold text-white text-base mb-1">Track Applications</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Manage your job pipeline from saved to screening, interview rounds, and offers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Cards */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl font-extrabold text-white">Engineered for Your Career Growth</h2>
          <p className="text-sm text-slate-400 mt-2">
            All the tools you need to navigate the modern job market with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-lg">AI Job Matching</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates match scores based on skills (40%), experience (20%), location (15%), salary (10%), and work preferences.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-lg">Resume Analyzer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scans your resume for ATS compatibility, highlights missing high-demand skills, and generates personalized learning paths.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-lg">Company Research</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore company tech stacks, work culture, salary benchmarks, and AI-generated "Should I Apply?" assessments.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Kanban className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-lg">Application Tracker</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Organize job opportunities with a Kanban board across Saved, Applied, Screening, Interview, Offer, and Rejected.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-sky-600/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-lg">AI Career Assistant</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ask career questions, receive interview preparation plans, salary negotiation guidance, and resume polishing advice.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <IndianRupee className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-lg">Indian Job Market Focus</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full support for LPA salary formats, 15 to 90 day notice period filters, and Indian tech hubs (Bangalore, Pune, Remote).
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-slate-950 border-t border-slate-800 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white text-sm">Byte Builder AI</span>
            <span>— Your AI-powered career companion.</span>
          </div>
          <p>© 2026 Byte Builder AI Project. Built with Next.js, SQLite & AI.</p>
        </div>
      </footer>
    </div>
  );
}
