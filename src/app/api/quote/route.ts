import { Resend } from "resend";
import { CONTACT } from "@/data/products";

export const runtime = "nodejs";

type QuoteBody = {
  name?: string;
  phone?: string;
  email?: string;
  area?: string;
  message?: string;
  interests?: string[];
  interestLabels?: string[];
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildEmailHtml(data: Required<Pick<QuoteBody, "name" | "phone">> & QuoteBody) {
  const interests =
    data.interestLabels && data.interestLabels.length > 0
      ? data.interestLabels.map(escapeHtml).join(", ")
      : "—";

  return `
    <div style="font-family:Segoe UI,Arial,sans-serif;line-height:1.5;color:#141414">
      <h2 style="margin:0 0 12px">Νέο αίτημα προσφοράς — BUILDART</h2>
      <p style="margin:0 0 16px;color:#555">Έλαβε νέα αίτηση από τη φόρμα επικοινωνίας.</p>
      <table style="border-collapse:collapse;width:100%;max-width:560px">
        <tr><td style="padding:8px 0;color:#777;width:140px">Όνομα</td><td style="padding:8px 0">${escapeHtml(data.name)}</td></tr>
        <tr><td style="padding:8px 0;color:#777">Τηλέφωνο</td><td style="padding:8px 0">${escapeHtml(data.phone)}</td></tr>
        <tr><td style="padding:8px 0;color:#777">Email</td><td style="padding:8px 0">${escapeHtml(data.email || "—")}</td></tr>
        <tr><td style="padding:8px 0;color:#777">Περιοχή</td><td style="padding:8px 0">${escapeHtml(data.area || "—")}</td></tr>
        <tr><td style="padding:8px 0;color:#777">Ενδιαφέροντα</td><td style="padding:8px 0">${interests}</td></tr>
        <tr><td style="padding:8px 0;color:#777;vertical-align:top">Μήνυμα</td><td style="padding:8px 0;white-space:pre-wrap">${escapeHtml(data.message || "—")}</td></tr>
      </table>
    </div>
  `;
}

async function sendWithWeb3Forms(payload: Record<string, unknown>) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) return null;

  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: accessKey,
      ...payload,
    }),
  });

  const data = (await res.json()) as { success?: boolean; message?: string };
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Web3Forms delivery failed");
  }
  return true;
}

async function sendWithResend(input: {
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  const resend = new Resend(apiKey);
  const to = process.env.CONTACT_TO_EMAIL || CONTACT.email;
  const from =
    process.env.CONTACT_FROM_EMAIL || "BUILDART <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from,
    to: [to],
    subject: input.subject,
    html: input.html,
    replyTo: input.replyTo || undefined,
  });

  if (error) throw new Error(error.message);
  return true;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as QuoteBody;
    const name = body.name?.trim() || "";
    const phone = body.phone?.trim() || "";
    const email = body.email?.trim() || "";
    const area = body.area?.trim() || "";
    const message = body.message?.trim() || "";
    const interestLabels = Array.isArray(body.interestLabels)
      ? body.interestLabels.filter((v) => typeof v === "string")
      : [];
    const interests = Array.isArray(body.interests)
      ? body.interests.filter((v) => typeof v === "string")
      : [];

    if (!name || phone.replace(/\D/g, "").length < 10) {
      return Response.json(
        { ok: false, error: "Συμπλήρωσε όνομα και έγκυρο τηλέφωνο." },
        { status: 400 },
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { ok: false, error: "Μη έγκυρο email." },
        { status: 400 },
      );
    }

    const subject = `Νέο αίτημα προσφοράς — ${name}`;
    const html = buildEmailHtml({
      name,
      phone,
      email,
      area,
      message,
      interestLabels,
      interests,
    });

    const viaWeb3 = await sendWithWeb3Forms({
      subject,
      from_name: name,
      email: email || CONTACT.email,
      phone,
      area,
      message,
      interests: interestLabels.join(", ") || "—",
      to: process.env.CONTACT_TO_EMAIL || CONTACT.email,
    });

    if (!viaWeb3) {
      const viaResend = await sendWithResend({
        subject,
        html,
        replyTo: email || undefined,
      });

      if (!viaResend) {
        return Response.json(
          {
            ok: false,
            error:
              "Δεν έχει ρυθμιστεί αποστολή email. Πρόσθεσε WEB3FORMS_ACCESS_KEY ή RESEND_API_KEY.",
          },
          { status: 503 },
        );
      }
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("[quote API]", error);
    return Response.json(
      { ok: false, error: "Η αποστολή απέτυχε. Δοκίμασε ξανά σε λίγο." },
      { status: 500 },
    );
  }
}
