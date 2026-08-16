import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { generateFollowUpEmail } from "@/lib/email/generator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { emailId } = body;

    if (!emailId) {
      return NextResponse.json(
        { success: false, error: "emailId is required." },
        { status: 400 }
      );
    }

    const emailRecord = await prisma.applicationEmail.findUnique({
      where: { id: emailId },
    });

    if (!emailRecord) {
      return NextResponse.json(
        { success: false, error: "Email record not found." },
        { status: 404 }
      );
    }

    const profile = await prisma.userProfile.findFirst();

    const followup = await generateFollowUpEmail({
      jobTitle: emailRecord.jobTitle,
      companyName: emailRecord.companyName,
      recipient: emailRecord.recipient,
      candidateName: profile?.name || "Rahul Sharma",
      sentDate: emailRecord.sentAt ? new Date(emailRecord.sentAt).toLocaleDateString() : undefined,
    });

    return NextResponse.json({
      success: true,
      data: followup,
    });
  } catch (error: any) {
    console.error("[Followup Email API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate follow-up email." },
      { status: 500 }
    );
  }
}
