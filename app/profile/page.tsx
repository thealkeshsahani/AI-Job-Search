"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  IndianRupee,
  Clock,
  Sparkles,
  Save,
  Check,
  GraduationCap,
  Target,
  FileText
} from "lucide-react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [name, setName] = useState("Rahul Sharma");
  const [email, setEmail] = useState("rahul.sharma@example.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [currentRole, setCurrentRole] = useState("Software Engineer");
  const [experienceYears, setExperienceYears] = useState(3);
  const [expectedSalaryMin, setExpectedSalaryMin] = useState(8.0);
  const [expectedSalaryMax, setExpectedSalaryMax] = useState(15.0);
  const [noticePeriod, setNoticePeriod] = useState("30 Days");
  const [preferredLocations, setPreferredLocations] = useState("Bangalore, Remote, Hyderabad");
  const [workMode, setWorkMode] = useState("Hybrid");
  const [skillsText, setSkillsText] = useState("Python, React, Node.js, SQL, FastAPI, Git, Docker");
  const [education, setEducation] = useState("B.Tech in Computer Science, VTU Bangalore (2021)");
  const [careerGoal, setCareerGoal] = useState("Senior Full Stack / AI Engineer in a high-growth tech startup or MNC.");

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          setName(d.name || "Rahul Sharma");
          setEmail(d.email || "rahul.sharma@example.com");
          setPhone(d.phone || "+91 98765 43210");
          setCurrentRole(d.currentRole || "Software Engineer");
          setExperienceYears(d.experienceYears || 3);
          setExpectedSalaryMin(d.expectedSalaryMin || 8.0);
          setExpectedSalaryMax(d.expectedSalaryMax || 15.0);
          setNoticePeriod(d.noticePeriod || "30 Days");
          setPreferredLocations(d.preferredLocations || "Bangalore, Remote");
          setWorkMode(d.workMode || "Hybrid");
          setSkillsText(Array.isArray(d.skills) ? d.skills.join(", ") : "Python, React, SQL");
          setEducation(d.education || "B.Tech in Computer Science");
          setCareerGoal(d.careerGoal || "Senior Engineer");
        }
      } catch (e) {
        console.error("Error loading profile:", e);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const skillsArray = skillsText.split(",").map((s) => s.trim()).filter(Boolean);
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          currentRole,
          experienceYears,
          expectedSalaryMin,
          expectedSalaryMax,
          noticePeriod,
          preferredLocations,
          workMode,
          skills: skillsArray,
          education,
          careerGoal,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (e) {
      console.error("Error updating profile:", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <User className="w-6 h-6 text-blue-400" />
                My Career Profile & Preferences
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Customize your Indian market preferences (LPA targets, Notice period, City hubs).
              </p>
            </div>

            {savedSuccess && (
              <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Profile Saved</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6">
            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="font-bold text-white text-base border-b border-slate-800 pb-2">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Professional Background */}
            <div className="space-y-4">
              <h3 className="font-bold text-white text-base border-b border-slate-800 pb-2">
                Professional Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Current Job Title</label>
                  <input
                    type="text"
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Years of Experience</label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block text-slate-300 font-semibold mb-1">Technical Skills (Comma Separated)</label>
                <input
                  type="text"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="text-xs">
                <label className="block text-slate-300 font-semibold mb-1">Education Background</label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Indian Job Market Specific Preferences */}
            <div className="space-y-4">
              <h3 className="font-bold text-white text-base border-b border-slate-800 pb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                Indian Job Market Preferences
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Expected Salary Range (LPA)</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      step="0.5"
                      value={expectedSalaryMin}
                      onChange={(e) => setExpectedSalaryMin(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                      placeholder="Min LPA"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      step="0.5"
                      value={expectedSalaryMax}
                      onChange={(e) => setExpectedSalaryMax(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                      placeholder="Max LPA"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Notice Period Availability</label>
                  <select
                    value={noticePeriod}
                    onChange={(e) => setNoticePeriod(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Immediate">Immediate Joiner</option>
                    <option value="15 Days">15 Days</option>
                    <option value="30 Days">30 Days</option>
                    <option value="60 Days">60 Days</option>
                    <option value="90 Days">90 Days</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Preferred Work Mode</label>
                  <select
                    value={workMode}
                    onChange={(e) => setWorkMode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Remote">Remote Only</option>
                    <option value="Hybrid">Hybrid (2-3 Days Office)</option>
                    <option value="On-site">On-site Office</option>
                  </select>
                </div>
              </div>

              <div className="text-xs">
                <label className="block text-slate-300 font-semibold mb-1">Preferred Cities (Comma Separated)</label>
                <input
                  type="text"
                  value={preferredLocations}
                  onChange={(e) => setPreferredLocations(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="text-xs">
                <label className="block text-slate-300 font-semibold mb-1">Career Goal Statement</label>
                <textarea
                  rows={2}
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving Changes..." : "Save Career Profile"}</span>
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
