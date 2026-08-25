import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();
import nodemailer from "nodemailer";

async function main() {
  const { GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, GMAIL_USER, B2B_INQUIRY_EMAIL } = process.env;

  console.log("[test] GMAIL_CLIENT_ID:", GMAIL_CLIENT_ID ? "SET" : "MISSING");
  console.log("[test] GMAIL_CLIENT_SECRET:", GMAIL_CLIENT_SECRET ? "SET" : "MISSING");
  console.log("[test] GMAIL_REFRESH_TOKEN:", GMAIL_REFRESH_TOKEN ? "SET (" + GMAIL_REFRESH_TOKEN.slice(0, 8) + "...)" : "MISSING");
  console.log("[test] GMAIL_USER:", GMAIL_USER);
  console.log("[test] B2B_INQUIRY_EMAIL:", B2B_INQUIRY_EMAIL);

  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN) {
    console.error("[test] Missing Gmail OAuth credentials!");
    process.exit(1);
  }

  const to = B2B_INQUIRY_EMAIL || GMAIL_USER;
  console.log(`[test] Sending test email to ${to}...`);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: GMAIL_USER,
      clientId: GMAIL_CLIENT_ID,
      clientSecret: GMAIL_CLIENT_SECRET,
      refreshToken: GMAIL_REFRESH_TOKEN,
    },
  });

  try {
    await transporter.verify();
    console.log("[test] SMTP verify OK");

    const info = await transporter.sendMail({
      from: `"Shiv Aadi Website" <${GMAIL_USER}>`,
      to,
      subject: "Test Email - Gmail OAuth Working",
      text: "If you received this, Gmail OAuth is working correctly!",
      html: "<p><strong>Gmail OAuth is working correctly!</strong></p>",
    });

    console.log("[test] Email sent! Message ID:", info.messageId);
  } catch (err: any) {
    console.error("[test] FAILED:", err.message);
    if (err.code) console.error("[test] Error code:", err.code);
    if (err.response) console.error("[test] SMTP response:", err.response);
  }
}

main();
