import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/src/lib/contact-schema";

// TODO: change to marialuisa@demateo.mx after verifying domain in Resend
const RECIPIENT_EMAIL = "karen.ortizg@yahoo.com";
const SCORE_THRESHOLD = 0.5;

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.error("RECAPTCHA_SECRET_KEY is not set");
    return false;
  }

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }),
  });

  const data = await res.json();
  console.log("reCAPTCHA response:", JSON.stringify(data));

  // v3 returns a score (0.0–1.0), v2 returns only success boolean
  if (data.score !== undefined) {
    return data.success === true && data.score >= SCORE_THRESHOLD;
  }
  return data.success === true;
}

const SUBJECT_LABELS: Record<string, string> = {
  acquisition: "Adquisición de obra",
  commission: "Encargo de retrato",
  exhibition: "Exposición / Colaboración",
  press: "Prensa / Medios",
  other: "Otro",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, subject, message, recaptchaToken } = parsed.data;

    // Verify reCAPTCHA
    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return NextResponse.json(
        { error: "recaptcha" },
        { status: 403 }
      );
    }

    // Send email via Resend
    const { data, error } = await getResend().emails.send({
      from: "Portafolio <onboarding@resend.dev>",
      to: RECIPIENT_EMAIL,
      replyTo: email,
      subject: `[Contacto] ${SUBJECT_LABELS[subject] ?? subject} — ${name}`,
      text: [
        `Nombre: ${name}`,
        `Email: ${email}`,
        `Asunto: ${SUBJECT_LABELS[subject] ?? subject}`,
        "",
        message,
      ].join("\n"),
    });

    if (error) {
      console.error("Resend error:", JSON.stringify(error));
      return NextResponse.json(
        { error: "email", detail: error.message },
        { status: 500 }
      );
    }

    console.log("Email sent:", data?.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact API error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: "server", detail: message }, { status: 500 });
  }
}
