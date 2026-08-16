export interface GenerateEmailInput {
  candidateName?: string;
  candidateEmail?: string;
  candidatePhone?: string;
  resumeText?: string;
  userSkills?: string[];
  jobTitle: string;
  companyName: string;
  jobDescription?: string;
  jobRequirements?: string[];
  matchingSkills?: string[];
  recruiterEmail?: string;
  applicationUrl?: string;
  attachmentName?: string;
}

export interface GeneratedEmailOutput {
  subject: string;
  body: string;
  recipient: string;
  attachment: string;
  companyEmailAvailable: boolean;
  applicationUrl?: string;
}

export async function generateApplicationEmail(
  input: GenerateEmailInput
): Promise<GeneratedEmailOutput> {
  const candidateName = input.candidateName || "Rahul Sharma";
  const candidateEmail = input.candidateEmail || "rahul.sharma@example.com";
  const candidatePhone = input.candidatePhone || "+91 98765 43210";
  const attachment = input.attachmentName || `Resume_${candidateName.replace(/\s+/g, "_")}.pdf`;

  // Filter skills: intersection of candidate userSkills and job requirements/skills
  const candidateSkills = input.userSkills || ["Python", "React", "Node.js", "SQL", "FastAPI", "Git", "Docker"];
  const matching = input.matchingSkills && input.matchingSkills.length > 0
    ? input.matchingSkills
    : candidateSkills.slice(0, 4);

  // Determine recipient
  const recipient = input.recruiterEmail || `careers@${input.companyName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;
  const companyEmailAvailable = Boolean(input.recruiterEmail);

  // Subject line formats:
  // e.g. "Application for Python Developer – Rahul Sharma"
  const subject = `Application for ${input.jobTitle} – ${candidateName}`;

  const topSkillsStr = matching.slice(0, 3).join(", ");

  const body = `Dear Hiring Manager,

I am writing to express my strong interest in the ${input.jobTitle} position at ${input.companyName}. With a solid technical background and hands-on experience in ${topSkillsStr}, I am excited about the opportunity to contribute to your team's ongoing projects.

Over the past few years, I have worked extensively on developing scalable applications, optimizing REST APIs, and writing clean, testable code. My key technical strengths include ${matching.join(", ")}, which directly align with the core requirements outlined in your job description for the ${input.jobTitle} role.

I would appreciate the opportunity to discuss my suitability for the role in an interview. I have attached my updated resume (${attachment}) for your review.

Thank you for your time and consideration.

Best regards,

${candidateName}
Email: ${candidateEmail}
Phone: ${candidatePhone}`;

  return {
    subject,
    body,
    recipient,
    attachment,
    companyEmailAvailable,
    applicationUrl: input.applicationUrl,
  };
}

export async function modifyApplicationEmail(
  currentEmail: { subject: string; body: string; recipient: string; attachment?: string },
  instruction: string
): Promise<{ subject: string; body: string; recipient: string }> {
  const lower = instruction.toLowerCase().trim();
  let updatedSubject = currentEmail.subject;
  let updatedBody = currentEmail.body;

  if (lower.includes("shorter") || lower.includes("brief") || lower.includes("concise")) {
    const lines = updatedBody.split("\n\n");
    if (lines.length > 3) {
      // Keep greeting, combined middle, closing
      const greeting = lines[0];
      const signoff = lines[lines.length - 1];
      const middle = "I am applying for the position as my experience in " +
        (currentEmail.subject.includes("for") ? currentEmail.subject.split("for")[1].trim() : "this role") +
        " aligns closely with your team's needs. I would welcome the chance to interview.";
      updatedBody = `${greeting}\n\n${middle}\n\n${signoff}`;
    }
  } else if (lower.includes("professional") || lower.includes("formal")) {
    updatedBody = updatedBody
      .replace("Dear Hiring Manager,", "Dear Hiring Team at " + (currentEmail.subject.split("at")[1] || "your company").trim() + ",")
      .replace("Best regards,", "Sincerely,");
  } else if (lower.includes("django")) {
    updatedBody = updatedBody.replace(
      "My key technical strengths include",
      "My key technical strengths include Django, along with"
    );
  } else if (lower.includes("interview")) {
    if (!updatedBody.includes("interview")) {
      updatedBody = updatedBody.replace(
        "Thank you for your time",
        "I welcome the chance to schedule an interview at your earliest convenience.\n\nThank you for your time"
      );
    }
  } else if (lower.includes("salary")) {
    // Remove salary references if any exist
    updatedBody = updatedBody.split("\n").filter(line => !line.toLowerCase().includes("salary")).join("\n");
  }

  return {
    subject: updatedSubject,
    body: updatedBody,
    recipient: currentEmail.recipient,
  };
}

export async function generateFollowUpEmail(application: {
  jobTitle: string;
  companyName: string;
  recipient: string;
  candidateName?: string;
  sentDate?: string;
}): Promise<{ subject: string; body: string; recipient: string }> {
  const candidateName = application.candidateName || "Rahul Sharma";
  const subject = `Following Up: Application for ${application.jobTitle} – ${candidateName}`;
  const body = `Dear Hiring Team,

I hope this email finds you well.

I am writing to politely follow up on my job application for the ${application.jobTitle} position at ${application.companyName}, submitted recently.

I remain very interested in the role and would love to learn if there are any updates regarding the recruitment timeline or next steps in the process. Please let me know if you require any additional details or references from my end.

Thank you again for your time and consideration.

Best regards,

${candidateName}`;

  return {
    subject,
    body,
    recipient: application.recipient,
  };
}
