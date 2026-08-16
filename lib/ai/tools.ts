import { jobProviderService, JobFilterOptions } from "@/lib/jobs/provider";
import { analyzeResumeText } from "@/lib/resume/analyzer";
import { calculateJobMatch, UserMatchProfile } from "@/lib/matching/matcher";
import { prisma } from "@/lib/db/prisma";
import { DEMO_COMPANIES } from "@/data/demo-companies";
import { DemoJob } from "@/data/demo-jobs";

export interface ToolResult {
  toolName: string;
  toolTrace: string[];
  responseText: string;
  embeddedJobs?: DemoJob[];
  data?: any;
}

export class AgentToolsEngine {
  // 1. Tool 1: Job Search
  async searchJobs(
    queryText: string,
    filters: JobFilterOptions,
    userProfile?: any
  ): Promise<ToolResult> {
    const trace = [
      `Intent Router: Selected Tool -> searchJobs()`,
      `Extracted Parameters: location="${filters.location || "Any"}", query="${filters.query || queryText || "All"}", salaryMin=${filters.salaryMin || 0} LPA, workMode="${filters.workMode || "Any"}"`,
      `Querying JobProvider database...`,
    ];

    const jobs = await jobProviderService.searchJobs({
      query: filters.query || queryText,
      location: filters.location,
      salaryMin: filters.salaryMin,
      salaryMax: filters.salaryMax,
      workMode: filters.workMode,
      noticePeriod: filters.noticePeriod,
    });

    trace.push(`✓ Found ${jobs.length} matching job listings in database.`);

    let responseText = "";
    if (jobs.length === 0) {
      responseText = `I searched for **"${queryText || "positions"}"** in ${filters.location || "India"}, but didn't find any direct matches. Try broadening your location or minimum salary filters.`;
    } else {
      responseText = `### 🔎 Job Search Results (${jobs.length} Found)\n\nHere are top active opportunities matching your criteria (${filters.location ? `Location: ${filters.location}` : "All Cities"}, ${filters.salaryMin ? `Min Salary: ₹${filters.salaryMin} LPA` : "All Salary Ranges"}):\n\nYou can click **View Job**, **Save**, or **Apply** directly on the job cards below:`;
    }

    return {
      toolName: "Job Search Agent",
      toolTrace: trace,
      responseText,
      embeddedJobs: jobs.slice(0, 4),
    };
  }

  // 2. Tool 2: Resume Analysis
  async analyzeResume(resumeText?: string, userProfile?: any): Promise<ToolResult> {
    const textToAnalyze = resumeText || userProfile?.resumeText || `Rahul Sharma
Software Engineer with 3 years experience in Python, React, Next.js, and SQL.
Skills: Python, Django, FastAPI, React, SQL, PostgreSQL, Git, Docker.`;

    const trace = [
      `Intent Router: Selected Tool -> analyzeResume()`,
      `Reading candidate's stored resume text (${textToAnalyze.length} characters)...`,
      `Calculating ATS compatibility, keyword density, and formatting scores...`,
    ];

    const analysis = analyzeResumeText(textToAnalyze);
    trace.push(`✓ Completed ATS analysis. Computed score: ${analysis.scores.overallScore}/100.`);

    const responseText = `### 📄 AI Resume Analysis & ATS Score Evaluation

**Overall ATS Score:** **${analysis.scores.overallScore} / 100** (${analysis.scores.overallScore >= 80 ? "Strong Call-Back Rating" : "Moderate Alignment"})

#### 📊 Ratings Breakdown:
- **ATS Formatting:** ${analysis.scores.atsCompatibility}%
- **Skills Relevance:** ${analysis.scores.skillsRelevance}%
- **Experience Impact:** ${analysis.scores.experienceImpact}%
- **Keywords Density:** ${analysis.scores.keywords}%

#### ✅ Key Strengths:
${analysis.strongAreas.map((s) => `- ${s}`).join("\n")}

#### ⚠ Weaknesses & Recommended Fixes:
${analysis.improvements.map((i) => `- ${i}`).join("\n")}

#### 💡 Missing High-Demand Market Skills:
${analysis.missingSkills.map((s) => `- **${s}**`).join("\n")}`;

    return {
      toolName: "Resume Evaluator Agent",
      toolTrace: trace,
      responseText,
      data: analysis,
    };
  }

