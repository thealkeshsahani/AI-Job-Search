import { NextRequest, NextResponse } from "next/server";
import { jobProviderService, JobFilterOptions } from "@/lib/jobs/provider";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const filters: JobFilterOptions = {
      query: searchParams.get("query") || undefined,
      location: searchParams.get("location") || undefined,
      workMode: searchParams.get("workMode") || undefined,
      noticePeriod: searchParams.get("noticePeriod") || undefined,
      salaryMin: searchParams.get("salaryMin") ? parseFloat(searchParams.get("salaryMin")!) : undefined,
      salaryMax: searchParams.get("salaryMax") ? parseFloat(searchParams.get("salaryMax")!) : undefined,
      experience: searchParams.get("experience") ? parseInt(searchParams.get("experience")!) : undefined,
      sortBy: (searchParams.get("sortBy") as any) || "match",
    };

    const jobs = await jobProviderService.searchJobs(filters);
    return NextResponse.json({ success: true, count: jobs.length, data: jobs });
  } catch (error: any) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load jobs. Please try again." },
      { status: 500 }
    );
  }
}
