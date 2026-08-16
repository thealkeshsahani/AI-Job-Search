export interface EmailAttachment {
  filename: string;
  content?: string;
  path?: string;
  contentType?: string;
}

export interface EmailSendParams {
  to: string;
  subject: string;
  body: string;
  attachments?: EmailAttachment[];
  userId?: string;
  companyName: string;
  jobTitle: string;
  jobId?: string;
}

export interface EmailSendResult {
  success: boolean;
  status: "SENT" | "DEMO_SENT" | "FAILED";
  messageId?: string;
  provider: "GMAIL" | "OUTLOOK" | "RESEND" | "DEMO";
  error?: string;
}

export interface EmailProvider {
  name: string;
  sendEmail(params: EmailSendParams): Promise<EmailSendResult>;
}

// 1. Demo Email Provider (Default fallback)
export class DemoEmailProvider implements EmailProvider {
  name = "DemoEmailProvider";

  async sendEmail(params: EmailSendParams): Promise<EmailSendResult> {
    console.log(`[DemoEmailProvider] Generating simulated email dispatch to: ${params.to}`);
    console.log(`[DemoEmailProvider] Subject: ${params.subject}`);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      success: true,
      status: "DEMO_SENT",
      messageId: `demo-msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      provider: "DEMO",
    };
  }
}

// 2. Resend Email Provider
export class ResendProvider implements EmailProvider {
  name = "ResendProvider";
  private apiKey: string;
  private fromEmail: string;

  constructor(apiKey: string, fromEmail?: string) {
    this.apiKey = apiKey;
    this.fromEmail = fromEmail || "CareerPilot AI <applications@resend.dev>";
  }

  async sendEmail(params: EmailSendParams): Promise<EmailSendResult> {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: this.fromEmail,
          to: [params.to],
          subject: params.subject,
          text: params.body,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Resend API error");
      }

      return {
        success: true,
        status: "SENT",
        messageId: data.id,
        provider: "RESEND",
      };
    } catch (error: any) {
      console.error("[ResendProvider Error]:", error);
      return {
        success: false,
        status: "FAILED",
        provider: "RESEND",
        error: error.message || "Failed to send email via Resend",
      };
    }
  }
}

// 3. Gmail OAuth Provider Abstraction
export class GmailProvider implements EmailProvider {
  name = "GmailProvider";
  private clientId: string;
  private clientSecret: string;
  private refreshToken: string;
  private userEmail: string;

  constructor(clientId: string, clientSecret: string, refreshToken: string, userEmail: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.refreshToken = refreshToken;
    this.userEmail = userEmail;
  }

  async sendEmail(params: EmailSendParams): Promise<EmailSendResult> {
    try {
      // Refresh access token via Google OAuth2 token endpoint
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: this.refreshToken,
          grant_type: "refresh_token",
        }),
      });

      const tokenData = await tokenRes.json();
      if (!tokenRes.ok || !tokenData.access_token) {
        throw new Error(tokenData.error_description || "Gmail OAuth token refresh failed");
      }

      const accessToken = tokenData.access_token;

      // Construct raw MIME email
      const rawEmail = [
        `From: ${this.userEmail}`,
        `To: ${params.to}`,
        `Subject: ${params.subject}`,
        `Content-Type: text/plain; charset=utf-8`,
        ``,
        params.body,
      ].join("\r\n");

      // Base64url encode the raw message
      const encodedMessage = Buffer.from(rawEmail)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      const sendRes = await fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ raw: encodedMessage }),
        }
      );

      const sendData = await sendRes.json();
      if (!sendRes.ok) {
        throw new Error(sendData.error?.message || "Gmail send API failed");
      }

      return {
        success: true,
        status: "SENT",
        messageId: sendData.id,
        provider: "GMAIL",
      };
    } catch (error: any) {
      console.error("[GmailProvider Error]:", error);
      return {
        success: false,
        status: "FAILED",
        provider: "GMAIL",
        error: error.message || "Failed to send email via Gmail OAuth",
      };
    }
  }
}

// 4. Outlook / Microsoft Graph Provider Abstraction
export class OutlookProvider implements EmailProvider {
  name = "OutlookProvider";
  private clientId: string;
  private clientSecret: string;
  private refreshToken: string;
  private userEmail: string;

  constructor(clientId: string, clientSecret: string, refreshToken: string, userEmail: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.refreshToken = refreshToken;
    this.userEmail = userEmail;
  }

  async sendEmail(params: EmailSendParams): Promise<EmailSendResult> {
    try {
      const tokenRes = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: this.refreshToken,
          grant_type: "refresh_token",
          scope: "https://graph.microsoft.com/Mail.Send offline_access",
        }),
      });

      const tokenData = await tokenRes.json();
      if (!tokenRes.ok || !tokenData.access_token) {
        throw new Error(tokenData.error_description || "Outlook OAuth token refresh failed");
      }

      const accessToken = tokenData.access_token;

      const messagePayload = {
        message: {
          subject: params.subject,
          body: {
            contentType: "Text",
            content: params.body,
          },
          toRecipients: [
            {
              emailAddress: {
                address: params.to,
              },
            },
          ],
        },
        saveToSentItems: "true",
      };

      const sendRes = await fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messagePayload),
      });

      if (!sendRes.ok) {
        const errData = await sendRes.json().catch(() => ({}));
        throw new Error(errData.error?.message || "Microsoft Graph sendMail failed");
      }

      return {
        success: true,
        status: "SENT",
        messageId: `ms-graph-${Date.now()}`,
        provider: "OUTLOOK",
      };
    } catch (error: any) {
      console.error("[OutlookProvider Error]:", error);
      return {
        success: false,
        status: "FAILED",
        provider: "OUTLOOK",
        error: error.message || "Failed to send email via Outlook OAuth",
      };
    }
  }
}

// 5. Factory helper to select active provider
export function getEmailProvider(): EmailProvider {
  // Check Resend
  if (process.env.RESEND_API_KEY) {
    return new ResendProvider(process.env.RESEND_API_KEY, process.env.RESEND_FROM_EMAIL);
  }

  // Check Gmail
  if (
    process.env.GMAIL_CLIENT_ID &&
    process.env.GMAIL_CLIENT_SECRET &&
    process.env.GMAIL_REFRESH_TOKEN &&
    process.env.GMAIL_USER_EMAIL
  ) {
    return new GmailProvider(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GMAIL_REFRESH_TOKEN,
      process.env.GMAIL_USER_EMAIL
    );
  }

  // Check Outlook
  if (
    process.env.OUTLOOK_CLIENT_ID &&
    process.env.OUTLOOK_CLIENT_SECRET &&
    process.env.OUTLOOK_REFRESH_TOKEN &&
    process.env.OUTLOOK_USER_EMAIL
  ) {
    return new OutlookProvider(
      process.env.OUTLOOK_CLIENT_ID,
      process.env.OUTLOOK_CLIENT_SECRET,
      process.env.OUTLOOK_REFRESH_TOKEN,
      process.env.OUTLOOK_USER_EMAIL
    );
  }

  // Default to Demo Email Mode
  return new DemoEmailProvider();
}