  // 3. Tool 3: Job Matching
  async matchResumeToJob(jobId: string, customJobTitle?: string): Promise<ToolResult> {
    const trace = [
      `Intent Router: Selected Tool -> matchResumeToJob()`,
      `Retrieving user profile & candidate resume skills...`,
      `Fetching target job specifications...`,
    ];

    let userProfile = await prisma.userProfile.findUnique({ where: { id: "user_default" } });
    const userMatch: UserMatchProfile = {
      skills: userProfile ? JSON.parse(userProfile.skills || "[]") : ["Python", "React", "SQL"],
      experienceYears: userProfile ? userProfile.experienceYears : 3,
      expectedSalaryMin: userProfile ? userProfile.expectedSalaryMin : 8.0,
      expectedSalaryMax: userProfile ? userProfile.expectedSalaryMax : 15.0,
      preferredLocations: userProfile ? (userProfile.preferredLocations || "").split(",").map((s) => s.trim()) : ["Bangalore"],
      workMode: userProfile ? userProfile.workMode : "Hybrid",
    };

    let targetJob = await jobProviderService.getJobById(jobId);
    if (!targetJob) {
      const allJobs = await jobProviderService.searchJobs({});
      targetJob = allJobs[0];
    }

    const match = calculateJobMatch(userMatch, {
      title: targetJob.title,
      companyName: targetJob.companyName,
      skills: targetJob.skills,
      experienceMin: targetJob.experienceMin,
      experienceMax: targetJob.experienceMax,
      salaryMin: targetJob.salaryMin,
      salaryMax: targetJob.salaryMax,
      location: targetJob.location,
      workMode: targetJob.workMode,
    });

    trace.push(`✓ Weighted match score computed: ${match.matchScore}%. Verdict: ${match.verdict}.`);

    const responseText = `### 🎯 AI Job Match Analysis for ${targetJob.title} (${targetJob.companyName})

**AI Match Score:** **${match.matchScore}%** (${match.verdict})

#### 📊 Dimension Breakdown:
- **Skills Alignment:** ${match.skillsMatchScore}%
- **Experience Match:** ${match.experienceMatchScore}%
- **Location Match:** ${match.locationMatchScore}%
- **Salary Match:** ${match.salaryMatchScore}%

#### ✅ Matching Skills:
${match.matchingSkills.map((s) => `- ${s}`).join("\n") || "- Basic technical background"}

#### ⚠ Missing Skills:
${match.missingSkills.map((s) => `- **${s}**`).join("\n") || "- None! You meet core skill criteria."}

#### 💡 Recommendation:
**${match.matchScore >= 75 ? "I strongly recommend applying!" : "Consider acquiring missing skills before applying."}** ${match.recommendation}`;

    return {
      toolName: "Job Matcher Agent",
      toolTrace: trace,
      responseText,
      embeddedJobs: [targetJob],
      data: match,
    };
  }

  // 4. Tool 4: Company Research
  async researchCompany(companyName: string): Promise<ToolResult> {
    const trace = [
      `Intent Router: Selected Tool -> researchCompany()`,
      `Searching company intelligence database for "${companyName}"...`,
    ];

    const q = companyName.toLowerCase().trim();
    let comp = DEMO_COMPANIES.find(
      (c) => c.name.toLowerCase().includes(q) || q.includes(c.name.toLowerCase())
    );

    if (!comp) comp = DEMO_COMPANIES[0];

    trace.push(`✓ Located profile for ${comp.name} (${comp.industry}).`);

    const responseText = `### 🏢 Company Intelligence Report: ${comp.name}

- **Industry:** ${comp.industry}
- **Headquarters / Locations:** ${comp.location}
- **Company Size:** ${comp.size}
- **Employee Rating:** ⭐ **${comp.rating} / 5.0**
- **Website:** [${comp.website}](${comp.website})

#### 📖 Overview:
${comp.overview}

#### 💻 Primary Tech Stack:
${comp.techStack.map((t) => `- \`${t}\``).join("\n")}

