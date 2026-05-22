// Contact form handler — validates the submission and emails it via the
// Resend HTTP API. Requires RESEND_API_KEY in the environment, and the
// sending domain (aledpritchard.com) verified in Resend.

const TO = "hello@aledpritchard.com";
const FROM = "Contact form <contact@aledpritchard.com>";
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { success: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  const body = (payload ?? {}) as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !EMAIL_RE.test(email) || !message) {
    return Response.json(
      { success: false, error: "Missing or invalid fields." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Contact form: RESEND_API_KEY is not set.");
    return Response.json(
      { success: false, error: "Email is not configured." },
      { status: 500 },
    );
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      reply_to: email,
      subject: subject ? `Contact form — ${subject}` : "Contact form message",
      text: `From: ${name} <${email}>\nSubject: ${subject || "—"}\n\n${message}`,
    }),
  });

  if (!res.ok) {
    console.error(
      "Contact form: Resend send failed.",
      res.status,
      await res.text(),
    );
    return Response.json(
      { success: false, error: "Could not send your message." },
      { status: 502 },
    );
  }

  return Response.json({ success: true });
}
