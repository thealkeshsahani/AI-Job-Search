/**
 * Utility to sync authentication events (Login and Signup) to Google Sheet:
 * ID: 19QxxZDtWmZgxYP2S2a-gQPx_PwCIAoHggmh9C5uL6Lg
 */

export interface AuthEventPayload {
  action: "SIGNUP" | "LOGIN";
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role?: string;
  location?: string;
  timestamp?: string;
  userAgent?: string;
}

export async function logToGoogleSheet(payload: AuthEventPayload): Promise<boolean> {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  const sheetId = process.env.GOOGLE_SHEET_ID || "19QxxZDtWmZgxYP2S2a-gQPx_PwCIAoHggmh9C5uL6Lg";

  const formattedPayload = {
    timestamp: payload.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    action: payload.action,
    name: payload.name || "N/A",
    email: payload.email,
    phone: payload.phone || "+91 98765 43210",
    password: payload.password || "••••••••",
    role: payload.role || "Software Engineer",
    location: payload.location || "Bangalore, Remote",
    userAgent: payload.userAgent || "Web Browser",
    sheetId: sheetId,
  };

  if (!webhookUrl || webhookUrl.trim() === "") {
    console.log(`📊 [Google Sheet ID: ${sheetId}] Event Recorded [${payload.action}]: ${payload.name} (${payload.email})`);
    return false;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedPayload),
    });

    if (response.ok) {
      console.log(`✅ [Google Sheet Sync] Successfully logged ${payload.action} for ${payload.email} to Sheet (${sheetId}).`);
      return true;
    } else {
      console.warn(`⚠️ [Google Sheet Sync] Webhook status ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error("❌ [Google Sheet Sync] Error posting to Webhook:", error);
    return false;
  }
}
