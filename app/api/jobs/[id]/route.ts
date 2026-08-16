import { NextRequest, NextResponse } from "next/server";
import { jobProviderService } from "@/lib/jobs/provider";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const job = await jobProviderService.getJobById(id);

    if (!job) {
      return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: job });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch job details." },
      { status: 500 }
    );
  }
}
