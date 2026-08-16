import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { generateApplicationEmail } from "@/lib/email/generator";
import { jobProviderService } from "@/lib/jobs/provider";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId, jobTitle, companyName, jobDescription, recruiterEmail, applicationUrl } = body;

    // Fetch user profile from database
    const profile = await prisma.userProfile.findFirst();

    let jobDetails = null;
    if (jobId) {
      jobDetails = await jobProviderService.getJobById(jobId);
    }

    const userSkills = profile?.skills ? JSON.parse(profile.skills) : ["Python", "React", "Node.js", "SQL"];

    const generated = await generateApplicationEmail({
      candidateName: profile?.name || "Rahul Sharma",
      candidateEmail: profile?.email || "rahul.sharma@example.com",
      candidatePhone: profile?.phone || "+91 98765 43210",
      resumeText: profile?.resumeText || "",
      userSkills,
      jobTitle: jobTitle || jobDetails?.title || "Software Engineer",
      companyName: companyName || jobDetails?.companyName || "Tech Company",
      jobDescription: jobDescription || jobDetails?.description || "",
      jobRequirements: jobDetails?.requirements || [],
      matchingSkills: jobDetails?.skills ? jobDetails.skills.filter((s: string) => userSkills.includes(s)) : userSkills.slice(0, 3),
      recruiterEmail: recruiterEmail || jobDetails?.recruiterEmail,
      applicationUrl: applicationUrl || jobDetails?.applicationUrl,
    });

    return NextResponse.json({
      success: true,
      data: generated,
    });
  } catch (error: any) {
    console.error("[Generate Email API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate application email." },
      { status: 500 }
    );
  }
}
