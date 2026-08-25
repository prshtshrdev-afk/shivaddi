import { NextRequest, NextResponse } from "next/server";
import { getGmailClient } from "@/lib/googleAuth";

export async function GET(request: NextRequest) {
  const refreshToken = request.headers.get("x-gmail-refresh-token");

  if (!refreshToken) {
    return NextResponse.json(
      { error: "Missing x-gmail-refresh-token header." },
      { status: 401 },
    );
  }

  try {
    const gmail = await getGmailClient(refreshToken);

    const res = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
    });

    const messages = res.data.messages ?? [];

    // Fetch full headers for each message in parallel.
    const detailed = await Promise.all(
      messages.map(async (msg) => {
        if (!msg.id) return null;
        const full = await gmail.users.messages.get({
          userId: "me",
          id: msg.id,
          format: "metadata",
          metadataHeaders: ["From", "To", "Subject", "Date"],
        });
        const headers = full.data.payload?.headers ?? [];
        const get = (name: string) =>
          headers.find((h) => h.name === name)?.value ?? "";
        return {
          id: msg.id,
          threadId: msg.threadId,
          from: get("From"),
          to: get("To"),
          subject: get("Subject"),
          date: get("Date"),
          snippet: full.data.snippet ?? "",
        };
      }),
    );

    return NextResponse.json({
      messages: detailed.filter(Boolean),
      total: res.data.resultSizeEstimate ?? 0,
    });
  } catch (err) {
    console.error("[gmail/list] Error:", err);
    return NextResponse.json(
      {
        error:
          "Failed to fetch Gmail messages. The refresh token may be revoked.",
      },
      { status: 500 },
    );
  }
}
