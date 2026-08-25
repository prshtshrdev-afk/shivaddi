/**
 * SHIV AADI — one-time Gmail OAuth2 authorization.
 * Opens Google consent, captures code on localhost, prints GMAIL_REFRESH_TOKEN.
 * Run via: npm run gmail:auth
 *
 * Requires in .env.local:
 *   GMAIL_CLIENT_ID / GMAIL_CLIENT_SECRET (from Google Cloud Console OAuth client)
 * And the OAuth client must have redirect URI: http://localhost:3333/oauth2callback
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config(); // fall back to .env
import http from "http";
import { exec } from "child_process";

const REDIRECT_URI = "http://localhost:3333/oauth2callback";
const SCOPE = "https://mail.google.com/"; // required for SMTP XOAUTH2

async function main() {
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    console.error(
      "[gmail:auth] Missing GMAIL_CLIENT_ID / GMAIL_CLIENT_SECRET in .env.local",
    );
    process.exit(1);
  }

  const authUrl = new URL("https://accounts.google.com/o/oauth2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", SCOPE);
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");

  const server = http.createServer((req, res) => {
    const url = new URL(req.url || "/", REDIRECT_URI);
    if (url.pathname !== "/oauth2callback") {
      res.writeHead(404).end();
      return;
    }
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");
    if (error || !code) {
      res.writeHead(400, { "Content-Type": "text/html" });
      res.end(`<h3>Authorization failed: ${error ?? "no code"}</h3>`);
      console.error("[gmail:auth] Failed:", error);
      process.exit(1);
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h3>Authorized! You can close this tab.</h3>");

    void fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    })
      .then((r) => r.json() as Promise<Record<string, string>>)
      .then((tokens) => {
        if (tokens.error || !tokens.refresh_token) {
          console.error("[gmail:auth] Token exchange failed:", tokens);
          process.exit(1);
        }
        console.log("\n=== Add these to .env.local AND your Coolify environment ===\n");
        console.log(`GMAIL_CLIENT_ID=${clientId}`);
        console.log(`GMAIL_CLIENT_SECRET=${clientSecret}`);
        console.log(`GMAIL_REFRESH_TOKEN=${tokens.refresh_token}\n`);
        server.close();
        process.exit(0);
      });
  });

  server.listen(3333, () => {
    console.log("[gmail:auth] Opening browser for Google consent...");
    console.log("(If it does not open, visit the URL below)\n\n" + authUrl.toString() + "\n");
    exec(`start "" "${authUrl.toString()}"`);
  });
}

main().catch((err) => {
  console.error("[gmail:auth] FAILED:", err instanceof Error ? err.message : err);
  process.exit(1);
});
