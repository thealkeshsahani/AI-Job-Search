"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { ResumeAnalysisResult } from "@/lib/resume/analyzer";
import { AutoApplyProgressModal } from "@/components/resume/AutoApplyProgressModal";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Award,
  BookOpen,
  ArrowRight,
  RefreshCw,
  User,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Send
} from "lucide-react";

const SAMPLE_RESUME_TEXT = `Rahul Sharma
Software Engineer | Full Stack & AI Enthusiast
Email: rahul.sharma@example.com | Phone: +91 98765 43210 | Location: Bangalore, India

PROFESSIONAL SUMMARY
Experienced Software Engineer with 3 years of experience building scalable backend microservices and modern web interfaces using Python (FastAPI/Django), React, and PostgreSQL. Passionate about AI integrations and cloud optimization.

SKILLS
- Languages & Frameworks: Python, JavaScript, TypeScript, React, Next.js, FastAPI, Django, Node.js, SQL
- Databases & Tools: PostgreSQL, MySQL, Redis, Git, REST APIs, Tailwind CSS
- Cloud & Concepts: Microservices, CI/CD, Agile/Scrum

EXPERIENCE
Software Engineer | CloudTech Solutions, Bangalore (2022 - Present)
- Developed high-throughput REST APIs using Python FastAPI handling 10,000+ daily requests.
- Built interactive React dashboard for cloud resource analytics, improving team productivity by 25%.
- Optimized database queries using PostgreSQL index tuning, reducing API latency by 40%.

Associate Software Developer | DataEdge Systems (2021 - 2022)
- Implemented Python web scrapers and data ingestion pipelines for market intelligence dashboard.
- Maintained SQL database schemas and written unit test suites with PyTest (85% coverage).

EDUCATION
B.Tech in Computer Science & Engineering
Visvesvaraya Technological University (VTU), Bangalore (2017 - 2021) - 8.2 CGPA`;

export default function ResumeAnalyzerPage() {
  const [resumeText, setResumeText] = useState(SAMPLE_RESUME_TEXT);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysisResult | null>(null);
  const [isAutoApplyOpen, setIsAutoApplyOpen] = useState(false);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-[#Type]": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ text: resumeText, filename: "Rahul_Sharma_Resume.pdf" }),
      });
      const json = await res.json();
      if (json.success) {
        setAnalysis(json.data);
      }
    } catch (e) {
      console.error("Resume analysis error:", e);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Header */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
                <FileText className="w-7 h-7 text-blue-400" />
                AI Resume Analyzer & ATS Score Engine
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Scan your resume against ATS criteria, identify missing market skills, and get personalized up-skilling roadmaps.
              </p>
            </div>

            <button
              onClick={() => {
                setResumeText(SAMPLE_RESUME_TEXT);
                handleAnalyze();
              }}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
              <span>Load Sample Demo Resume</span>
            </button>
          </div>

          {/* Upload & Input Area */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-400" />
              Upload Resume or Paste Resume Text
            </h2>

            <div className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 text-center bg-slate-950/60 transition-colors">
              <div className="w-12 h-12 rounded-full bg-blue-600/10 text-blue-400 flex items-center justify-center mx-auto mb-3 border border-blue-500/20">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-200">
                Drag and drop your PDF or DOCX resume here
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Accepted formats: PDF, DOCX, TXT (Max 5MB)
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">
                Resume Content Text:
              </label>
              <textarea
                rows={6}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                placeholder="Paste your full resume text here..."
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={analyzing || !resumeText.trim()}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing your resume...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Resume & Compute ATS Score</span>
                </>
              )}
            </button>
          </div>

          {/* Analysis Results Display */}
          {analysis && (
            <div className="space-y-8 animate-fadeIn">
              {/* Score Gauge & Section Scores */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Overall Score Gauge Card */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Overall ATS Compatibility
                  </span>
                  <div className="relative w-36 h-36 flex items-center justify-center rounded-full bg-slate-950 border-4 border-blue-500 shadow-xl shadow-blue-500/10">
                    <div className="flex flex-col items-center">
                      <span className="text-4xl font-extrabold text-white">{analysis.scores.overallScore}</span>
                      <span className="text-xs font-semibold text-slate-400">/ 100</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    High Call-Back Rating
                  </span>
                </div>

                {/* Score Breakdown Progress Bars */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                  <h3 className="font-bold text-white text-base">Detailed Section Ratings</h3>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-300">ATS Format Compatibility</span>
                        <span className="text-blue-400">{analysis.scores.atsCompatibility}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${analysis.scores.atsCompatibility}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-300">Skills Relevance</span>
                        <span className="text-emerald-400">{analysis.scores.skillsRelevance}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${analysis.scores.skillsRelevance}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-300">Experience & Impact Metrics</span>
                        <span className="text-indigo-400">{analysis.scores.experienceImpact}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${analysis.scores.experienceImpact}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-300">Keywords & Tech Density</span>
                        <span className="text-amber-400">{analysis.scores.keywords}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${analysis.scores.keywords}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-300">Formatting & Typography</span>
                        <span className="text-sky-400">{analysis.scores.formatting}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-sky-500 rounded-full" style={{ width: `${analysis.scores.formatting}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Strong Areas vs Areas to Improve */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strong Areas */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <h3 className="font-bold text-white text-base">Strong Areas</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {analysis.strongAreas.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                        <span className="text-emerald-400 font-bold shrink-0">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                  <div className="flex items-center space-x-2 text-amber-400">
                    <AlertTriangle className="w-5 h-5" />
                    <h3 className="font-bold text-white text-base">Recommended Improvements</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {analysis.improvements.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                        <span className="text-amber-400 font-bold shrink-0">⚠</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Autonomous AI Auto-Mail Banner */}
              <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-blue-700/80 p-6 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-extrabold uppercase bg-blue-500/30 text-blue-200 border border-blue-400/30 px-3 py-0.5 rounded-full font-mono">
                      Autonomous Job Application
                    </span>
                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold">Auto-Apply & Mail Companies based on Your Resume</h3>
                  <p className="text-xs text-blue-200 leading-relaxed">
                    AI will automatically find matching job listings for your uploaded resume (Python, FastAPI, SQL, React), write personalized application emails, auto-mail company recruiters, and track replies with status **Waiting for Response**.
                  </p>
                </div>

                <button
                  onClick={() => setIsAutoApplyOpen(true)}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center gap-2 shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span>Auto-Apply & Mail Companies Now</span>
                </button>
              </div>

              {/* Skill Gap Analysis & Recommended Learning Path */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="font-bold text-white text-lg flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-400" />
                      Skill Gap Analysis & Learning Path
                    </h3>
                    <p className="text-xs text-slate-400">
                      Top high-demand skills missing from your profile for Indian tech roles.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {analysis.missingSkills.map((sk) => (
                      <span key={sk} className="text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full">
                        Missing: {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {analysis.recommendedLearningPath.map((item) => (
                    <div key={item.step} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2 relative">
                      <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 font-bold text-xs flex items-center justify-center border border-blue-500/30">
                        Step {item.step}
                      </div>
                      <h4 className="font-bold text-white text-sm">{item.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <AutoApplyProgressModal
        isOpen={isAutoApplyOpen}
        onClose={() => setIsAutoApplyOpen(false)}
        resumeText={resumeText}
      />
    </div>
  );
}
