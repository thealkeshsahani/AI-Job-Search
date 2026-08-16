import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { generateApplicationEmail } from "@/lib/email/generator";
import { getEmailProvider } from "@/lib/email/provider";
import { jobProviderService } from "@/lib/jobs/provider";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeText, userSkills, maxJobs = 4 } = body;

    const userId = "user_default";
    const profile = await prisma.userProfile.findFirst();

    // 1. Determine candidate skills
    const skillsList: string[] = userSkills || (profile?.skills ? JSON.parse(profile.skills) : ["Python", "React", "SQL", "FastAPI"]);

    // 2. Query matching jobs from JobProvider
    const allJobs = await jobProviderService.searchJobs({});
    
    // Sort jobs by skills overlap with candidate
    const matchedJobs = allJobs
      .map((job) => {
        const matching = job.skills.filter((s) =>
          skillsList.some((us) => us.toLowerCase() === s.toLowerCase())
        );
        const score = Math.round((matching.length / Math.max(1, job.skills.length)) * 100 + 30);
        return { job, matching, score };
      })
      .filter((item) => item.matching.length > 0 || item.score >= 50)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxJobs);

    const provider = getEmailProvider();
    const autoMailedResults = [];

    // 3. Auto-generate emails and auto-mail companies
    for (const item of matchedJobs) {
      const { job, matching } = item;
      const recipient = job.recruiterEmail || `careers@${job.companyName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;

      const emailData = await generateApplicationEmail({
        candidateName: profile?.name || "Rahul Sharma",
        candidateEmail: profile?.email || "rahul.sharma@example.com",
        candidatePhone: profile?.phone || "+91 98765 43210",
        resumeText: resumeText || profile?.resumeText || "",
        userSkills: skillsList,
        jobTitle: job.title,
        companyName: job.companyName,
        jobDescription: job.description,
        jobRequirements: job.requirements,
        matchingSkills: matching,
        recruiterEmail: recipient,
        applicationUrl: job.applicationUrl,
      });

      // Dispatch email via provider
      const sendResult = await provider.sendEmail({
        to: recipient,
        subject: emailData.subject,
        body: emailData.body,
        companyName: job.companyName,
        jobTitle: job.title,
        jobId: job.id,
        userId,
      });

      const emailStatus = sendResult.success ? sendResult.status : "FAILED";

      // Create ApplicationEmail record
      const emailRecord = await prisma.applicationEmail.create({
        data: {
          userId,
          jobId: job.id,
          companyName: job.companyName,
          jobTitle: job.title,
          recipient,
          subject: emailData.subject,
          body: emailData.body,
          attachment: emailData.attachment,
          provider: sendResult.provider,
          status: emailStatus,
          sentAt: sendResult.success ? new Date() : null,
        },
      });

      // Create/Update Application record with WAITING_FOR_RESPONSE status
      const existingApp = await prisma.application.findFirst({
        where: { jobId: job.id, companyName: job.companyName },
      });

      let appRecord;
      if (existingApp) {
        appRecord = await prisma.application.update({
          where: { id: existingApp.id },
          data: {
            status: "WAITING_FOR_RESPONSE",
            appliedDate: new Date().toISOString().split("T")[0],
            notes: `Auto-Mailed via AI Email (${recipient}). Status: Waiting for company response.`,
          },
        });
      } else {
        appRecord = await prisma.application.create({
          data: {
            jobId: job.id,
            jobTitle: job.title,
            companyName: job.companyName,
            location: job.location,
            salary: `₹${job.salaryMin}–${job.salaryMax} LPA`,
            status: "WAITING_FOR_RESPONSE",
            appliedDate: new Date().toISOString().split("T")[0],
            notes: `Auto-Mailed via AI Email (${recipient}). Status: Waiting for company response.`,
          },
        });
      }

      autoMailedResults.push({
        jobId: job.id,
        jobTitle: job.title,
        companyName: job.companyName,
        recipient,
        subject: emailData.subject,
        status: "WAITING_FOR_RESPONSE",
        provider: sendResult.provider,
        emailId: emailRecord.id,
        appId: appRecord.id,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully auto-mailed ${autoMailedResults.length} companies based on resume match.`,
      data: autoMailedResults,
    });
  } catch (error: any) {
    console.error("[Auto-Apply API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to complete automated application process." },
      { status: 500 }
    );
  }
}
