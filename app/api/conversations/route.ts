import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const conversations = await prisma.conversation.findMany({
      where: { userId: "user_default" },
      orderBy: { updatedAt: "desc" },
      include: {
        _count: { select: { messages: true } },
      },
    });

    return NextResponse.json({ success: true, data: conversations });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to load conversations." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title } = body;

    const conversation = await prisma.conversation.create({
      data: {
        userId: "user_default",
        title: title || "New Conversation",
      },
    });

    return NextResponse.json({ success: true, data: conversation });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create conversation." },
      { status: 500 }
    );
  }
}
