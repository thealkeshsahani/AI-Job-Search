import { GoogleGenerativeAI } from "@google/generative-ai";
import { agentToolsEngine, ToolResult } from "./tools";

export interface AIChatMessage {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  toolUsed?: string;
  toolTrace?: string[];
  embeddedJobs?: any[];
  data?: any;
}

export class AIService {
  private getProvider(): "gemini" | "openai" | "demo" {
    const provider = process.env.AI_PROVIDER || "demo";
    if (provider === "gemini" && process.env.GEMINI_API_KEY) return "gemini";
    if (provider === "openai" && process.env.OPENAI_API_KEY) return "openai";
    return "demo";
  }

  async generateChatResponse(
    messages: AIChatMessage[],
    userProfile?: any,
    attachedContext?: any
  ): Promise<ToolResult> {
    const lastUserMsg = messages.filter((m) => m.role === "user").pop()?.content || "";
    const lower = lastUserMsg.toLowerCase().trim();

    // 1. Tool Routing Logic based on Intent Analysis
    if (lower.includes("email") || lower.includes("write an email") || lower.includes("create email") || lower.includes("application email")) {
      let jobTitle = "Python Developer";
      if (lower.includes("full stack")) jobTitle = "Full Stack AI Engineer";
      if (lower.includes("frontend")) jobTitle = "Frontend Developer";
      return agentToolsEngine.generateApplicationEmailTool(jobTitle, userProfile);
    }

    if (lower.includes("interview") || lower.includes("mock") || lower.includes("prepare me")) {
      return agentToolsEngine.startInterview(lower.includes("answer") || messages.length > 2 ? 1 : 1, lastUserMsg);
    }

    if (lower.includes("find job") || lower.includes("jobs") || lower.includes("search job") || lower.includes("hiring")) {
      let location = undefined;
      if (lower.includes("ahmedabad")) location = "Ahmedabad";
      else if (lower.includes("bangalore")) location = "Bangalore";
      else if (lower.includes("pune")) location = "Pune";
      else if (lower.includes("remote")) location = "Remote";
      else if (lower.includes("mumbai")) location = "Mumbai";
      else if (lower.includes("hyderabad")) location = "Hyderabad";

      let salaryMin = undefined;
      if (lower.includes("8 lpa") || lower.includes("under 8")) salaryMin = 4.0;
      if (lower.includes("10 lpa") || lower.includes("10+")) salaryMin = 10.0;
      if (lower.includes("15 lpa") || lower.includes("15+")) salaryMin = 15.0;

      return agentToolsEngine.searchJobs(lastUserMsg, { location, salaryMin }, userProfile);
    }

    if (lower.includes("weakness") || lower.includes("resume") || lower.includes("cv") || lower.includes("ats")) {
      return agentToolsEngine.analyzeResume(undefined, userProfile);
    }

    if (lower.includes("match") || lower.includes("good fit") || lower.includes("should i apply for this")) {
      return agentToolsEngine.matchResumeToJob(attachedContext?.jobId || "job-1");
    }

    if (lower.includes("company") || lower.includes("infosys") || lower.includes("tcs") || lower.includes("google") || lower.includes("razorpay") || lower.includes("swiggy")) {
      let compName = "Infosys";
      if (lower.includes("razorpay")) compName = "Razorpay";
      if (lower.includes("swiggy")) compName = "Swiggy";
      if (lower.includes("tcs")) compName = "TCS";
      if (lower.includes("google")) compName = "Google India";
      if (lower.includes("technova")) compName = "TechNova Solutions";
      return agentToolsEngine.researchCompany(compName);
    }

    if (lower.includes("move") || lower.includes("update status") || lower.includes("status to")) {
      let newStat = "INTERVIEW";
      if (lower.includes("applied")) newStat = "APPLIED";
      if (lower.includes("offer")) newStat = "OFFER";
      if (lower.includes("screening")) newStat = "SCREENING";
      return agentToolsEngine.updateApplicationStatus("TechNova", newStat, "Updated status via AI Assistant");
    }

    if (lower.includes("applied") || lower.includes("applications") || lower.includes("my status")) {
      return agentToolsEngine.getApplications();
    }

    if (lower.includes("gap") || lower.includes("missing skills")) {
      return agentToolsEngine.analyzeSkillGap();
    }

    if (lower.includes("roadmap") || lower.includes("months") || lower.includes("plan")) {
      return agentToolsEngine.generateCareerRoadmap();
    }

    // Default Fallback to Career Advisor
    return agentToolsEngine.careerAdvisor(lastUserMsg, userProfile);
  }
}

export const aiService = new AIService();
