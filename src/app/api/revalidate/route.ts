import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { revalidateTag } from "next/cache";

// Sanity webhook → on-demand revalidation. Configure the webhook
// (manage.sanity.io → API → Webhooks) to POST to /api/revalidate with:
//   - Dataset: production
//   - Trigger on: Create, Update, Delete
//   - Filter (GROQ): _type in ["project", "article", "aboutPage", "contactPage", "siteSettings"]
//   - Projection: { _type }
//   - Secret: SANITY_REVALIDATE_SECRET (same value as the env var)
// Sanity signs the request with HMAC-SHA256 in the `sanity-webhook-signature`
// header; we verify with @sanity/webhook against SANITY_REVALIDATE_SECRET,
// then revalidate every cache entry tagged with the document's `_type`.

const KNOWN_TYPES = new Set([
  "project",
  "article",
  "aboutPage",
  "contactPage",
  "siteSettings",
]);

export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    console.error("Revalidate: SANITY_REVALIDATE_SECRET is not set.");
    return Response.json(
      { revalidated: false, error: "Revalidation is not configured." },
      { status: 500 },
    );
  }

  const signature = request.headers.get(SIGNATURE_HEADER_NAME);
  if (!signature) {
    return Response.json(
      { revalidated: false, error: "Missing signature." },
      { status: 401 },
    );
  }

  // Read the raw body before parsing — the signature is computed against
  // the exact bytes Sanity sent, so any re-stringification will mismatch.
  const body = await request.text();
  if (!(await isValidSignature(body, signature, secret))) {
    return Response.json(
      { revalidated: false, error: "Invalid signature." },
      { status: 401 },
    );
  }

  let payload: { _type?: unknown };
  try {
    payload = JSON.parse(body);
  } catch {
    return Response.json(
      { revalidated: false, error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const type = typeof payload._type === "string" ? payload._type : null;
  if (!type || !KNOWN_TYPES.has(type)) {
    return Response.json(
      { revalidated: false, error: `Unknown or missing _type: ${type ?? "null"}.` },
      { status: 400 },
    );
  }

  revalidateTag(type);
  return Response.json({ revalidated: true, type });
}
