export interface DemoCompany {
  id: string;
  name: string;
  logo: string;
  industry: string;
  location: string;
  website: string;
  size: string;
  overview: string;
  techStack: string[];
  culture: string;
  rating: number;
  openJobsCount: number;
  shouldApplySummary: string;
}

export const DEMO_COMPANIES: DemoCompany[] = [
  {
    id: "comp-technova",
    name: "TechNova Solutions",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=60",
    industry: "Information Technology & Cloud Solutions",
    location: "Bangalore, India",
    website: "https://technovasolutions.demo",
    size: "250 - 500 employees",
    overview: "TechNova Solutions is a fast-growing IT services and cloud consulting firm specializing in enterprise SaaS transformations, microservices architectures, and AI-powered backend systems.",
    techStack: ["Python", "FastAPI", "React", "PostgreSQL", "AWS", "Docker", "GitLab CI"],
    culture: "Work-life balance focused, agile, innovation-friendly with bi-weekly tech talks and structured career mentorship.",
    rating: 4.3,
    openJobsCount: 3,
    shouldApplySummary: "Strongly Recommended for Early to Mid-Level Engineers. TechNova offers fast-tracked promotion pathways, high code quality standards, and excellent exposure to cloud architectures."
  },
  {
    id: "comp-razorpay",
    name: "Razorpay",
    logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&auto=format&fit=crop&q=60",
    industry: "Financial Technology (FinTech)",
    location: "Bangalore & Mumbai, India",
    website: "https://razorpay.com",
    size: "1,000 - 5,000 employees",
    overview: "Razorpay is India's leading omnichannel payments and financial services platform for businesses, powering payments for over 10 Million businesses across India.",
    techStack: ["React", "Next.js", "Python", "Go", "AWS", "Kafka", "PostgreSQL", "LangChain"],
    culture: "High-ownership tech unicorn culture, fast execution, generous ESOP policies, and strong commitment to employee mental health.",
    rating: 4.6,
    openJobsCount: 4,
    shouldApplySummary: "Highly Recommended for Engineers seeking high-scale challenge & lucrative ESOP equity. Excellent engineering rigor and competitive pay."
  },
  {
    id: "comp-swiggy",
    name: "Swiggy",
    logo: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=120&auto=format&fit=crop&q=60",
    industry: "Consumer Internet & Hyperlocal Logistics",
    location: "Bangalore & Remote, India",
    website: "https://swiggy.com",
    size: "5,000 - 10,000 employees",
    overview: "Swiggy is India's leading on-demand convenience platform, offering food delivery, Instamart grocery delivery, Dineout, and Swiggy Genie.",
    techStack: ["React", "Flutter", "Go", "Java", "Redis", "Kafka", "AWS", "TensorFlow"],
    culture: "Remote-first engineering culture, data-driven decision making, high engineering ownership, and regular hackathons.",
    rating: 4.4,
    openJobsCount: 3,
    shouldApplySummary: "Great fit if you prefer 100% remote flexibility while building ultra-scale systems handling millions of orders daily."
  },
  {
    id: "comp-zomato",
    name: "Zomato",
    logo: "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=120&auto=format&fit=crop&q=60",
    industry: "Food Delivery & Quick Commerce",
    location: "Gurugram (Delhi NCR), India",
    website: "https://zomato.com",
    size: "5,000 - 10,000 employees",
    overview: "Zomato connects customers, restaurant partners, and delivery partners across 1,000+ Indian cities, powering food discovery and Blinkit quick commerce.",
    techStack: ["Python", "SQL", "Spark", "PostgreSQL", "React", "Tableau", "AWS"],
    culture: "Energetic campus environment, transparent communication, fast product iterations, and high accountability.",
    rating: 4.2,
    openJobsCount: 2,
    shouldApplySummary: "Ideal choice for Data Analysts and Product Engineers who love working with real-time consumer data and fast-paced operational challenges."
  },
  {
    id: "comp-tcs",
    name: "TCS (Tata Consultancy Services)",
    logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=60",
    industry: "IT Services & Global Consulting",
    location: "Mumbai, Pune, Bangalore, Nationwide",
    website: "https://tcs.com",
    size: "500,000+ employees",
    overview: "Tata Consultancy Services is an IT services, consulting, and business solutions organization that has been partnering with many of the world's largest businesses in their transformation journeys.",
    techStack: ["Java", "Spring Boot", "Oracle", "AWS", "Azure", "Kubernetes", "Mainframe"],
    culture: "High job stability, extensive global training resources, structured career progression, and Tata heritage values.",
    rating: 4.1,
    openJobsCount: 5,
    shouldApplySummary: "Recommended if you value long-term stability, structured enterprise processes, and opportunity for international client deployment."
  },
  {
    id: "comp-infosys",
    name: "Infosys",
    logo: "https://images.unsplash.com/photo-1542744094-3a31727223ec?w=120&auto=format&fit=crop&q=60",
    industry: "Digital Services & Consulting",
    location: "Bangalore, Hyderabad, Pune, Nationwide",
    website: "https://infosys.com",
    size: "300,000+ employees",
    overview: "Infosys is a global leader in next-generation digital services and consulting, enabling clients in over 56 countries to navigate their digital transformation.",
    techStack: ["Java", "Python", "AWS", "Terraform", "Docker", "Kubernetes", "Salesforce"],
    culture: "World-class learning institutes (Mysore campus), structured upskilling pathways, and steady growth.",
    rating: 4.0,
    openJobsCount: 4,
    shouldApplySummary: "Great for engineers seeking recognized global brand experience, sponsored cloud certifications, and stable project environments."
  },
  {
    id: "comp-google",
    name: "Google India",
    logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=60",
    industry: "Technology & Cloud Computing",
    location: "Bangalore & Hyderabad, India",
    website: "https://google.com",
    size: "100,000+ global employees",
    overview: "Google's mission is to organize the world's information and make it universally accessible and useful. Google R&D centers in India contribute to core Search, Android, Cloud, and AI products.",
    techStack: ["C++", "Python", "PyTorch", "TensorFlow", "Go", "BigQuery", "Kubernetes"],
    culture: "Top-tier engineering standards, collaborative research environment, unmatched employee perks, and compensation excellence.",
    rating: 4.8,
    openJobsCount: 3,
    shouldApplySummary: "Top Dream Target Company. World-class learning, cutting-edge AI problems, exceptional compensation, and prestige."
  },
  {
    id: "comp-microsoft",
    name: "Microsoft India",
    logo: "https://images.unsplash.com/photo-1583321500900-82807e458f3c?w=120&auto=format&fit=crop&q=60",
    industry: "Software, Cloud & Hardware",
    location: "Hyderabad & Bangalore, India",
    website: "https://microsoft.com",
    size: "100,000+ global employees",
    overview: "Microsoft enables digital transformation for the era of an intelligent cloud and intelligent edge. Microsoft India Development Center (IDC) is one of Microsoft's largest R&D centers outside Redmond.",
    techStack: ["C#", ".NET", "C++", "Python", "Azure", "TypeScript", "React"],
    culture: "Growth mindset culture, work-life flexibility, inclusive workplace, and industry-leading benefits.",
    rating: 4.7,
    openJobsCount: 3,
    shouldApplySummary: "Top Dream Target Company. Highly recommended for system architects, cloud engineers, and security specialists."
  }
];
