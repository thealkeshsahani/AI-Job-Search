import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { DEMO_JOBS } from "../data/demo-jobs";
import { DEMO_COMPANIES } from "../data/demo-companies";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seeding for CareerPilot AI...");

  // 1. Seed User Profile
  await prisma.userProfile.upsert({
    where: { id: "user_default" },
    update: {},
    create: {
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
      resumeText: `Rahul Sharma
Software Engineer | Full Stack & AI Enthusiast
Email: rahul.sharma@example.com | Phone: +91 98765 43210 | Location: Bangalore, India

PROFESSIONAL SUMMARY
Experienced Software Engineer with 3 years of experience building scalable backend microservices and modern web interfaces using Python (FastAPI/Django), React, and PostgreSQL. Passionate about AI integrations and cloud optimization.

SKILLS
- Languages & Frameworks: Python, JavaScript, TypeScript, React, Next.js, FastAPI, Django, Node.js, SQL
- Databases & Tools: PostgreSQL, MySQL, Redis, Git, Docker, REST APIs, Tailwind CSS
- Cloud & Concepts: AWS (EC2, S3), Microservices, CI/CD, Agile/Scrum

EXPERIENCE
Software Engineer | CloudTech Solutions, Bangalore (2022 - Present)
- Developed high-throughput REST APIs using Python FastAPI handling 10,000+ daily requests.
- Built interactive React dashboard for cloud resource analytics, improving team productivity by 25%.
- Optimized database queries using PostgreSQL index tuning, reducing API latency by 40%.

Associate Software Developer | DataEdge Systems (2021 - 2022)
- Implemented Python web scrapers and data ingestion pipelines for market intelligence dashboard.
- Maintained SQL database schemas and written unit test suites with PyTest (85% coverage).

EDUCATION
B.Tech in Computer Science & Engineering
Visvesvaraya Technological University (VTU), Bangalore (2017 - 2021) - 8.2 CGPA

PROJECTS
CareerPilot AI Companion (2024): Built an AI career management platform with resume parsing, ATS scoring, and job matching using Next.js and Python.`,
      resumeScore: 82,
      atsScore: 85,
      skillsScore: 90,
      experienceScore: 78,
      keywordsScore: 82,
      formattingScore: 88,
      careerGoal: "Senior Full Stack / AI Engineer in a high-growth tech startup or MNC.",
    },
  });

  // 2. Seed Companies
  console.log("🏢 Seeding companies...");
  for (const comp of DEMO_COMPANIES) {
    await prisma.company.upsert({
      where: { name: comp.name },
      update: {
        logo: comp.logo,
        industry: comp.industry,
        location: comp.location,
        website: comp.website,
        size: comp.size,
        overview: comp.overview,
        techStack: JSON.stringify(comp.techStack),
        culture: comp.culture,
        rating: comp.rating,
        openJobsCount: comp.openJobsCount,
        shouldApplySummary: comp.shouldApplySummary,
      },
      create: {
        id: comp.id,
        name: comp.name,
        logo: comp.logo,
        industry: comp.industry,
        location: comp.location,
        website: comp.website,
        size: comp.size,
        overview: comp.overview,
        techStack: JSON.stringify(comp.techStack),
        culture: comp.culture,
        rating: comp.rating,
        openJobsCount: comp.openJobsCount,
        shouldApplySummary: comp.shouldApplySummary,
      },
    });
  }

  // 3. Seed Jobs
  console.log("💼 Seeding jobs...");
  for (const j of DEMO_JOBS) {
    await prisma.job.upsert({
      where: { id: j.id },
      update: {},
      create: {
        id: j.id,
        title: j.title,
        companyName: j.companyName,
        companyLogo: j.companyLogo,
        location: j.location,
        salaryMin: j.salaryMin,
        salaryMax: j.salaryMax,
        experienceMin: j.experienceMin,
        experienceMax: j.experienceMax,
        workMode: j.workMode,
        noticePeriodReq: j.noticePeriodReq,
        employmentType: j.employmentType,
        skills: JSON.stringify(j.skills),
        summary: j.summary,
        description: j.description,
        requirements: JSON.stringify(j.requirements),
        benefits: JSON.stringify(j.benefits),
        postedDate: j.postedDate,
        companyId: j.companyId,
      },
    });
  }

  // 4. Seed Applications
  console.log("📝 Seeding sample applications...");
  const sampleApplications = [
    {
      id: "app-1",
      jobId: "job-1",
      jobTitle: "Python Developer",
      companyName: "TechNova Solutions",
      location: "Bangalore",
      salary: "₹6–10 LPA",
      status: "INTERVIEW",
      appliedDate: "2026-08-01",
      nextFollowUp: "2026-08-15 (Tech Round 2)",
      notes: "First round completed successfully. Interviewer liked FastAPI & SQL project experience.",
    },
    {
      id: "app-2",
      jobId: "job-2",
      jobTitle: "Senior Full Stack AI Engineer",
      companyName: "Razorpay",
      location: "Bangalore",
      salary: "₹22–35 LPA",
      status: "APPLIED",
      appliedDate: "2026-08-08",
      nextFollowUp: "2026-08-16",
      notes: "Submitted tailored resume emphasizing Next.js and OpenAI API projects.",
    },
    {
      id: "app-3",
      jobId: "job-3",
      jobTitle: "Frontend Developer (React / Next.js)",
      companyName: "Swiggy",
      location: "Remote",
      salary: "₹12–18 LPA",
      status: "SCREENING",
      appliedDate: "2026-08-05",
      nextFollowUp: "2026-08-14",
      notes: "HR screen scheduled via Google Meet.",
    },
    {
      id: "app-4",
      jobId: "job-7",
      jobTitle: "Machine Learning Engineer",
      companyName: "Google India",
      location: "Bangalore",
      salary: "₹28–45 LPA",
      status: "SAVED",
      appliedDate: "2026-08-10",
      nextFollowUp: null,
      notes: "Saved job. Planning to update resume with PyTorch project before applying.",
    },
    {
      id: "app-5",
      jobId: "job-5",
      jobTitle: "Backend Java / Spring Boot Developer",
      companyName: "TCS (Tata Consultancy Services)",
      location: "Pune",
      salary: "₹5.5–9.5 LPA",
      status: "REJECTED",
      appliedDate: "2026-07-20",
      nextFollowUp: null,
      notes: "Required 60 days notice period, but indicated 30 days availability.",
    },
    {
      id: "app-6",
      jobId: "job-16",
      jobTitle: "Full Stack Engineer (MERN)",
      companyName: "TechNova Solutions",
      location: "Chennai",
      salary: "₹7.5–12.5 LPA",
      status: "OFFER",
      appliedDate: "2026-07-15",
      nextFollowUp: "2026-08-20 (Offer Acceptance Deadline)",
      notes: "Received offer letter for ₹11 LPA. Evaluating against Bangalore remote opportunities.",
    },
  ];

  for (const app of sampleApplications) {
    await prisma.application.upsert({
      where: { id: app.id },
      update: {},
      create: {
        id: app.id,
        jobId: app.jobId,
        jobTitle: app.jobTitle,
        companyName: app.companyName,
        location: app.location,
        salary: app.salary,
        status: app.status,
        appliedDate: app.appliedDate,
        nextFollowUp: app.nextFollowUp,
        notes: app.notes,
      },
    });
  }

  // 5. Seed Saved Jobs
  console.log("⭐ Seeding saved jobs...");
  const savedJobIds = ["job-1", "job-2", "job-3", "job-7", "job-11"];
  for (const jId of savedJobIds) {
    await prisma.savedJob.upsert({
      where: { id: `saved-${jId}` },
      update: {},
      create: {
        id: `saved-${jId}`,
        jobId: jId,
      },
    });
  }

  console.log("✅ Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
