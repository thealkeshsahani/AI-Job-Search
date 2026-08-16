import { NextRequest, NextResponse } from "next/server";
import { modifyApplicationEmail } from "@/lib/email/generator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { currentEmail, instruction } = body;

    if (!currentEmail || !instruction) {
      return NextResponse.json(
        { success: false, error: "currentEmail and instruction are required." },
        { status: 400 }
      );
    }

    const modified = await modifyApplicationEmail(currentEmail, instruction);

    return NextResponse.json({
      success: true,
      data: modified,
    });
  } catch (error: any) {
    console.error("[Modify Email API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to modify application email." },
      { status: 500 }
    );
  }
}
