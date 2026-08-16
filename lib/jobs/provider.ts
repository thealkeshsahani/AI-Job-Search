import { DEMO_JOBS, DemoJob } from "@/data/demo-jobs";
import { prisma } from "@/lib/db/prisma";
import { normalizeJob } from "@/lib/jobs/normalizeJob";

export interface JobFilterOptions {
  query?: string;
  location?: string;
  salaryMin?: number; // in LPA
  salaryMax?: number; // in LPA
  experience?: number;
  workMode?: string; // Remote, Hybrid, On-site
  noticePeriod?: string; // Immediate, 15 Days, 30 Days, etc.
  employmentType?: string;
  companyName?: string;
  sortBy?: "match" | "date" | "salary";
}

export interface JobProvider {
  name: string;
  searchJobs(filters: JobFilterOptions): Promise<DemoJob[]>;
  getJobById(id: string): Promise<DemoJob | null>;
}

export class DemoJobProvider implements JobProvider {
  name = "DemoJobProvider";

  async searchJobs(filters: JobFilterOptions): Promise<DemoJob[]> {
    let jobs = DEMO_JOBS.map(normalizeJob);

    if (filters.query) {
      const q = filters.query.toLowerCase().trim();
      jobs = jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.companyName.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q)) ||
          j.summary.toLowerCase().includes(q)
      );
    }

    if (filters.location && filters.location !== "All Locations") {
      const loc = filters.location.toLowerCase().trim();
      jobs = jobs.filter((j) => j.location.toLowerCase().includes(loc));
    }

    if (filters.workMode && filters.workMode !== "All Modes") {
      jobs = jobs.filter(
        (j) => j.workMode.toLowerCase() === filters.workMode!.toLowerCase()
      );
    }

    if (filters.noticePeriod && filters.noticePeriod !== "Any Notice") {
      jobs = jobs.filter(
        (j) =>
          j.noticePeriodReq.toLowerCase() === "any" ||
          j.noticePeriodReq.toLowerCase() === filters.noticePeriod!.toLowerCase()
      );
    }

    if (filters.salaryMin && filters.salaryMin > 0) {
      jobs = jobs.filter((j) => j.salaryMax >= filters.salaryMin!);
    }

    if (filters.salaryMax && filters.salaryMax > 0) {
      jobs = jobs.filter((j) => j.salaryMin <= filters.salaryMax!);
    }

    if (filters.experience !== undefined && filters.experience >= 0) {
      jobs = jobs.filter(
        (j) =>
          filters.experience! >= j.experienceMin &&
          filters.experience! <= j.experienceMax + 2
      );
    }

    if (filters.sortBy === "salary") {
      jobs.sort((a, b) => b.salaryMax - a.salaryMax);
    }

    return jobs;
  }

  async getJobById(id: string): Promise<DemoJob | null> {
    const job = DEMO_JOBS.find((j) => j.id === id);
    return job || null;
  }
}

export class DatabaseJobProvider implements JobProvider {
  name = "DatabaseJobProvider";

  async searchJobs(filters: JobFilterOptions): Promise<DemoJob[]> {
    try {
      const dbJobs = await prisma.job.findMany({
        orderBy: { createdAt: "desc" },
      });

      let jobs: DemoJob[] = dbJobs.map(normalizeJob);

      if (filters.query) {
        const q = filters.query.toLowerCase().trim();
        jobs = jobs.filter(
          (j) =>
            j.title.toLowerCase().includes(q) ||
            j.companyName.toLowerCase().includes(q) ||
            j.skills.some((s) => s.toLowerCase().includes(q))
        );
      }

      if (filters.location && filters.location !== "All Locations") {
        const loc = filters.location.toLowerCase().trim();
        jobs = jobs.filter((j) => j.location.toLowerCase().includes(loc));
      }

      if (filters.workMode && filters.workMode !== "All Modes") {
        jobs = jobs.filter(
          (j) => j.workMode.toLowerCase() === filters.workMode!.toLowerCase()
        );
      }

      if (filters.noticePeriod && filters.noticePeriod !== "Any Notice") {
        jobs = jobs.filter(
          (j) =>
            j.noticePeriodReq.toLowerCase() === "any" ||
            j.noticePeriodReq.toLowerCase() === filters.noticePeriod!.toLowerCase()
        );
      }

      if (filters.salaryMin && filters.salaryMin > 0) {
        jobs = jobs.filter((j) => j.salaryMax >= filters.salaryMin!);
      }

      if (filters.sortBy === "salary") {
        jobs.sort((a, b) => b.salaryMax - a.salaryMax);
      }

      return jobs;
    } catch (err) {
      console.warn("DB query failed, falling back to DemoJobProvider:", err);
      return new DemoJobProvider().searchJobs(filters);
    }
  }

  async getJobById(id: string): Promise<DemoJob | null> {
    try {
      const j = await prisma.job.findUnique({ where: { id } });
      if (!j) return new DemoJobProvider().getJobById(id);

      return normalizeJob(j);
    } catch {
      return new DemoJobProvider().getJobById(id);
    }
  }
}

// Default export active provider instance
export const jobProviderService: JobProvider = new DatabaseJobProvider();
