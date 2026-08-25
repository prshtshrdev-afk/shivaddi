/**
 * SHIV AADI — SMTP verification script
 * Sends a test email using the same transporter as lib/email.ts.
 * Run via: npm run smtp:test
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config(); // fall back to .env
import nodemailer from "nodemailer";

async function main() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, B2B_INQUIRY_EMAIL } =
    process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    console.error(
      "[smtp:test] Missing SMTP_HOST / SMTP_USER / SMTP_PASSWORD in .env.local",
    );
    process.exit(1);
  }

  const to = B2B_INQUIRY_EMAIL || SMTP_USER;
  console.log(`[smtp:test] Connecting to ${SMTP_HOST}:${SMTP_PORT} as ${SMTP_USER} ...`);

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: Number(SMTP_PORT || 587) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });

  await transporter.verify();
  console.log("[smtp:test] Connection + auth OK. Sending test email...");

  const info = await transporter.sendMail({
    from: `"Shiv Aadi Website" <${SMTP_USER}>`,
    to,
    subject: "SMTP test – Shiv Aadi B2B lead system",
    text: "If you received this, SMTP is configured correctly for B2B lead emails.",
    html: "<p>If you received this, <strong>SMTP is configured correctly</strong> for B2B lead emails.</p>",
  });

  console.log(`[smtp:test] Sent to ${to} — message id: ${info.messageId}`);
}

main().catch((err) => {
  console.error("[smtp:test] FAILED:", err instanceof Error ? err.message : err);
  process.exit(1);
});
