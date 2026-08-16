export interface DemoJob {
  id: string;
  title: string;
  companyName: string;
  companyLogo: string;
  location: string;
  salaryMin: number; // in LPA
  salaryMax: number; // in LPA
  experienceMin: number;
  experienceMax: number;
  workMode: "Remote" | "Hybrid" | "On-site";
  noticePeriodReq: "Immediate" | "15 Days" | "30 Days" | "60 Days" | "90 Days" | "Any";
  employmentType: "Full-time" | "Contract" | "Internship";
  skills: string[];
  summary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: string;
  companyId?: string;
  recruiterEmail?: string;
  applicationUrl?: string;
}

export const DEMO_JOBS: DemoJob[] = [
  {
    id: "job-1",
    title: "Python Developer",
    companyName: "TechNova Solutions",
    companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=60",
    location: "Bangalore",
    salaryMin: 6.0,
    salaryMax: 10.0,
    experienceMin: 1,
    experienceMax: 3,
    workMode: "Hybrid",
    noticePeriodReq: "30 Days",
    employmentType: "Full-time",
    skills: ["Python", "Django", "FastAPI", "SQL", "REST API", "Git"],
    summary: "Looking for a proactive Python Backend Developer to design robust microservices and scalable REST APIs.",
    description: "TechNova Solutions is seeking an enthusiastic Python Developer to join our Cloud Engineering team in Bangalore. You will be responsible for writing clean, testable code, integrating backend components with frontend features, and optimizing SQL database queries for low latency.",
    requirements: [
      "1-3 years of experience writing production Python backend software.",
      "Proficiency with Django or FastAPI frameworks.",
      "Strong understanding of relational databases (PostgreSQL/MySQL/SQLite).",
      "Familiarity with Git workflow, Docker containers, and CI/CD pipelines.",
      "Good problem solving and RESTful API design principles."
    ],
    benefits: [
      "Competitive compensation & annual performance bonus.",
      "Flexible hybrid working model (2 days office, 3 days WFH).",
      "Comprehensive medical coverage for employee and dependents.",
      "₹25,000 annual learning & skill development allowance."
    ],
    postedDate: "2 days ago",
    companyId: "comp-technova",
    recruiterEmail: "careers@technovasolutions.io",
    applicationUrl: "https://technovasolutions.io/careers/python-developer"
  },
  {
    id: "job-2",
    title: "Senior Full Stack AI Engineer",
    companyName: "Razorpay",
    companyLogo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&auto=format&fit=crop&q=60",
    location: "Bangalore",
    salaryMin: 22.0,
    salaryMax: 35.0,
    experienceMin: 4,
    experienceMax: 7,
    workMode: "Hybrid",
    noticePeriodReq: "30 Days",
    employmentType: "Full-time",
    skills: ["React", "Next.js", "Python", "LangChain", "OpenAI API", "TypeScript", "Node.js"],
    summary: "Lead the creation of AI-powered financial assistants and automated merchant support systems.",
    description: "Join Razorpay's AI Innovations lab! As a Senior Full Stack AI Engineer, you will build user-facing generative AI tools, LLM workflows, and high-performance React application dashboards. You will closely collaborate with Product, UX, and ML Research teams.",
    requirements: [
      "4+ years of full-stack TypeScript/React and Python experience.",
      "Proven track record building & deploying Generative AI or LLM applications.",
      "Deep understanding of Next.js App Router, Tailwind CSS, and Web Sockets.",
      "Experience with Vector databases (Pinecone, PGVector) and RAG architectures."
    ],
    benefits: [
      "Top-of-market equity options (ESOPs).",
      "Wellness allowance, gym subscriptions, and mental health support.",
      "Unlimited paid time off (PTO) & generous parental leave.",
      "Latest M3 Max MacBook Pro + home office stipend."
    ],
    postedDate: "1 day ago",
    companyId: "comp-razorpay"
  },
  {
    id: "job-3",
    title: "Frontend Developer (React / Next.js)",
    companyName: "Swiggy",
    companyLogo: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=120&auto=format&fit=crop&q=60",
    location: "Remote",
    salaryMin: 12.0,
    salaryMax: 18.0,
    experienceMin: 2,
    experienceMax: 5,
    workMode: "Remote",
    noticePeriodReq: "Immediate",
    employmentType: "Full-time",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux Toolkit", "Web Performance"],
    summary: "Craft lightning-fast web applications for millions of Swiggy consumers and delivery partners.",
    description: "Swiggy is looking for a frontend wizard to elevate consumer experience across web & PWA platforms. You will refine component architecture, optimize web vitals (LCP, CLS), and champion accessible UI design.",
    requirements: [
      "2+ years experience building large scale React web applications.",
      "Expert knowledge of CSS/Tailwind, JavaScript ES6+, and TypeScript.",
      "Experience optimizing client-side performance, code-splitting, and SEO.",
      "Strong eye for pixel-perfect design and responsive layouts."
    ],
    benefits: [
      "100% remote work flexibility from anywhere in India.",
      "Swiggy food & Instamart employee discount vouchers.",
      "Comprehensive family health insurance.",
      "Annual team retreats and hackathons."
    ],
    postedDate: "3 days ago",
    companyId: "comp-swiggy"
  },
  {
    id: "job-4",
    title: "Data Analyst - Product Insights",
    companyName: "Zomato",
    companyLogo: "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=120&auto=format&fit=crop&q=60",
    location: "Gurugram (Delhi NCR)",
    salaryMin: 8.0,
    salaryMax: 14.0,
    experienceMin: 1,
    experienceMax: 4,
    workMode: "On-site",
    noticePeriodReq: "15 Days",
    employmentType: "Full-time",
    skills: ["Python", "SQL", "Pandas", "Tableau", "A/B Testing", "Power BI"],
    summary: "Transform consumer ordering patterns and delivery logistics into actionable product strategies.",
    description: "Zomato Product Analytics team is seeking a data enthusiast to drive user retention insights. You will run A/B experiments, craft executive dashboards, and query terabytes of transaction data using SQL and Python.",
    requirements: [
      "Strong proficiency in complex SQL queries, CTEs, and window functions.",
      "Hands-on Python experience (Pandas, NumPy, Matplotlib/Seaborn).",
      "Solid foundation in hypothesis testing, statistical analysis, and metrics tracking.",
      "Excellent communication and visualization skills."
    ],
    benefits: [
      "Free gourmet lunch & gourmet coffee station on campus.",
      "Health & life insurance cover up to ₹10 Lakhs.",
      "Performance incentives and ESOP grants for top performers."
    ],
    postedDate: "Just now",
    companyId: "comp-zomato"
  },
  {
    id: "job-5",
    title: "Backend Java / Spring Boot Developer",
    companyName: "TCS (Tata Consultancy Services)",
    companyLogo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=60",
    location: "Pune",
    salaryMin: 5.5,
    salaryMax: 9.5,
    experienceMin: 2,
    experienceMax: 5,
    workMode: "Hybrid",
    noticePeriodReq: "60 Days",
    employmentType: "Full-time",
    skills: ["Java", "Spring Boot", "Microservices", "Oracle DB", "Kafka", "REST API"],
    summary: "Build resilient core banking and enterprise software services for global Fortune 500 clients.",
    description: "TCS Digital Practice is hiring Java Backend Developers in Pune. You will work on mission-critical financial cloud applications using Java 17, Spring Boot microservices, Kafka streaming, and Kubernetes deployment.",
    requirements: [
      "2+ years experience in Java 8/11/17 and Spring Boot.",
      "Demonstrated experience designing enterprise RESTful web services.",
      "Strong knowledge of SQL, ORM frameworks (Hibernate/JPA), and transactions.",
      "Familiarity with Agile Scrum methodology."
    ],
    benefits: [
      "Global client exposure & international transfer opportunities.",
      "Structured career growth pathways and certifications funding.",
      "Comprehensive medical insurance covering parents."
    ],
    postedDate: "4 days ago",
    companyId: "comp-tcs"
  },
  {
    id: "job-6",
    title: "Cloud DevOps & Infrastructure Engineer",
    companyName: "Infosys",
    companyLogo: "https://images.unsplash.com/photo-1542744094-3a31727223ec?w=120&auto=format&fit=crop&q=60",
    location: "Hyderabad",
    salaryMin: 10.0,
    salaryMax: 16.0,
    experienceMin: 3,
    experienceMax: 6,
    workMode: "Hybrid",
    noticePeriodReq: "30 Days",
    employmentType: "Full-time",
    skills: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux", "Python"],
    summary: "Architect automated CI/CD pipelines, cloud infrastructure, and security automation on AWS.",
    description: "Infosys Cloud & Infrastructure division is hiring DevOps Engineers for high-impact enterprise accounts. You will manage Kubernetes clusters, automate infrastructure with Terraform, and maintain high availability across AWS cloud environments.",
    requirements: [
      "3+ years DevOps experience with AWS Cloud services (EC2, EKS, S3, IAM).",
      "Hands-on expertise with Docker containers & Kubernetes orchestration.",
      "Infrastructure as Code (IaC) experience using Terraform or CloudFormation.",
      "Strong Linux administration and bash/Python scripting capability."
    ],
    benefits: [
      "Infosys Learning Institute training programs and AWS vouchers.",
      "Shuttle bus transport across major Hyderabad tech hubs.",
      "Health insurance & gratuity plan."
    ],
    postedDate: "5 days ago",
    companyId: "comp-infosys"
  },
  {
    id: "job-7",
    title: "Machine Learning Engineer",
    companyName: "Google India",
    companyLogo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=60",
    location: "Bangalore",
    salaryMin: 28.0,
    salaryMax: 45.0,
    experienceMin: 3,
    experienceMax: 7,
    workMode: "Hybrid",
    noticePeriodReq: "30 Days",
    employmentType: "Full-time",
    skills: ["Python", "PyTorch", "TensorFlow", "MLOps", "NLP", "C++", "System Design"],
    summary: "Develop groundbreaking machine learning models powering search, vision, and language understanding.",
    description: "Google Research & Development Center Bangalore is looking for exceptional ML Engineers. You will design, train, and benchmark deep learning algorithms, optimize model inference on edge hardware, and publish research implementations.",
    requirements: [
      "Degree in CS, Data Science, or related quantitative field.",
      "3+ years experience delivering production ML models using PyTorch or TensorFlow.",
      "Strong computer science fundamentals, data structures, and algorithms.",
      "Experience with scalable MLOps pipelines and cloud ML platforms."
    ],
    benefits: [
      "World-class campus facilities, free catered meals, and barista bars.",
      "Generous stock units (GSUs) & annual performance bonus.",
      "Comprehensive health, dental, vision, and wellness coverage."
    ],
    postedDate: "1 day ago",
    companyId: "comp-google"
  },
  {
    id: "job-8",
    title: "UI/UX Designer - SaaS Products",
    companyName: "Wipro",
    companyLogo: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=120&auto=format&fit=crop&q=60",
    location: "Kolkata",
    salaryMin: 7.0,
    salaryMax: 12.0,
    experienceMin: 2,
    experienceMax: 5,
    workMode: "Hybrid",
    noticePeriodReq: "30 Days",
    employmentType: "Full-time",
    skills: ["Figma", "UI Design", "User Research", "Wireframing", "Prototyping", "Design Systems"],
    summary: "Create intuitive user flows, visual component libraries, and interactive prototypes for web platforms.",
    description: "Wipro Enterprise Experience Design Studio is seeking a talented UI/UX Designer in Kolkata. You will convert complex enterprise workflows into sleek, accessible, and delightful digital user interfaces.",
    requirements: [
      "2+ years experience designing web and mobile applications.",
      "Mastery of Figma, auto-layout, component variants, and prototyping.",
      "Solid background conducting user interviews, usability tests, and journey mapping.",
      "Strong online design portfolio showcasing end-to-end design thinking."
    ],
    benefits: [
      "Flexible work schedule & hybrid office model.",
      "Design conference sponsorships & tool subscriptions.",
      "Family medical coverage and life insurance."
    ],
    postedDate: "3 days ago",
    companyId: "comp-wipro"
  },
  {
    id: "job-9",
    title: "Node.js Microservices Developer",
    companyName: "Flipkart",
    companyLogo: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=120&auto=format&fit=crop&q=60",
    location: "Bangalore",
    salaryMin: 15.0,
    salaryMax: 24.0,
    experienceMin: 3,
    experienceMax: 6,
    workMode: "Hybrid",
    noticePeriodReq: "30 Days",
    employmentType: "Full-time",
    skills: ["Node.js", "Express", "TypeScript", "Redis", "MongoDB", "RabbitMQ", "Docker"],
    summary: "Power India's biggest e-commerce shopping festivals with high-throughput backend services.",
    description: "Flipkart Supply Chain & Logistics Tech team is looking for a Node.js Backend Engineer. You will build asynchronous event-driven microservices capable of processing over 50,000 requests per second during Big Billion Days.",
    requirements: [
      "3+ years experience with Node.js, Express/NestJS, and TypeScript.",
      "Deep understanding of distributed systems, caching (Redis), and event streaming (RabbitMQ/Kafka).",
      "Proficiency in MongoDB or SQL database tuning.",
      "Experience writing high-coverage unit & integration tests."
    ],
    benefits: [
      "Competitive fixed pay + variable bonus + Flipkart stock grants.",
      "Wellness leave, mental wellness consultations, and fitness allowances.",
      "Subsidized transport and high-tech laptop setup."
    ],
    postedDate: "2 days ago",
    companyId: "comp-flipkart"
  },
  {
    id: "job-10",
    title: "Junior QA / Automation Engineer",
    companyName: "TechNova Solutions",
    companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=60",
    location: "Jaipur",
    salaryMin: 4.5,
    salaryMax: 7.5,
    experienceMin: 0,
    experienceMax: 2,
    workMode: "On-site",
    noticePeriodReq: "Immediate",
    employmentType: "Full-time",
    skills: ["Selenium", "Python", "Playwright", "Postman", "API Testing", "Jira"],
    summary: "Drive software quality, automated regression testing, and API verification pipelines.",
    description: "TechNova Solutions Jaipur branch is looking for an enthusiastic QA Engineer. Perfect for recent graduates or early career engineers wanting to build automated test frameworks in Python and Playwright.",
    requirements: [
      "0-2 years experience in web application testing.",
      "Basic programming skills in Python or JavaScript.",
      "Knowledge of Postman for REST API validation.",
      "Understanding of SDLC, bug tracking in Jira, and writing clear test cases."
    ],
    benefits: [
      "Mentorship from senior QA architects.",
      "Annual performance appraisals & fast track growth.",
      "Medical insurance."
    ],
    postedDate: "6 days ago",
    companyId: "comp-technova"
  },
  {
    id: "job-11",
    title: "Cybersecurity Analyst",
    companyName: "Microsoft India",
    companyLogo: "https://images.unsplash.com/photo-1583321500900-82807e458f3c?w=120&auto=format&fit=crop&q=60",
    location: "Hyderabad",
    salaryMin: 18.0,
    salaryMax: 28.0,
    experienceMin: 3,
    experienceMax: 6,
    workMode: "Hybrid",
    noticePeriodReq: "30 Days",
    employmentType: "Full-time",
    skills: ["Cybersecurity", "Network Security", "Azure Sentinel", "Penetration Testing", "Python", "SIEM"],
    summary: "Protect cloud environments, monitor security operation threats, and mitigate vulnerabilities.",
    description: "Join Microsoft Security Operations team in Hyderabad. You will defend cloud enterprise networks against advanced persistent threats (APTs), conduct threat hunting, and automate threat responses.",
    requirements: [
      "3+ years in SOC, threat analysis, or security engineering.",
      "Certifications such as CEH, CISSP, AWS/Azure Security specialty are a plus.",
      "Experience with Azure Sentinel, Splunk, or SIEM platforms.",
      "Scripting skills in Python or PowerShell."
    ],
    benefits: [
      "Microsoft employee purchase discounts & hardware grants.",
      "Comprehensive medical & disability cover.",
      "Generous educational reimbursement."
    ],
    postedDate: "1 day ago",
    companyId: "comp-microsoft"
  },
  {
    id: "job-12",
    title: "Product Manager - AI Solutions",
    companyName: "Razorpay",
    companyLogo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&auto=format&fit=crop&q=60",
    location: "Mumbai",
    salaryMin: 20.0,
    salaryMax: 32.0,
    experienceMin: 4,
    experienceMax: 8,
    workMode: "Hybrid",
    noticePeriodReq: "30 Days",
    employmentType: "Full-time",
    skills: ["Product Management", "AI/ML", "User Research", "Agile", "Roadmapping", "Data Analytics"],
    summary: "Define product vision, user roadmap, and launch metrics for next-gen financial AI products.",
    description: "Razorpay Mumbai office is seeking an ambitious Product Manager to lead AI-driven risk scoring and automated payment routing products. You will work with engineers, data scientists, and business stakeholders.",
    requirements: [
      "4+ years product management experience in FinTech, SaaS, or AI applications.",
      "Strong analytical mindset with track record of shipping successful user-centric products.",
      "Ability to write clear PRDs, wireframes, and user stories.",
      "Demonstrated understanding of machine learning business applications."
    ],
    benefits: [
      "Competitive pay, quarterly performance bonuses, and ESOPs.",
      "Prime Mumbai office location with catered meals.",
      "Top tier health benefits."
    ],
    postedDate: "3 days ago",
    companyId: "comp-razorpay"
  },
  {
    id: "job-13",
    title: "Mobile App Developer (Flutter / React Native)",
    companyName: "Swiggy",
    companyLogo: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=120&auto=format&fit=crop&q=60",
    location: "Remote",
    salaryMin: 14.0,
    salaryMax: 22.0,
    experienceMin: 2,
    experienceMax: 5,
    workMode: "Remote",
    noticePeriodReq: "15 Days",
    employmentType: "Full-time",
    skills: ["Flutter", "React Native", "Dart", "TypeScript", "iOS", "Android", "State Management"],
    summary: "Build cross-platform mobile apps delivering real-time delivery tracking to millions of users.",
    description: "Swiggy Mobile Engineering team is seeking a Flutter/React Native developer to build high performance Android and iOS applications with smooth animations and offline resilience.",
    requirements: [
      "2+ years experience building production apps using Flutter or React Native.",
      "Experience publishing apps on Google Play Store and Apple App Store.",
      "Solid grasp of mobile state management (Provider/Bloc/Redux).",
      "Knowledge of native Android (Kotlin) or iOS (Swift) bridging is a bonus."
    ],
    benefits: [
      "100% WFH flexibility.",
      "Free equipment allowance.",
      "Comprehensive medical coverage."
    ],
    postedDate: "5 days ago",
    companyId: "comp-swiggy"
  },
  {
    id: "job-14",
    title: "DevOps Architect",
    companyName: "TCS (Tata Consultancy Services)",
    companyLogo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=60",
    location: "Ahmedabad",
    salaryMin: 16.0,
    salaryMax: 26.0,
    experienceMin: 6,
    experienceMax: 10,
    workMode: "Hybrid",
    noticePeriodReq: "60 Days",
    employmentType: "Full-time",
    skills: ["AWS", "Azure", "Kubernetes", "Helm", "GitLab CI", "Security", "Infrastructure"],
    summary: "Architect enterprise multi-cloud DevOps pipelines and governance standards for international clients.",
    description: "TCS Ahmedabad is hiring a Senior DevOps Architect. You will lead cloud migration strategies, container orchestration standards, and automated compliance frameworks across AWS and Azure environments.",
    requirements: [
      "6+ years experience in cloud architecture, DevOps, and infrastructure security.",
      "Expert knowledge of Kubernetes, Helm, Terraform, and service meshes (Istio).",
      "Proven leadership experience mentoring engineering teams.",
      "AWS or Azure Solutions Architect Professional Certification preferred."
    ],
    benefits: [
      "TCS Executive Leadership Development path.",
      "Relocation support to Ahmedabad if applicable.",
      "Comprehensive health coverage for extended family."
    ],
    postedDate: "1 week ago",
    companyId: "comp-tcs"
  },
  {
    id: "job-15",
    title: "Golang Systems Engineer",
    companyName: "Flipkart",
    companyLogo: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=120&auto=format&fit=crop&q=60",
    location: "Bangalore",
    salaryMin: 18.0,
    salaryMax: 30.0,
    experienceMin: 3,
    experienceMax: 7,
    workMode: "Hybrid",
    noticePeriodReq: "30 Days",
    employmentType: "Full-time",
    skills: ["Go", "Golang", "gRPC", "Distributed Systems", "PostgreSQL", "Redis", "Docker"],
    summary: "Engine high-concurrency microservices, real-time inventory systems, and distributed key-value stores.",
    description: "Flipkart Infrastructure Core Team is hiring Golang Engineers. You will build ultra-fast low latency backend services using Go, gRPC, Protocol Buffers, and distributed consensus protocols.",
    requirements: [
      "3+ years experience writing production Golang backend code.",
      "Deep understanding of concurrency (goroutines, channels, mutexes).",
      "Experience with gRPC, microservices architecture, and SQL/NoSQL databases.",
      "Passion for performance optimization and benchmarking."
    ],
    benefits: [
      "Market leading salary, annual bonuses, and stock rewards.",
      "Prime Bangalore location office with free cab facility.",
      "Health & fitness coverage."
    ],
    postedDate: "4 days ago",
    companyId: "comp-flipkart"
  },
  {
    id: "job-16",
    title: "Full Stack Engineer (MERN)",
    companyName: "TechNova Solutions",
    companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=60",
    location: "Chennai",
    salaryMin: 7.5,
    salaryMax: 12.5,
    experienceMin: 2,
    experienceMax: 4,
    workMode: "On-site",
    noticePeriodReq: "30 Days",
    employmentType: "Full-time",
    skills: ["React", "Node.js", "Express", "MongoDB", "JavaScript", "HTML/CSS"],
    summary: "Deliver end-to-end web applications with responsive React frontend and robust Node.js APIs.",
    description: "TechNova Chennai is seeking a MERN Stack Developer. You will build customer management portals, design database schemas in MongoDB, and craft clean React user interfaces.",
    requirements: [
      "2+ years experience in Full Stack development using React and Node.js.",
      "Proficiency with Express.js, REST APIs, and MongoDB/Mongoose.",
      "Good understanding of Git version control and modern CSS.",
      "Strong debugging and problem solving skills."
    ],
    benefits: [
      "Friendly work culture and career development opportunities.",
      "Health insurance and food coupons.",
      "Annual company outing."
    ],
    postedDate: "5 days ago",
    companyId: "comp-technova"
  },
  {
    id: "job-17",
    title: "Cloud Security Specialist",
    companyName: "Infosys",
    companyLogo: "https://images.unsplash.com/photo-1542744094-3a31727223ec?w=120&auto=format&fit=crop&q=60",
    location: "Pune",
    salaryMin: 12.0,
    salaryMax: 19.0,
    experienceMin: 3,
    experienceMax: 7,
    workMode: "Hybrid",
    noticePeriodReq: "30 Days",
    employmentType: "Full-time",
    skills: ["Cloud Security", "AWS", "IAM", "Compliance", "Python", "Vulnerability Assessment"],
    summary: "Ensure enterprise cloud workloads meet ISO 27001, SOC2, and AWS security best practices.",
    description: "Infosys Cyber Defense Center in Pune is looking for a Cloud Security Specialist. You will audit cloud architectures, establish IAM policies, and automate vulnerability scanning.",
    requirements: [
      "3+ years experience in AWS/Azure cloud security administration.",
      "Understanding of IAM, security groups, encryption keys (KMS), and VPC network isolation.",
      "Hands-on experience with security compliance tools.",
      "Relevant cloud security certification preferred."
    ],
    benefits: [
      "Competitive compensation & hybrid work structure.",
      "Infosys Global Certification sponsorship.",
      "Group medical insurance."
    ],
    postedDate: "1 week ago",
    companyId: "comp-infosys"
  },
  {
    id: "job-18",
    title: "Data Engineer (Spark & PySpark)",
    companyName: "Google India",
    companyLogo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=60",
    location: "Hyderabad",
    salaryMin: 24.0,
    salaryMax: 38.0,
    experienceMin: 3,
    experienceMax: 7,
    workMode: "Hybrid",
    noticePeriodReq: "30 Days",
    employmentType: "Full-time",
    skills: ["Python", "PySpark", "Apache Spark", "SQL", "BigQuery", "Data Lakes", "Airflow"],
    summary: "Build petabyte-scale data pipelines, real-time ETL jobs, and data warehouse models.",
    description: "Google Data Engineering team in Hyderabad is hiring Data Engineers. You will construct high-throughput streaming pipelines, manage BigQuery data infrastructure, and optimize Spark processing jobs.",
    requirements: [
      "3+ years experience constructing distributed data pipelines using Python and PySpark.",
      "Expert knowledge of SQL, data modeling (Kimball), and data warehousing (BigQuery/Snowflake).",
      "Experience with DAG orchestration tools like Apache Airflow.",
      "Strong computer science fundamentals."
    ],
    benefits: [
      "Unmatched perks, gourmet dining, campus wellness centers.",
      "Google Stock Units (GSUs) & annual performance bonus.",
      "Full family healthcare coverage."
    ],
    postedDate: "2 days ago",
    companyId: "comp-google"
  },
  {
    id: "job-19",
    title: "Technical Content & Developer Relations Advocate",
    companyName: "Razorpay",
    companyLogo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&auto=format&fit=crop&q=60",
    location: "Remote",
    salaryMin: 10.0,
    salaryMax: 16.0,
    experienceMin: 1,
    experienceMax: 4,
    workMode: "Remote",
    noticePeriodReq: "Immediate",
    employmentType: "Full-time",
    skills: ["Technical Writing", "API Documentation", "JavaScript", "Python", "Community", "Git"],
    summary: "Empower developer communities by authoring world-class API documentation, tutorials, and sample code.",
    description: "Razorpay Developer Relations team is looking for a Developer Advocate. You will create interactive code samples, write clear payment integration guides, host technical webinars, and represent Razorpay in developer forums.",
    requirements: [
      "Experience in technical writing, coding tutorials, or developer advocacy.",
      "Ability to write and test code snippets in JavaScript, Python, or PHP.",
      "Excellent written communication skills with strong attention to detail.",
      "Enthusiasm for helping developers solve integration challenges."
    ],
    benefits: [
      "Work 100% remotely from anywhere in India.",
      "Annual budget for attending international tech conferences.",
      "Comprehensive medical cover & health allowances."
    ],
    postedDate: "3 days ago",
    companyId: "comp-razorpay"
  },
  {
    id: "job-20",
    title: "Software Engineer - AI Systems",
    companyName: "Microsoft India",
    companyLogo: "https://images.unsplash.com/photo-1583321500900-82807e458f3c?w=120&auto=format&fit=crop&q=60",
    location: "Bangalore",
    salaryMin: 25.0,
    salaryMax: 40.0,
    experienceMin: 2,
    experienceMax: 6,
    workMode: "Hybrid",
    noticePeriodReq: "30 Days",
    employmentType: "Full-time",
    skills: ["C++", "Python", "PyTorch", "ONNX", "CUDA", "LLM Acceleration", "System Design"],
    summary: "Optimize deep learning runtime engines, GPU memory allocation, and ONNX model execution.",
    description: "Microsoft AI Infrastructure & Systems team Bangalore is seeking a Systems Engineer. You will work on low-level performance optimization, GPU kernel tuning, and cross-platform model runtime acceleration.",
    requirements: [
      "2+ years experience in C++ (17/20) and Python low-level systems programming.",
      "Knowledge of GPU architecture, CUDA programming, or ONNX Runtime.",
      "Solid background in computer architecture, memory management, and multi-threading.",
      "Bachelor's or Master's degree in CS or Electrical Engineering."
    ],
    benefits: [
      "Top-tier compensation, stock grants, and wellness benefits.",
      "Modern Bangalore campus with state-of-the-art labs.",
      "Flexible hybrid working options."
    ],
    postedDate: "4 days ago",
    companyId: "comp-microsoft"
  }
];
