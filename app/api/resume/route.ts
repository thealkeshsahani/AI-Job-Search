import { NextRequest, NextResponse } from "next/server";
import { analyzeResumeText } from "@/lib/resume/analyzer";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, filename } = body;

    const resumeContent = text || `Rahul Sharma
Software Engineer with 3 years experience in Python, React, Next.js, and SQL. Built high performance microservices and scalable REST APIs.
Skills: Python, Django, FastAPI, React, SQL, PostgreSQL, Git, Docker, REST API.
Education: B.Tech in Computer Science & Engineering.`;

    const analysis = analyzeResumeText(resumeContent);

    // Save/Update user profile in DB with updated ATS score & extracted skills
    try {
      await prisma.userProfile.upsert({
        where: { id: "user_default" },
        update: {
          resumeText: resumeContent,
          resumeScore: analysis.scores.overallScore,
          atsScore: analysis.scores.atsCompatibility,
          skillsScore: analysis.scores.skillsRelevance,
          experienceScore: analysis.scores.experienceImpact,
          keywordsScore: analysis.scores.keywords,
          formattingScore: analysis.scores.formatting,
          skills: JSON.stringify(analysis.overview.skills),
        },
        create: {
          id: "user_default",
          resumeText: resumeContent,
          resumeScore: analysis.scores.overallScore,
          atsScore: analysis.scores.atsCompatibility,
          skillsScore: analysis.scores.skillsRelevance,
          experienceScore: analysis.scores.experienceImpact,
          keywordsScore: analysis.scores.keywords,
          formattingScore: analysis.scores.formatting,
          skills: JSON.stringify(analysis.overview.skills),
        },
      });
    } catch (e) {
      console.warn("Could not sync resume score with DB:", e);
    }

    return NextResponse.json({
      success: true,
      filename: filename || "resume.pdf",
      data: analysis,
    });
  } catch (error: any) {
    console.error("Resume analysis error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to analyze resume." },
      { status: 500 }
    );
  }
}
