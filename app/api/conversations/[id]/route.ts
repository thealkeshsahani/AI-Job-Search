import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ success: false, error: "Conversation not found" }, { status: 404 });
    }

    // Parse toolTrace and data JSON strings for messages
    const formattedMessages = conversation.messages.map((m) => ({
      ...m,
      toolTrace: m.toolTrace ? JSON.parse(m.toolTrace) : undefined,
      embeddedJobs: m.data ? JSON.parse(m.data).embeddedJobs : undefined,
      data: m.data ? JSON.parse(m.data) : undefined,
    }));

    return NextResponse.json({
      success: true,
      data: {
        ...conversation,
        messages: formattedMessages,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch conversation." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title } = body;

    const updated = await prisma.conversation.update({
      where: { id },
      data: { title },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to rename conversation." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.conversation.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Conversation deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete conversation." },
      { status: 500 }
    );
  }
}
