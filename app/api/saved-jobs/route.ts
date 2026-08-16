import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { normalizeJob } from "@/lib/jobs/normalizeJob";

export async function GET() {
  try {
    const saved = await prisma.savedJob.findMany({
      include: { job: true },
      orderBy: { createdAt: "desc" },
    });

    const normalizedSaved = saved.map((item) => ({
      ...item,
      job: item.job ? normalizeJob(item.job) : null,
    }));

    return NextResponse.json({ success: true, data: normalizedSaved });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to load saved jobs." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId } = body;

    if (!jobId) {
      return NextResponse.json({ success: false, error: "Job ID is required" }, { status: 400 });
    }

    const existing = await prisma.savedJob.findFirst({ where: { jobId } });

    if (existing) {
      await prisma.savedJob.delete({ where: { id: existing.id } });
      return NextResponse.json({ success: true, isSaved: false, message: "Job unsaved" });
    } else {
      const saved = await prisma.savedJob.create({ data: { jobId } });
      return NextResponse.json({ success: true, isSaved: true, data: saved });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to toggle saved job status." },
      { status: 500 }
    );
  }
}
