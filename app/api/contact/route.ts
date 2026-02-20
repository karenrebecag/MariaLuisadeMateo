import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/src/lib/contact-schema";

const resend = new Resend(process.env.RESEND_API_KEY);

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY!;
const RECIPIENT_EMAIL = "marialuisa@demateo.mx";
const SCORE_THRESHOLD = 0.5;

async function verifyRecaptcha(token: string): Promise<boolean> {
  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: RECAPTCHA_SECRET,
      response: token,
    }),
  });

  const data = await res.json();
  return data.success === true && (data.score ?? 0) >= SCORE_THRESHOLD;
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
    const { error } = await resend.emails.send({
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
      console.error("Resend error:", error);
      return NextResponse.json({ error: "email" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
