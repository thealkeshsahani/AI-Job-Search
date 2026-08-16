# Byte Builder AI — Your AI-Powered Career Companion

[![Next.js](https://img.shields.io/badge/Next.js-14%2B-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-Prisma-003B57?style=for-the-badge&logo=sqlite)](https://www.prisma.io/)

**Byte Builder AI** is a production-ready web application built for the **Indian Job Market**. It provides AI-powered job matching, ATS resume analysis, skill gap learning paths, company research, a Kanban application tracker, and a multi-tool AI career assistant.

---

## 🌟 Key Features & Indian Market Specialization

1. **AI Job Matching Engine:**
   - Weighted scoring algorithm: Skills (40%), Experience (20%), Location (15%), Salary (10%), Work Mode (5%), and Alignment (10%).
   - Displays match rationale, matching skills, and missing skills.

2. **Resume Analyzer & ATS Scoring:**
   - Text & PDF resume parser.
   - Calculates overall ATS compatibility score (0–100) with section breakdown progress bars (Skills relevance, Experience impact, Keywords, Formatting).
   - Generates personalized skill gap analysis and step-by-step learning roadmaps.

3. **Indian Job Market Specialization:**
   - **LPA Salary Scale:** Supports Indian currency formats (e.g. ₹6–10 LPA, ₹22–35 LPA).
   - **Notice Period Filters:** Supports Immediate joiners, 15 Days, 30 Days, 60 Days, and 90 Days.
   - **Indian Tech Hubs:** Bangalore, Mumbai, Gurugram (Delhi NCR), Pune, Hyderabad, Chennai, Kolkata, Jaipur, Ahmedabad, and Remote.

4. **Multi-Tool AI Career Assistant:**
   - Conversational AI agent with tool dispatching (Resume Reviewer, Salary Benchmarker, Interview Coach, Job Finder).
   - Quick prompt templates for mock interview prep and salary negotiation.

5. **Company Research & Culture Insights:**
   - Tech stacks, work culture, employee ratings, and AI *"Should I Apply?"* summaries for major companies (Razorpay, Swiggy, Zomato, TCS, Infosys, Google India, Microsoft India).

6. **Kanban Application Tracker:**
   - Drag/move applications across columns: *Saved*, *Applied*, *Screening*, *Interview*, *Offer*, *Rejected*.
   - Add custom applications, track next follow-up dates, and maintain notes.

7. **Offline Demo Mode:**
   - Fully operational without external API keys! Pre-seeded with 20+ realistic job listings, 8+ company profiles, and sample user applications.

---

## 🏗️ Technology Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4, Lucide React Icons
- **Database:** SQLite with Prisma ORM
- **Charts:** Recharts
- **AI Service Layer:** Abstracted AI service (Google Gemini 1.5 Flash, OpenAI GPT-4o, and Demo AI Engine)

---

## 📁 Project File Structure

```
careerpilot-ai/
├── app/
│   ├── layout.tsx                 # Root layout & font configuration
│   ├── page.tsx                   # Landing Page (Hero, Features, How It Works)
│   ├── dashboard/page.tsx         # Dashboard with Recharts & Recommended Jobs
│   ├── jobs/page.tsx              # Job Search with Indian market filters
│   ├── jobs/[id]/page.tsx         # Job Detail Modal with AI Match breakdown
│   ├── resume/page.tsx            # Resume Upload & ATS Score Analyzer
│   ├── assistant/page.tsx font    # AI Career Assistant Chatbot
│   ├── companies/page.tsx         # Company Research & Culture Insights
│   ├── applications/page.tsx      # Kanban Application Tracker
│   ├── saved-jobs/page.tsx        # Bookmarked Jobs Page
│   ├── profile/page.tsx           # Indian Market Career Profile
│   ├── settings/page.tsx          # Settings & AI Provider Config
│   └── api/                       # REST API endpoints
│       ├── jobs/route.ts
│       ├── match/route.ts
│       ├── resume/route.ts
│       ├── applications/route.ts
│       ├── saved-jobs/route.ts
│       ├── companies/route.ts
│       ├── assistant/route.ts
│       └── profile/route.ts
├── components/
│   ├── layout/                    # Navbar, Sidebar
│   └── jobs/                      # JobCard, MatchScoreBadge, JobDetailModal
├── lib/
│   ├── ai/                        # AIService abstraction (Gemini, OpenAI, Demo)
│   ├── jobs/                      # JobProvider abstraction & DemoJobProvider
│   ├── matching/                  # Weighted Job Matcher algorithm
│   ├── resume/                    # Resume parser & ATS scoring engine
│   └── db/                        # Prisma Client singleton helper
├── prisma/
│   ├── schema.prisma              # SQLite Database schema definition
│   └── seed.ts                    # Database seeding script (20+ jobs, 8+ companies)
├── data/
│   ├── demo-jobs.ts               # Seed job listings for Indian cities
│   └── demo-companies.ts          # Seed company profiles
├── .env.example                   # Environment configuration template
├── README.md
└── package.json
```

---

## ⚡ Quick Start & Local Setup

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
# Database Connection
DATABASE_URL="file:./dev.db"

# AI Provider Configuration ("demo", "gemini", or "openai")
AI_PROVIDER="demo"

# API Keys (Optional - Application defaults to Demo AI Mode if omitted)
GEMINI_API_KEY=""
OPENAI_API_KEY=""
```

### 3. Initialize & Seed SQLite Database
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Production Build & Deployment

To verify and test production build locally:
```bash
npm run build
npm run start
```

### Deploying to Vercel / Netlify
1. Connect repository to Vercel.
2. Set Environment Variables (`DATABASE_URL`, `AI_PROVIDER`, etc.).
3. Build command: `npx prisma db push && npx tsx prisma/seed.ts && next build`.

---

## 🧪 Testing & Verification Flow

1. **Landing Page:** Open `/` to view product tagline, hero UI mockup, and feature cards.
2. **Dashboard:** Open `/dashboard` to view statistic cards, Recharts application pipeline pie chart, and recommended job cards.
3. **Job Search:** Open `/jobs` and test searching for *"Python Bangalore"*, filtering by LPA salary (e.g. ₹6+ LPA) and Notice Period (30 Days).
4. **AI Match Score:** Open any job modal to view 90%+ match breakdown, missing skills highlight, and AI advice.
5. **Resume Analyzer:** Open `/resume`, click *"Load Sample Demo Resume"*, and calculate ATS score (82/100) with section breakdown bars and learning path.
6. **Kanban Tracker:** Open `/applications` and drag/update application statuses from Saved -> Applied -> Interview -> Offer.
7. **AI Assistant:** Open `/assistant` and click prompt templates (e.g. *"Prepare me for a Python backend interview"*).

---

## 📜 License
Developed for the 8-Week AI Job Search Agent Project. Open-source under MIT License.
