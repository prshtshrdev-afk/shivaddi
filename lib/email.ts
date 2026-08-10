import "server-only";

import nodemailer from "nodemailer";

export function isEmailConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASSWORD &&
      process.env.B2B_INQUIRY_EMAIL,
  );
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function wrapInTemplate(bodyHtml: string, title: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#f4f1ec;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ec;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-top:4px solid #D4AF37;border-radius:6px;overflow:hidden;">
        <tr>
          <td style="padding:28px 32px 8px;">
            <p style="margin:0 0 4px;color:#0F0F0F;font-size:22px;font-weight:bold;letter-spacing:1px;">SHIV AADI</p>
            <p style="margin:0 0 16px;color:#8a7a4d;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Mithila Tiles &amp; Marbles House</p>
            <div style="height:1px;background:#E8E0D0;margin:16px 0;"></div>
            <p style="margin:0 0 20px;color:#0F0F0F;font-size:18px;font-weight:bold;">${escapeHtml(title)}</p>
          </td>
        </tr>
        <tr><td style="padding:0 32px 28px;">${bodyHtml}</td></tr>
        <tr>
          <td style="padding:20px 32px;background:#0F0F0F;">
            <p style="margin:0;color:#D4AF37;font-size:11px;letter-spacing:1px;">SHIV AADI &bull; MITHILA TILES &amp; MARBLES HOUSE</p>
            <p style="margin:4px 0 0;color:#9a9a9a;font-size:11px;">This is an automated message from the website enquiry system.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function row(label: string, value: unknown) {
  const v = value === null || value === undefined || value === "" ? "—" : escapeHtml(value);
  return `<tr>
    <td style="padding:8px 0;color:#7a7569;font-size:12px;text-transform:uppercase;letter-spacing:.5px;width:200px;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:8px 0;color:#1a1a1a;font-size:14px;">${v}</td>
  </tr>`;
}

export type LeadEmailData = {
  name: string;
  company?: string;
  phone: string;
  email: string;
  city?: string;
  businessType: string;
  product?: string;
  quantity?: string;
  projectName?: string;
  projectLocation?: string;
  expectedDate?: string;
  message?: string;
};

export async function sendB2BInquiryEmail(data: LeadEmailData): Promise<void> {
  const to = process.env.B2B_INQUIRY_EMAIL || process.env.SMTP_USER;
  if (!isEmailConfigured() || !to) {
    console.warn("[mailer] SMTP not configured – email notification skipped.");
    return;
  }

  const body = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row("Customer", data.name)}
      ${row("Company", data.company)}
      ${row("Phone", data.phone)}
      ${row("Email", data.email)}
      ${row("City", data.city)}
      ${row("Business Type", data.businessType)}
      ${row("Product", data.product)}
      ${row("Quantity", data.quantity)}
      ${row("Project Name", data.projectName)}
      ${row("Project Location", data.projectLocation)}
      ${row("Expected Purchase Date", data.expectedDate)}
      <tr>
        <td style="padding:12px 0 4px;color:#7a7569;font-size:12px;text-transform:uppercase;letter-spacing:.5px;vertical-align:top;">Message</td>
        <td style="padding:12px 0 4px;color:#1a1a1a;font-size:14px;white-space:pre-wrap;">${escapeHtml(data.message)}</td>
      </tr>
    </table>`;

  await createTransporter().sendMail({
    from: `"Shiv Aadi Website" <${process.env.SMTP_USER}>`,
    to,
    replyTo: data.email,
    subject: "New B2B Inquiry – Shiv Aadi",
    html: wrapInTemplate(body, "New B2B Inquiry Received"),
    text: [
      "New B2B Inquiry – Shiv Aadi",
      "",
      `Customer: ${data.name}`,
      `Company: ${data.company || "—"}`,
      `Phone: ${data.phone}`,
      `Email: ${data.email}`,
      `City: ${data.city || "—"}`,
      `Business Type: ${data.businessType}`,
      `Product: ${data.product || "—"}`,
      `Quantity: ${data.quantity || "—"}`,
      `Project: ${data.projectName || "—"}`,
      `Project Location: ${data.projectLocation || "—"}`,
      `Expected Date: ${data.expectedDate || "—"}`,
      `Message: ${data.message || "—"}`,
    ].join("\n"),
  });
}

export type ContactEmailData = {
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
};

export async function sendContactEmail(data: ContactEmailData): Promise<void> {
  const to = process.env.B2B_INQUIRY_EMAIL || process.env.SMTP_USER;
  if (!isEmailConfigured() || !to) {
    console.warn("[mailer] SMTP not configured – email notification skipped.");
    return;
  }

  const body = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row("Name", data.name)}
      ${row("Email", data.email)}
      ${row("Phone", data.phone)}
      ${row("Subject", data.subject)}
      <tr>
        <td style="padding:12px 0 4px;color:#7a7569;font-size:12px;text-transform:uppercase;letter-spacing:.5px;vertical-align:top;">Message</td>
        <td style="padding:12px 0 4px;color:#1a1a1a;font-size:14px;white-space:pre-wrap;">${escapeHtml(data.message)}</td>
      </tr>
    </table>`;

  await createTransporter().sendMail({
    from: `"Shiv Aadi Website" <${process.env.SMTP_USER}>`,
    to,
    replyTo: data.email,
    subject: `New Contact Message – ${data.subject || "General Enquiry"}`,
    html: wrapInTemplate(body, "New Contact Message Received"),
    text: [
      "New Contact Message – Shiv Aadi",
      "",
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      `Subject: ${data.subject || "—"}`,
      `Message: ${data.message}`,
    ].join("\n"),
  });
}