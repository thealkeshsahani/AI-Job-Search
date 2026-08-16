import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: applications });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to load applications." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId, jobTitle, companyName, location, salary, status, appliedDate, notes, nextFollowUp } = body;

    if (!jobTitle || !companyName) {
      return NextResponse.json({ success: false, error: "Job title and company name are required" }, { status: 400 });
    }

    const application = await prisma.application.create({
      data: {
        jobId: jobId || null,
        jobTitle,
        companyName,
        location: location || "Bangalore",
        salary: salary || "₹6–10 LPA",
        status: status || "SAVED",
        appliedDate: appliedDate || new Date().toISOString().split("T")[0],
        nextFollowUp: nextFollowUp || null,
        notes: notes || "",
      },
    });

    return NextResponse.json({ success: true, data: application });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create application." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, notes, nextFollowUp } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Application ID is required" }, { status: 400 });
    }

    const updated = await prisma.application.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes } : {}),
        ...(nextFollowUp !== undefined ? { nextFollowUp } : {}),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update application." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Application ID is required" }, { status: 400 });
    }

    await prisma.application.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Application deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete application." },
      { status: 500 }
    );
  }
}
