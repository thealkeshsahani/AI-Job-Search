import { NextRequest, NextResponse } from "next/server";
import { aiService } from "@/lib/ai/service";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, conversationId, attachedContext } = body;

    let userProfile = null;
    try {
      userProfile = await prisma.userProfile.findUnique({ where: { id: "user_default" } });
    } catch {
      // ignore
    }

    // Retrieve active conversation or create new thread
    let activeConversationId = conversationId;
    if (!activeConversationId) {
      const firstQuery = messages.filter((m: any) => m.role === "user")[0]?.content || "Career Strategy";
      const shortTitle = firstQuery.length > 30 ? firstQuery.slice(0, 30) + "..." : firstQuery;

      const newConv = await prisma.conversation.create({
        data: {
          userId: "user_default",
          title: shortTitle,
        },
      });
      activeConversationId = newConv.id;
    }

    const lastUserMessage = messages.filter((m: any) => m.role === "user").pop();

    // Persist User Message to DB
    if (lastUserMessage && activeConversationId) {
      await prisma.message.create({
        data: {
          conversationId: activeConversationId,
          role: "user",
          content: lastUserMessage.content,
        },
      });
    }

    // Generate AI Response with Agent Tools Engine
    const toolResult = await aiService.generateChatResponse(messages || [], userProfile, attachedContext);

    // Persist Assistant Message to DB
    let assistantMsgRecord = null;
    if (activeConversationId) {
      assistantMsgRecord = await prisma.message.create({
        data: {
          conversationId: activeConversationId,
          role: "assistant",
          content: toolResult.responseText,
          toolUsed: toolResult.toolName,
          toolTrace: JSON.stringify(toolResult.toolTrace),
          data: JSON.stringify({
            embeddedJobs: toolResult.embeddedJobs || null,
            data: toolResult.data || null,
          }),
        },
      });

      // Touch parent conversation updatedAt
      await prisma.conversation.update({
        where: { id: activeConversationId },
        data: { updatedAt: new Date() },
      });
    }

    return NextResponse.json({
      success: true,
      conversationId: activeConversationId,
      message: {
        id: assistantMsgRecord?.id,
        role: "assistant",
        content: toolResult.responseText,
        toolUsed: toolResult.toolName,
        toolTrace: toolResult.toolTrace,
        embeddedJobs: toolResult.embeddedJobs,
        data: toolResult.data,
      },
    });
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return NextResponse.json(
      { success: false, error: "AI Assistant encountered an error." },
      { status: 500 }
    );
  }
}
