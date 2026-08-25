import { google, gmail_v1 } from "googleapis";
import { OAuth2Client } from "google-auth-library";

const GMAIL_SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
];

/**
 * Creates an authenticated OAuth2Client with tokens set from the stored
 * refresh token. Automatically handles token refresh when expired.
 */
export function createOAuth2Client(): OAuth2Client {
  return new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI,
  );
}

/**
 * Returns an authenticated Gmail API client ready to make requests.
 *
 * @param refreshToken - The stored OAuth2 refresh token for the user.
 * @returns An authenticated gmail_v1.Gmail instance.
 */
export async function getGmailClient(
  refreshToken: string,
): Promise<gmail_v1.Gmail> {
  const oauth2Client = createOAuth2Client();

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  // Listen for token refresh events to persist new tokens if needed.
  oauth2Client.on("tokens", (tokens) => {
    if (tokens.refresh_token) {
      // ────────────────────────────────────────────────────────────────
      // PERSIST UPDATED REFRESH TOKEN
      // If Google issues a new refresh token, save it to your database
      // here. Example:
      //
      //   await prisma.user.update({
      //     where: { id: userId },
      //     data: { gmailRefreshToken: tokens.refresh_token },
      //   });
      //
      // For most flows the refresh token does not change, but Google
      // may rotate it on re-consent. Handle it defensively.
      // ────────────────────────────────────────────────────────────────
      console.log("[googleAuth] New refresh_token received – persist it.");
    }
    // Access tokens are short-lived and auto-refreshed by the library.
    if (tokens.access_token) {
      console.log("[googleAuth] Access token refreshed.");
    }
  });

  // Force a token refresh to verify credentials are valid.
  // This will throw if the refresh token is revoked or invalid.
  await oauth2Client.getAccessToken();

  return google.gmail({ version: "v1", auth: oauth2Client });
}

/**
 * Helper: validates that required Gmail OAuth env vars are present.
 */
export function gmailEnvConfigured(): boolean {
  return Boolean(
    process.env.GMAIL_CLIENT_ID &&
      process.env.GMAIL_CLIENT_SECRET &&
      process.env.GMAIL_REDIRECT_URI,
  );
}
