export interface MatchResult {
  matchScore: number; // 0 - 100
  skillsMatchScore: number; // 0 - 100
  experienceMatchScore: number; // 0 - 100
  locationMatchScore: number; // 0 - 100
  salaryMatchScore: number; // 0 - 100
  matchingSkills: string[];
  missingSkills: string[];
  recommendation: string;
  verdict: "Strong Match" | "Moderate Match" | "Potential Fit" | "Skill Gap";
}

export interface UserMatchProfile {
  skills: string[];
  experienceYears: number;
  expectedSalaryMin: number;
  expectedSalaryMax: number;
  preferredLocations: string[];
  workMode: string;
}

export interface JobMatchRequirements {
  skills: string[];
  experienceMin: number;
  experienceMax: number;
  salaryMin: number;
  salaryMax: number;
  location: string;
  workMode: string;
  title: string;
  companyName: string;
}

import { normalizeSkills } from "@/lib/jobs/normalizeJob";

export function calculateJobMatch(
  user: UserMatchProfile,
  job: JobMatchRequirements
): MatchResult {
  const normUserSkills = normalizeSkills(user?.skills);
  const normJobSkills = normalizeSkills(job?.skills);

  // Normalize skills arrays to lowercase for matching
  const userSkillsLower = normUserSkills.map((s) => s.toLowerCase().trim());
  const jobSkillsLower = normJobSkills.map((s) => s.toLowerCase().trim());

  const matchingSkills: string[] = [];
  const missingSkills: string[] = [];

  normJobSkills.forEach((skill) => {
    const sLower = skill.toLowerCase().trim();
    const found = userSkillsLower.some(
      (uSkill) => uSkill === sLower || uSkill.includes(sLower) || sLower.includes(uSkill)
    );
    if (found) {
      matchingSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  // 1. Skills Score (Weight: 40%)
  const totalJobSkills = normJobSkills.length || 1;
  const skillsMatchScore = Math.min(
    100,
    Math.round((matchingSkills.length / totalJobSkills) * 100)
  );

  // 2. Experience Score (Weight: 20%)
  let experienceMatchScore = 100;
  if (user.experienceYears < job.experienceMin) {
    const diff = job.experienceMin - user.experienceYears;
    experienceMatchScore = Math.max(40, 100 - diff * 20);
  } else if (user.experienceYears > job.experienceMax + 3) {
    experienceMatchScore = 85; // slightly overqualified
  }

  // 3. Location Score (Weight: 15%)
  let locationMatchScore = 70;
  const prefLocs = (user.preferredLocations || []).map((l) => l.toLowerCase().trim());
  const jobLoc = (job.location || "").toLowerCase().trim();

  if (
    job.workMode.toLowerCase() === "remote" ||
    prefLocs.some((loc) => jobLoc.includes(loc) || loc.includes(jobLoc))
  ) {
    locationMatchScore = 100;
  } else if (prefLocs.includes("remote")) {
    locationMatchScore = 85;
  }

  // 4. Salary Score (Weight: 10%)
  let salaryMatchScore = 85;
  if (job.salaryMax >= user.expectedSalaryMin) {
    salaryMatchScore = 100;
  } else {
    const gap = user.expectedSalaryMin - job.salaryMax;
    salaryMatchScore = Math.max(50, 100 - gap * 10);
  }

  // 5. Work Mode Score (Weight: 5%)
  let workModeScore = 80;
  if (
    user.workMode.toLowerCase() === job.workMode.toLowerCase() ||
    job.workMode.toLowerCase() === "remote"
  ) {
    workModeScore = 100;
  }

  // Calculate Weighted Match Score
  const rawScore =
    skillsMatchScore * 0.40 +
    experienceMatchScore * 0.20 +
    locationMatchScore * 0.15 +
    salaryMatchScore * 0.10 +
    workModeScore * 0.05 +
    85 * 0.10; // general alignment constant

  const matchScore = Math.min(98, Math.max(45, Math.round(rawScore)));

  let verdict: MatchResult["verdict"] = "Moderate Match";
  if (matchScore >= 85) verdict = "Strong Match";
  else if (matchScore >= 70) verdict = "Moderate Match";
  else if (matchScore >= 55) verdict = "Potential Fit";
  else verdict = "Skill Gap";

  // Generate AI Rationale
  let recommendation = "";
  if (verdict === "Strong Match") {
    recommendation = `Your background is a high-alignment match (${matchScore}%) for ${job.title} at ${job.companyName}. Your expertise in ${matchingSkills.slice(0, 3).join(", ")} aligns directly with core role requirements.`;
    if (missingSkills.length > 0) {
      recommendation += ` Upskilling in ${missingSkills.slice(0, 2).join(" & ")} will boost your interview readiness even higher.`;
    }
  } else if (verdict === "Moderate Match") {
    recommendation = `Your profile shows good potential (${matchScore}% match) for ${job.title}. You have key matching skills (${matchingSkills.join(", ") || "core fundamentals"}), but adding ${missingSkills.slice(0, 2).join(", ")} to your resume will significantly increase call-back chances.`;
  } else {
    recommendation = `You meet basic criteria for ${job.title} (${matchScore}% match). We recommend focusing on acquiring ${missingSkills.slice(0, 3).join(", ")} before submitting an application.`;
  }

  return {
    matchScore,
    skillsMatchScore,
    experienceMatchScore,
    locationMatchScore,
    salaryMatchScore,
    matchingSkills,
    missingSkills,
    recommendation,
    verdict,
  };
}
