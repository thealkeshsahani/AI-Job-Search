import { DemoJob } from "@/data/demo-jobs";

/**
 * Robust skill normalizer that handles:
 * - string[] (e.g. ["Python", "React"])
 * - CSV string (e.g. "Python, React, SQL")
 * - JSON string (e.g. "[\"Python\", \"React\"]")
 * - null / undefined
 * - Objects containing skills array/string (e.g. { skills: [...] })
 */
export function normalizeSkills(skills: unknown): string[] {
  if (!skills) return [];

  // Case 1: Already an Array
  if (Array.isArray(skills)) {
    return skills
      .map((item) => {
        if (typeof item === "string") return item.trim();
        if (typeof item === "number" || typeof item === "boolean") return String(item);
        if (typeof item === "object" && item !== null) {
          return (item as any).name || (item as any).skill || (item as any).label || "";
        }
        return "";
      })
      .filter((s) => typeof s === "string" && s.trim().length > 0);
  }

  // Case 2: String representation
  if (typeof skills === "string") {
    const trimmed = skills.trim();
    if (!trimmed) return [];

    // Try parsing as JSON array
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        return normalizeSkills(parsed);
      } catch {
        // Fall back to comma splitting if JSON parse fails
      }
    }

    // Split by comma or semicolon
    return trimmed
      .split(/[,;]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  // Case 3: Object data
  if (typeof skills === "object" && skills !== null) {
    const obj = skills as Record<string, any>;
    if (obj.skills) return normalizeSkills(obj.skills);
    if (obj.required) return normalizeSkills(obj.required);
    if (obj.list) return normalizeSkills(obj.list);
    if (obj.items) return normalizeSkills(obj.items);

    // Fallback: extract string values from object properties
    const extracted = Object.values(obj).filter((v) => typeof v === "string") as string[];
    if (extracted.length > 0) {
      return normalizeSkills(extracted.join(", "));
    }
  }

  return [];
}

/**
 * Normalizes string array fields such as requirements or benefits
 */
export function normalizeStringArray(input: unknown): string[] {
  if (!input) return [];

  if (Array.isArray(input)) {
    return input.map((item) => (typeof item === "string" ? item.trim() : String(item))).filter(Boolean);
  }

  if (typeof input === "string") {
    const trimmed = input.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        return normalizeStringArray(parsed);
      } catch {
        // fallback
      }
    }
    return trimmed.split(/\n|,/).map((s) => s.trim()).filter(Boolean);
  }

  return [];
}

/**
 * Fully normalizes any raw Job object (from DB, API, or external source)
 * into a safe, type-conforming DemoJob instance.
 */
export function normalizeJob(rawJob: any): DemoJob {
  if (!rawJob || typeof rawJob !== "object") {
    return {
      id: "unknown-job",
      title: "Software Position",
      companyName: "Tech Company",
      companyLogo: "/logos/default.svg",
      location: "Bangalore",
      salaryMin: 6.0,
      salaryMax: 10.0,
      experienceMin: 1,
      experienceMax: 3,
      workMode: "Hybrid",
      noticePeriodReq: "30 Days",
      employmentType: "Full-time",
      skills: [],
      summary: "No job summary available.",
      description: "No description available.",
      requirements: [],
      benefits: [],
      postedDate: "Recently",
    };
  }

  const skills = normalizeSkills(rawJob.skills);
  const requirements = normalizeStringArray(rawJob.requirements);
  const benefits = normalizeStringArray(rawJob.benefits);

  return {
    id: String(rawJob.id || "job-default"),
    title: String(rawJob.title || "Software Developer"),
    companyName: String(rawJob.companyName || "Tech Company"),
    companyLogo: String(rawJob.companyLogo || "/logos/default.svg"),
    location: String(rawJob.location || "Bangalore"),
    salaryMin: typeof rawJob.salaryMin === "number" ? rawJob.salaryMin : parseFloat(rawJob.salaryMin) || 6.0,
    salaryMax: typeof rawJob.salaryMax === "number" ? rawJob.salaryMax : parseFloat(rawJob.salaryMax) || 12.0,
    experienceMin: typeof rawJob.experienceMin === "number" ? rawJob.experienceMin : parseInt(rawJob.experienceMin, 10) || 1,
    experienceMax: typeof rawJob.experienceMax === "number" ? rawJob.experienceMax : parseInt(rawJob.experienceMax, 10) || 3,
    workMode: rawJob.workMode || "Hybrid",
    noticePeriodReq: rawJob.noticePeriodReq || "30 Days",
    employmentType: rawJob.employmentType || "Full-time",
    skills,
    summary: String(rawJob.summary || rawJob.description || "Active opportunity"),
    description: String(rawJob.description || rawJob.summary || "Full job details available upon application."),
    requirements,
    benefits,
    postedDate: String(rawJob.postedDate || "Recently"),
    companyId: rawJob.companyId ? String(rawJob.companyId) : undefined,
    recruiterEmail: rawJob.recruiterEmail ? String(rawJob.recruiterEmail) : undefined,
    applicationUrl: rawJob.applicationUrl ? String(rawJob.applicationUrl) : undefined,
  };
}
