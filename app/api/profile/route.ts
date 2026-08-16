import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    let profile = await prisma.userProfile.findUnique({
      where: { id: "user_default" },
    });

    if (!profile) {
      profile = await prisma.userProfile.create({
        data: {
          id: "user_default",
          name: "Rahul Sharma",
          email: "rahul.sharma@example.com",
          phone: "+91 98765 43210",
          currentRole: "Software Engineer",
          experienceYears: 3,
          expectedSalaryMin: 8.0,
          expectedSalaryMax: 15.0,
          noticePeriod: "30 Days",
          preferredLocations: "Bangalore, Remote, Hyderabad",
          workMode: "Hybrid",
          skills: JSON.stringify(["Python", "React", "Node.js", "SQL", "FastAPI", "Git", "Docker"]),
          education: "B.Tech in Computer Science, VTU Bangalore (2021)",
          careerGoal: "Senior Full Stack / AI Engineer in a high-growth tech startup or MNC.",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...profile,
        skills: JSON.parse(profile.skills || "[]"),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to load user profile." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
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
      skills,
      education,
      careerGoal,
    } = body;

    const updated = await prisma.userProfile.upsert({
      where: { id: "user_default" },
      update: {
        ...(name ? { name } : {}),
        ...(email ? { email } : {}),
        ...(phone ? { phone } : {}),
        ...(currentRole ? { currentRole } : {}),
        ...(experienceYears !== undefined ? { experienceYears: parseInt(experienceYears) } : {}),
        ...(expectedSalaryMin !== undefined ? { expectedSalaryMin: parseFloat(expectedSalaryMin) } : {}),
        ...(expectedSalaryMax !== undefined ? { expectedSalaryMax: parseFloat(expectedSalaryMax) } : {}),
        ...(noticePeriod ? { noticePeriod } : {}),
        ...(preferredLocations ? { preferredLocations } : {}),
        ...(workMode ? { workMode } : {}),
        ...(skills ? { skills: JSON.stringify(skills) } : {}),
        ...(education ? { education } : {}),
        ...(careerGoal ? { careerGoal } : {}),
      },
      create: {
        id: "user_default",
        name: name || "Rahul Sharma",
        email: email || "rahul.sharma@example.com",
        phone: phone || "+91 98765 43210",
        currentRole: currentRole || "Software Engineer",
        experienceYears: experienceYears ? parseInt(experienceYears) : 3,
        expectedSalaryMin: expectedSalaryMin ? parseFloat(expectedSalaryMin) : 8.0,
        expectedSalaryMax: expectedSalaryMax ? parseFloat(expectedSalaryMax) : 15.0,
        noticePeriod: noticePeriod || "30 Days",
        preferredLocations: preferredLocations || "Bangalore, Remote",
        workMode: workMode || "Hybrid",
        skills: JSON.stringify(skills || ["Python", "React"]),
        education: education || "B.Tech in Computer Science",
        careerGoal: careerGoal || "Senior Software Engineer",
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...updated,
        skills: JSON.parse(updated.skills || "[]"),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update profile." },
      { status: 500 }
    );
  }
}
