import type { Intake } from "./types";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const wrap = (inner: string) =>
  `<div style="font-family:'DM Sans',Arial,sans-serif;color:#0f0f0f;line-height:1.6;max-width:640px;margin:0 auto;padding:8px;">${inner}</div>`;

const signature = () =>
  `<p>Met vriendelijke groet,<br>${esc(process.env.BREVO_SENDER_NAME ?? "Digital Twin Advies")}</p>`;

export function consultantEmailHtml(
  it: { bedrijfsnaam: string; contactpersoon: string; email: string },
  detailUrl: string,
): string {
  return wrap(`
    <h2 style="font-family:Georgia,serif;color:#1a4d8f;">Nieuwe intake ontvangen</h2>
    <p>Er is een nieuwe digital-twin intake binnengekomen:</p>
    <table style="border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:4px 14px 4px 0;color:#7a7a7a;">Bedrijf</td><td><strong>${esc(it.bedrijfsnaam)}</strong></td></tr>
      <tr><td style="padding:4px 14px 4px 0;color:#7a7a7a;">Contact</td><td>${esc(it.contactpersoon)}</td></tr>
      <tr><td style="padding:4px 14px 4px 0;color:#7a7a7a;">E-mail</td><td>${esc(it.email)}</td></tr>
    </table>
    ${
      detailUrl
        ? `<p style="margin-top:18px;"><a href="${detailUrl}" style="background:#1a4d8f;color:#fff;padding:10px 18px;border-radius:4px;text-decoration:none;display:inline-block;">Open in dashboard →</a></p>`
        : ""
    }
  `);
}

export function prospectEmailHtml(it: { contactpersoon: string; bedrijfsnaam: string }): string {
  return wrap(`
    <h2 style="font-family:Georgia,serif;color:#1a4d8f;">Bedankt voor uw aanvraag</h2>
    <p>Beste ${esc(it.contactpersoon || "relatie")},</p>
    <p>We hebben de intake voor <strong>${esc(it.bedrijfsnaam)}</strong> in goede orde ontvangen.
    We bekijken uw antwoorden en nemen binnen 2 werkdagen contact met u op met een implementatieplan op maat.</p>
    ${signature()}
  `);
}

/** Minimal markdown → HTML for the plan e-mail (headings, bold, bullets). */
export function planMarkdownToHtml(md: string): string {
  return esc(md)
    .replace(
      /^##\s+(.+)$/gm,
      '<h3 style="font-family:Georgia,serif;color:#0f0f0f;margin:18px 0 6px;">$1</h3>',
    )
    .replace(/^#\s+(.+)$/gm, '<h2 style="font-family:Georgia,serif;color:#0f0f0f;">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^[-*]\s+(.+)$/gm, "• $1")
    .replace(/\n/g, "<br>");
}

export function planEmailHtml(it: Intake): string {
  return wrap(`
    <h2 style="font-family:Georgia,serif;color:#1a4d8f;">Digital Twin Implementatieplan</h2>
    <p>Beste ${esc(it.contactpersoon || "relatie")},</p>
    <p>Hierbij het op maat gemaakte implementatieplan voor <strong>${esc(it.bedrijfsnaam)}</strong>.</p>
    <hr style="border:none;border-top:1px solid #d8d4cc;margin:16px 0;">
    <div style="font-size:14px;">${planMarkdownToHtml(it.gegenereerd_plan ?? "")}</div>
    <hr style="border:none;border-top:1px solid #d8d4cc;margin:16px 0;">
    ${signature()}
  `);
}
