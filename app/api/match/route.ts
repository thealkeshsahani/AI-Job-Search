import { NextRequest, NextResponse } from "next/server";
import { calculateJobMatch, UserMatchProfile, JobMatchRequirements } from "@/lib/matching/matcher";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId, customJob } = body;

    // Fetch user profile from DB or default
    let userProfile = await prisma.userProfile.findUnique({ where: { id: "user_default" } });

    const userMatch: UserMatchProfile = {
      skills: userProfile ? JSON.parse(userProfile.skills || "[]") : ["Python", "React", "SQL"],
      experienceYears: userProfile ? userProfile.experienceYears : 3,
      expectedSalaryMin: userProfile ? userProfile.expectedSalaryMin : 8.0,
      expectedSalaryMax: userProfile ? userProfile.expectedSalaryMax : 15.0,
      preferredLocations: userProfile ? (userProfile.preferredLocations || "").split(",").map(s => s.trim()) : ["Bangalore"],
      workMode: userProfile ? userProfile.workMode : "Hybrid",
    };

    let targetJob: JobMatchRequirements;

    if (jobId) {
      const dbJob = await prisma.job.findUnique({ where: { id: jobId } });
      if (dbJob) {
        targetJob = {
          title: dbJob.title,
          companyName: dbJob.companyName,
          skills: JSON.parse(dbJob.skills || "[]"),
          experienceMin: dbJob.experienceMin,
          experienceMax: dbJob.experienceMax,
          salaryMin: dbJob.salaryMin,
          salaryMax: dbJob.salaryMax,
          location: dbJob.location,
          workMode: dbJob.workMode,
        };
      } else {
        return NextResponse.json({ success: false, error: "Target job not found" }, { status: 404 });
      }
    } else if (customJob) {
      targetJob = customJob;
    } else {
      return NextResponse.json({ success: false, error: "Either jobId or customJob is required" }, { status: 400 });
    }

    const matchResult = calculateJobMatch(userMatch, targetJob);
    return NextResponse.json({ success: true, data: matchResult });
  } catch (error: any) {
    console.error("Match calculation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to calculate job match." },
      { status: 500 }
    );
  }
}