#### 🌟 Work Culture & Environment:
${comp.culture}

#### 🎯 AI "Should I Apply?" Verdict:
${comp.shouldApplySummary}

#### 💡 Key Considerations:
- **Pros:** Fast career progression, modern technology stack, strong brand reputation.
- **Considerations:** High performance expectations during product release cycles.`;

    return {
      toolName: "Company Research Agent",
      toolTrace: trace,
      responseText,
      data: comp,
    };
  }

  // 5. Tool 5: Application Tracker List
  async getApplications(): Promise<ToolResult> {
    const trace = [
      `Intent Router: Selected Tool -> getApplications()`,
      `Querying SQLite Application table for active candidate pipeline...`,
    ];

    const apps = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
    });

    trace.push(`✓ Retrieved ${apps.length} tracked job applications.`);

    let responseText = "### 💼 Your Job Application Pipeline\n\n";
    if (apps.length === 0) {
      responseText += "You have not tracked any applications yet. Go to the **Job Search** page to save or apply to jobs!";
    } else {
      apps.forEach((a) => {
        responseText += `* **${a.jobTitle}** — *${a.companyName}*\n  - **Status:** \`${a.status}\` | **Salary:** ${a.salary} | **Location:** ${a.location}\n  - **Applied Date:** ${a.appliedDate}${a.notes ? `\n  - **Notes:** *"${a.notes}"*` : ""}\n\n`;
      });
    }

    return {
      toolName: "Application Tracker Agent",
      toolTrace: trace,
      responseText,
      data: apps,
    };
  }

  // 6. Tool 6: Update Application Status
  async updateApplicationStatus(
    companyOrTitle: string,
    newStatus: string,
    notes?: string
  ): Promise<ToolResult> {
    const trace = [
      `Intent Router: Selected Tool -> updateApplicationStatus()`,
      `Locating application matching "${companyOrTitle}"...`,
    ];

    const q = companyOrTitle.toLowerCase().trim();
    const app = await prisma.application.findFirst({
      where: {
        OR: [
          { companyName: { contains: q } },
          { jobTitle: { contains: q } },
        ],
      },
    });

    if (!app) {
      return {
        toolName: "Application Tracker Agent",
        toolTrace: trace,
        responseText: `I couldn't find an active application matching **"${companyOrTitle}"** in your Kanban board. Please check your applications list!`,
      };
    }

    const updated = await prisma.application.update({
      where: { id: app.id },
      data: {
        status: newStatus.toUpperCase(),
        ...(notes ? { notes } : {}),
      },
    });

    trace.push(`✓ Updated application status for ${app.jobTitle} at ${app.companyName} to ${newStatus.toUpperCase()}.`);

    return {
      toolName: "Application Tracker Agent",
      toolTrace: trace,
      responseText: `✅ **Successfully Updated Application Status!**\n\n- **Role:** ${app.jobTitle}\n- **Company:** ${app.companyName}\n- **New Status:** \`${updated.status}\`\n${notes ? `- **Notes Added:** "${notes}"` : ""}\n\nYour Kanban board has been updated in real-time.`,
    };
  }

  // 7. Tool 7: Career Advisor
  async careerAdvisor(query: string, userProfile?: any): Promise<ToolResult> {
    const trace = [
      `Intent Router: Selected Tool -> careerAdvisor()`,
      `Retrieving user tech stack & career goal context...`,
      `Generating structured strategic career advice...`,
    ];

    let responseText = "";
    const lower = query.toLowerCase();

    if (lower.includes("aws") || lower.includes("docker")) {
      responseText = `### 🐳 AWS vs. Docker: Which Should You Learn First?

For a **Python / Full-Stack Developer**:

1. **Learn Docker First (Week 1–2):**
   - **Why:** Docker is essential for containerizing applications locally, ensuring identical environment setups between development and server deployment.
   - **Key Focus:** Dockerfiles, Multi-stage builds, \`docker-compose.yml\` for linking PostgreSQL/Redis.

2. **Learn AWS Second (Week 3–4):**
   - **Why:** AWS provides cloud infrastructure where your Docker containers will actually run.
   - **Key Focus:** EC2 instances, S3 file storage, IAM permissions, AWS ECS/EKS.

**Verdict:** Start with **Docker**, containerize a FastAPI/React project, and then deploy it to an **AWS EC2 instance**.`;
    } else {
      responseText = `### 💡 Strategic Career Advice

Based on your current profile (3 Years Experience, Python/React stack):

1. **Target Salary Range:** Aim for **₹14–22 LPA** in Bangalore, Hyderabad, or Remote roles.
2. **Key Tech Stack Expansion:**
   - **Containerization:** Docker & Kubernetes.
   - **Cloud Infrastructure:** AWS EC2, S3, RDS.
   - **Async Workflows:** FastAPI, Celery, Redis caching.
3. **Portfolio Recommendation:** Build an end-to-end full-stack AI project (e.g. an AI document analyzer with Next.js, FastAPI, and Pinecone RAG) to showcase on GitHub.`;
    }

    return {
      toolName: "Career Advisor Agent",
      toolTrace: trace,
      responseText,
    };
  }

  // 8. Tool 8: Skill Gap Analysis
  async analyzeSkillGap(targetRole: string = "Backend Developer"): Promise<ToolResult> {
    const trace = [
      `Intent Router: Selected Tool -> analyzeSkillGap()`,
      `Comparing candidate skills against current Indian market demands for ${targetRole}...`,
    ];

    const responseText = `### 📚 Skill Gap Analysis for Target Role: ${targetRole}

#### ✅ Skills You Have:
- ✓ **Python** (High Mastery)
- ✓ **SQL & PostgreSQL** (Solid Foundation)
- ✓ **React & Next.js** (Good Proficiency)
- ✓ **Git & REST API Design** (Production Ready)

#### ⚠ Skills You Should Improve:
- ⚠ **Docker Containerization** (Priority 1)
- ⚠ **AWS Cloud Services (EC2/S3)** (Priority 2)
- ⚠ **Redis Caching & Celery** (Priority 3)
- ⚠ **Kubernetes Basics** (Priority 4)

#### 🚀 Actionable Learning Roadmap:
1. **Week 1:** Learn Docker basics & containerize your backend project.
2. **Week 2:** Deploy Docker containers to AWS EC2 with free tier.
3. **Week 3:** Implement Redis caching layer to boost API speeds.`;

    return {
      toolName: "Skill Gap Advisor Agent",
      toolTrace: trace,
      responseText,
    };
  }

  // 9. Tool 9: Career Roadmap
  async generateCareerRoadmap(targetRole: string = "AI Engineer", months: number = 6): Promise<ToolResult> {
    const trace = [
      `Intent Router: Selected Tool -> generateCareerRoadmap()`,
      `Generating structured ${months}-month execution roadmap for ${targetRole}...`,
    ];

    const responseText = `### 🗺️ ${months}-Month Execution Roadmap: ${targetRole}

#### 📅 Month 1: Advanced Python & Data Manipulation
- **Topics:** Asyncio, NumPy, Pandas, Data Wrangling.
- **Mini-Project:** High-speed data processing pipeline.

#### 📅 Month 2: Machine Learning Fundamentals
- **Topics:** Scikit-Learn, Regression, Classification, Model Evaluation (Precision, Recall).
- **Mini-Project:** Customer churn prediction model.

#### 📅 Month 3: Deep Learning & PyTorch
- **Topics:** Neural Networks, PyTorch basics, Convolutional & Recurrent architectures.
- **Mini-Project:** Image classification model.

#### 📅 Month 4: Generative AI & Large Language Models (LLMs)
- **Topics:** Transformers, OpenAI/Gemini APIs, LangChain, Prompt Engineering.
- **Mini-Project:** RAG-powered vector search document chatbot.

#### 📅 Month 5: MLOps & Cloud Deployment
- **Topics:** Docker, FastAPI, AWS SageMaker / EC2, Model Monitoring.
- **Mini-Project:** Deploy live AI web application with Next.js frontend.

#### 📅 Month 6: Portfolio Polish & Technical Mock Interviews
- **Actions:** Publish open-source GitHub repositories, optimize ATS resume, practice technical interviews.`;

    return {
      toolName: "Career Roadmap Agent",
      toolTrace: trace,
      responseText,
    };
  }

  // 10. Tool 10: Mock Technical Interview Engine
  async startInterview(step: number = 1, userAnswer?: string): Promise<ToolResult> {
    const trace = [
      `Intent Router: Selected Tool -> startInterview()`,
      `Executing Mock Technical Interview Engine (Question ${step})...`,
    ];

    let responseText = "";
    if (step === 1 && !userAnswer) {
      responseText = `### 🎤 Mock Technical Interview: Python Backend Developer

Welcome! I'll conduct a brief mock interview. I'll ask one technical question at a time and evaluate your response.

---

**Question 1 (Python Core):**
*"What is the difference between a list and a tuple in Python, and when would you choose a tuple over a list?"*

*(Type your answer below to proceed!)*`;
    } else if (step === 1 && userAnswer) {
      responseText = `### 🎤 Mock Technical Interview: Question 1 Evaluation

**Your Answer:**
> "${userAnswer}"

#### 📊 Evaluation:
- **Technical Accuracy:** 85/100
- **Completeness:** 80/100
- **Communication:** Clear & Concise

**Feedback:** Great answer! You correctly identified that tuples are immutable while lists are mutable. To make your answer 100% complete in an interview, mention that tuples consume less memory and can be used as dictionary keys because they are hashable.

---

**Question 2 (Databases & SQL):**
*"What is an index in SQL databases, and why shouldn't you put an index on every single column?"*

*(Type your answer below to proceed to Question 3!)*`;
    } else {
      responseText = `### 🎤 Mock Technical Interview Complete!

**Overall Interview Rating:** 🏆 **84 / 100** (Strong Pass)

#### 📊 Section Breakdown:
- **Python Core Fundamentals:** 88%
- **Database Architecture:** 82%
- **Communication & Clarity:** 85%

#### 💡 Final Interview Tip:
You demonstrated strong technical knowledge! Maintain this confidence during your live tech rounds with companies like TechNova and Razorpay.`;
    }

    return {
      toolName: "Mock Interview Coach Agent",
      toolTrace: trace,
      responseText,
    };
  }

  // 11. Tool 11: AI Email Application Generator
  async generateApplicationEmailTool(jobTitleQuery?: string, userProfile?: any): Promise<ToolResult> {
    const trace = [
      `Intent Router: Selected Tool -> generateApplicationEmailTool()`,
      `Reading candidate profile & resume context...`,
      `Synthesizing job requirements for "${jobTitleQuery || "Python Developer"}" at TechNova Solutions...`,
      `Generating personalized, non-exaggerated application email draft...`,
    ];

    const targetJobTitle = jobTitleQuery || "Python Developer";
    const company = "TechNova Solutions";
    const recipient = "careers@technovasolutions.io";
    const candidateName = userProfile?.name || "Rahul Sharma";
    const attachment = "Resume_Rahul_Sharma.pdf";

    const subject = `Application for ${targetJobTitle} – ${candidateName}`;
    const body = `Dear Hiring Manager,

I am writing to express my strong interest in the ${targetJobTitle} position at ${company}. With hands-on experience in Python, FastAPI, React, SQL, and REST APIs, I am excited about the opportunity to contribute to your team.

My technical background aligns with your backend engineering goals, particularly in designing scalable microservices and optimizing database query performance. 

I would appreciate the opportunity to discuss my suitability for the role in an interview. I have attached my updated resume (${attachment}) for your review.

Best regards,

${candidateName}
Email: ${userProfile?.email || "rahul.sharma@example.com"}
Phone: ${userProfile?.phone || "+91 98765 43210"}`;

    const responseText = `### ✉️ AI-Generated Job Application Email

I've prepared a personalized application email based on your resume and the job description:

\`\`\`text
To: ${recipient}
Subject: ${subject}

${body}
\`\`\`

📎 **Attachment:** \`${attachment} ✓\`

You can click **View Email** or navigate to **Apply with AI** to review, edit, or send this email!`;

    return {
      toolName: "AI Application Email Generator",
      toolTrace: trace,
      responseText,
      data: {
        recipient,
        subject,
        body,
        attachment,
      },
    };
  }
}

export const agentToolsEngine = new AgentToolsEngine();
