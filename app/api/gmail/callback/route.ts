/**
 * Gmail OAuth2 Callback Route
 *
 * This route handles the OAuth2 callback from Google.
 * After user grants permission, Google redirects here with the authorization code.
 * We exchange the code for tokens and display the refresh token to the user.
 *
 * Setup:
 * 1. Add this URL to Google Cloud Console > OAuth 2.0 Client > Authorized redirect URIs:
 *    https://shivaadimithilatileshouse.com/api/gmail/callback
 * 2. Visit: https://shivaadimithilatileshouse.com/api/gmail/callback?action=auth
 */
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL || "https://shivaadimithilatileshouse.com"}/api/gmail/callback`;

  // Step 1: Generate authorization URL and redirect to Google
  if (action === "auth") {
    if (!clientId) {
      return NextResponse.json({ error: "Missing GMAIL_CLIENT_ID" }, { status: 500 });
    }

    const authUrl = new URL("https://accounts.google.com/o/oauth2/auth");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", "https://mail.google.com/");
    authUrl.searchParams.set("access_type", "offline");
    authUrl.searchParams.set("prompt", "consent");

    return NextResponse.redirect(authUrl.toString());
  }

  // Step 2: Handle callback from Google
  if (error) {
    return NextResponse.json({ error: `Authorization failed: ${error}` }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: "No authorization code received" }, { status: 400 });
  }

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "Missing Gmail credentials" }, { status: 500 });
  }

  try {
    // Exchange authorization code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenResponse.json() as Record<string, string>;

    if (tokens.error || !tokens.refresh_token) {
      return NextResponse.json({
        error: "Token exchange failed",
        details: tokens.error_description || tokens.error,
      }, { status: 500 });
    }

    // Return the refresh token to display to user
    return NextResponse.json({
      success: true,
      message: "Gmail OAuth successful! Copy the refresh token below.",
      refresh_token: tokens.refresh_token,
      instructions: [
        "1. Copy the refresh_token value above",
        "2. Add it to your .env.local file:",
        `   GMAIL_REFRESH_TOKEN=${tokens.refresh_token}`,
        "3. Add it to your Coolify/production environment variables",
        "4. Restart your application",
      ].join("\n"),
    });

  } catch (err) {
    return NextResponse.json({
      error: "Failed to exchange authorization code",
      details: err instanceof Error ? err.message : "Unknown error",
    }, { status: 500 });
  }
}