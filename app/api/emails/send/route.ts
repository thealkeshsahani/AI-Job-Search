import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getEmailProvider } from "@/lib/email/provider";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      jobId,
      jobTitle,
      companyName,
      recipient,
      subject,
      emailBody,
      attachment,
      ignoreDuplicateWarning = false,
      isDraftOnly = false,
    } = body;

    if (!jobTitle || !companyName || !recipient || !subject || !emailBody) {
      return NextResponse.json(
        { success: false, error: "Missing required email fields (jobTitle, companyName, recipient, subject, emailBody)." },
        { status: 400 }
      );
    }

    const userId = "user_default";
    const dailyLimit = parseInt(process.env.DAILY_EMAIL_LIMIT || "20", 10);

    // 1. Check Daily Send Limit (for non-draft sends)
    if (!isDraftOnly) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const countToday = await prisma.applicationEmail.count({
        where: {
          userId,
          createdAt: { gte: startOfDay },
          status: { in: ["SENT", "DEMO_SENT"] },
        },
      });

      if (countToday >= dailyLimit) {
        return NextResponse.json(
          {
            success: false,
            error: "DAILY_LIMIT_REACHED",
            message: `Daily application email limit reached (${dailyLimit} emails/day). You can continue preparing drafts.`,
            usedToday: countToday,
            dailyLimit,
          },
          { status: 429 }
        );
      }
    }

    // 2. Anti-Spam & Duplicate Check (if not ignored)
    if (!ignoreDuplicateWarning && !isDraftOnly) {
      const existingEmail = await prisma.applicationEmail.findFirst({
        where: {
          userId,
          companyName,
          recipient,
          status: { in: ["SENT", "DEMO_SENT"] },
        },
        orderBy: { createdAt: "desc" },
      });

      if (existingEmail) {
        return NextResponse.json({
          success: false,
          error: "DUPLICATE_APPLICATION_WARNING",
          message: `You already contacted ${companyName} (${recipient}) about this position.`,
          previousEmail: existingEmail,
        });
      }
    }

    // 3. Save as Draft if requested
    if (isDraftOnly) {
      const draftRecord = await prisma.applicationEmail.create({
        data: {
          userId,
          jobId: jobId || null,
          companyName,
          jobTitle,
          recipient,
          subject,
          body: emailBody,
          attachment: attachment || "Resume_Rahul_Sharma.pdf",
          provider: "DEMO",
          status: "DRAFT",
        },
      });

      return NextResponse.json({
        success: true,
        data: draftRecord,
        message: "Email saved as draft successfully.",
      });
    }

    // 4. Send via Active Email Provider
    const provider = getEmailProvider();
    const sendResult = await provider.sendEmail({
      to: recipient,
      subject,
      body: emailBody,
      companyName,
      jobTitle,
      jobId,
      userId,
    });

    const emailStatus = sendResult.success ? sendResult.status : "FAILED";

    // 5. Store in ApplicationEmail database table
    const emailRecord = await prisma.applicationEmail.create({
      data: {
        userId,
        jobId: jobId || null,
        companyName,
        jobTitle,
        recipient,
        subject,
        body: emailBody,
        attachment: attachment || "Resume_Rahul_Sharma.pdf",
        provider: sendResult.provider,
        status: emailStatus,
        sentAt: sendResult.success ? new Date() : null,
      },
    });

    // 6. Automatically sync/update Application Tracker table
    if (sendResult.success) {
      const trackerStatus = sendResult.status === "DEMO_SENT" ? "DEMO_SENT" : "APPLIED";
      
      // Check if application record exists
      const existingApp = await prisma.application.findFirst({
        where: { jobId, companyName },
      });

      if (existingApp) {
        await prisma.application.update({
          where: { id: existingApp.id },
          data: {
            status: trackerStatus,
            appliedDate: new Date().toISOString().split("T")[0],
            notes: `Application email sent via ${sendResult.provider} (${recipient})`,
          },
        });
      } else {
        await prisma.application.create({
          data: {
            jobId: jobId || null,
            jobTitle,
            companyName,
            location: "Bangalore",
            salary: "₹6–10 LPA",
            status: trackerStatus,
            appliedDate: new Date().toISOString().split("T")[0],
            notes: `Application email sent via ${sendResult.provider} (${recipient})`,
          },
        });
      }
    }

    if (!sendResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "SEND_FAILED",
          message: sendResult.error || "We couldn't send the email.",
          emailRecord,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: emailRecord,
      sendResult,
    });
  } catch (error: any) {
    console.error("[Send Email API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email." },
      { status: 500 }
    );
  }
}
