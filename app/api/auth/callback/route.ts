import { NextRequest, NextResponse } from "next/server";
import { createOAuth2Client, gmailEnvConfigured } from "@/lib/googleAuth";

export async function GET(request: NextRequest) {
  if (!gmailEnvConfigured()) {
    return NextResponse.json(
      { error: "Gmail OAuth is not configured on the server." },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.json(
      { error: `Google authorization denied: ${error}` },
      { status: 400 },
    );
  }

  if (!code) {
    return NextResponse.json(
      { error: "Missing authorization code in callback." },
      { status: 400 },
    );
  }

  try {
    const oauth2Client = createOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.refresh_token) {
      return NextResponse.json(
        {
          error:
            "No refresh token returned. Ensure prompt=consent and access_type=offline are set, and that this is a fresh consent (not re-consenting with the same Google account).",
        },
        { status: 400 },
      );
    }

    // ──────────────────────────────────────────────────────────────────
    // SECURELY PERSIST THE REFRESH TOKEN
    //
    // Replace the placeholder below with your actual database logic.
    // Example with Prisma:
    //
    //   import { prisma } from "@/lib/prisma";
    //
    //   await prisma.user.update({
    //     where: { id: currentUserId },
    //     data: {
    //       gmailRefreshToken: tokens.refresh_token,
    //       gmailAccessToken: tokens.access_token ?? null,
    //       gmailTokenExpiry: tokens.expiry_date
    //         ? new Date(tokens.expiry_date)
    //         : null,
    //     },
    //   });
    //
    // SECURITY NOTES:
    // • Never log or return the refresh token to the client.
    // • Encrypt the token at rest if your DB is not encrypted.
    // • Restrict access to the column in your DB IAM policy.
    // ──────────────────────────────────────────────────────────────────
    console.log(
      "[callback] Received refresh_token:",
      tokens.refresh_token.slice(0, 8) + "...",
    );
    console.log("[callback] PERSIST THIS TOKEN SECURELY IN YOUR DATABASE.");

    return NextResponse.json({
      success: true,
      message: "Gmail OAuth authorization successful. Refresh token stored.",
    });
  } catch (err) {
    console.error("[callback] Token exchange failed:", err);
    return NextResponse.json(
      { error: "Failed to exchange authorization code for tokens." },
      { status: 500 },
    );
  }
}
