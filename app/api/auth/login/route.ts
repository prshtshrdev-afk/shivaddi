import { NextResponse } from "next/server";
import { createOAuth2Client, gmailEnvConfigured } from "@/lib/googleAuth";

const GMAIL_SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
];

export async function GET() {
  if (!gmailEnvConfigured()) {
    return NextResponse.json(
      { error: "Gmail OAuth is not configured on the server." },
      { status: 500 },
    );
  }

  const oauth2Client = createOAuth2Client();

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: GMAIL_SCOPES,
  });

  return NextResponse.redirect(authUrl);
}
