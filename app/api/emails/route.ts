import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  try {
    const userId = "user_default";
    const dailyLimit = parseInt(process.env.DAILY_EMAIL_LIMIT || "20", 10);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const emails = await prisma.applicationEmail.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const usedToday = await prisma.applicationEmail.count({
      where: {
        userId,
        createdAt: { gte: startOfDay },
        status: { in: ["SENT", "DEMO_SENT"] },
      },
    });

    return NextResponse.json({
      success: true,
      data: emails,
      quota: {
        usedToday,
        dailyLimit,
        remainingToday: Math.max(0, dailyLimit - usedToday),
      },
    });
  } catch (error: any) {
    console.error("[Get Emails API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load email history." },
      { status: 500 }
    );
  }
}
