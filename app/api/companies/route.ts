import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { DEMO_COMPANIES } from "@/data/demo-companies";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    let dbCompanies = await prisma.company.findMany({
      orderBy: { rating: "desc" },
    });

    let companies = dbCompanies.map((c) => ({
      id: c.id,
      name: c.name,
      logo: c.logo,
      industry: c.industry,
      location: c.location,
      website: c.website,
      size: c.size,
      overview: c.overview,
      techStack: JSON.parse(c.techStack || "[]"),
      culture: c.culture,
      rating: c.rating,
      openJobsCount: c.openJobsCount,
      shouldApplySummary: c.shouldApplySummary,
    }));

    if (companies.length === 0) {
      companies = DEMO_COMPANIES;
    }

    if (query) {
      const q = query.toLowerCase().trim();
      companies = companies.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.industry.toLowerCase().includes(q) ||
          c.techStack.some((t: string) => t.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({ success: true, count: companies.length, data: companies });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to load companies." },
      { status: 500 }
    );
  }
}
