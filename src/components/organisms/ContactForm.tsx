"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Heading, Text } from "@/src/components/atoms/Typography";
import { Divider } from "@/src/components/atoms/Divider";
import { useSplitReveal } from "@/src/hooks/useSplitReveal";
import { useTransitionReady } from "@/src/hooks/useTransitionReady";
import { gsap, ScrollTrigger } from "@/src/lib/gsap-registry";
import { cn } from "@/lib/utils";

interface FieldState {
  value: string;
  touched: boolean;
  valid: boolean;
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function ContactForm() {
  const t = useTranslations("contact");
  const sectionRef = useSplitReveal();
  const leftRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [mounted, setMounted] = useState(false);
  const ready = useTransitionReady();

  useEffect(() => setMounted(true), []);

  // Stagger reveal — left info + form fields (wait for page transition)
  useEffect(() => {
    if (!ready) return;

    const left = leftRef.current;
    const form = formRef.current;
    if (!left || !form) return;

    const items = [
      ...Array.from(left.querySelectorAll<HTMLElement>("[data-reveal]")),
      ...Array.from(form.querySelectorAll<HTMLElement>("[data-reveal]")),
    ];

    // Check if section is already in view (scroll restoration or mobile)
    const rect = left.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight * 0.82;

    if (isInView) {
      gsap.set(items, { y: 0, autoAlpha: 1 });
      return;
    }

    gsap.set(items, { y: 40, autoAlpha: 0 });

    const st = ScrollTrigger.create({
      trigger: left,
      start: "top 82%",
      once: true,
      onEnter: () => {
        gsap.to(items, {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: "power4.inOut",
          stagger: 0.08,
          onComplete: () => { gsap.set(items, { clearProps: "all" }); },
        });
      },
    });

    return () => st.kill();
  }, [mounted, ready]);

  const [fields, setFields] = useState<Record<string, FieldState>>({
    name: { value: "", touched: false, valid: false },
    email: { value: "", touched: false, valid: false },
    subject: { value: "", touched: false, valid: false },
    message: { value: "", touched: false, valid: false },
  });

  const [submitted, setSubmitted] = useState(false);

  const updateField = (name: string, value: string) => {
    let valid = value.trim().length > 0;
    if (name === "email") valid = validateEmail(value);
    if (name === "message") valid = value.trim().length >= 10;
    setFields((prev) => ({ ...prev, [name]: { value, touched: true, valid } }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const updated = { ...fields };
    let allValid = true;
    for (const key of Object.keys(updated)) {
      updated[key].touched = true;
      if (!updated[key].valid) allValid = false;
    }
    setFields(updated);
    if (allValid) setSubmitted(true);
  };

  const getFieldClasses = (name: string) => {
    const field = fields[name];
    if (!field.touched) return "border-border/60";
    if (field.valid) return "border-success/40";
    return "border-destructive";
  };

  const inputBase =
    "w-full border-b bg-transparent px-0 py-4 text-foreground outline-none transition-colors duration-300 placeholder:text-muted-foreground/40 focus:border-foreground";

  const labelClass =
    "mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground";

  if (!mounted) {
    return <section id="contact" className="noise-bg section-padding" />;
  }

  if (submitted) {
    return (
      <section id="contact" className="noise-bg section-padding">
        <div className="max-width">
          <div className="mx-auto max-w-lg text-center">
            <div className="inline-flex size-14 items-center justify-center rounded-full bg-primary/10">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-7 text-primary">
                <path d="M11.25 14.25L9 12" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 10.5L11.25 14.25" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="mt-6 font-sans text-xs uppercase tracking-widest text-muted-foreground">
              {t("successLabel")}
            </p>
            <Heading as="h3" className="mt-3 font-serif">
              {t("successTitle")}
            </Heading>
            <Text className="mt-4 text-muted-foreground">
              {t("successMessage")}
            </Text>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="noise-bg section-padding">
      <div ref={sectionRef} className="max-width">
        <Divider className="mb-16 md:mb-20" />

        <div className="grid gap-16 md:grid-cols-2 md:gap-24">

          {/* ── Left column ─────────────────────────────────── */}
          <div ref={leftRef}>
            <div data-reveal className="flex flex-col gap-3">
              <Text variant="label" className="text-primary">
                {t("label")}
              </Text>
              <h2
                className="font-serif leading-tight tracking-tight text-card-foreground"
                style={{ fontSize: "var(--type-h2)" }}
              >
                {t("title")}
              </h2>
              <p className="mt-1 max-w-[36ch] font-sans text-base leading-relaxed text-muted-foreground">
                {t("description")}
              </p>
            </div>

            {/* Contact details */}
            <div data-reveal className="mt-12 space-y-6">
              <div>
                <p className="mb-1 font-sans text-xs uppercase tracking-widest text-muted-foreground/60">
                  {t("emailLabel")}
                </p>
                <a
                  href="mailto:contacto@marialuisademateo.com"
                  className="font-serif italic text-lg text-foreground underline-offset-4 transition-opacity hover:opacity-70"
                >
                  contacto@marialuisademateo.com
                </a>
              </div>
              <div>
                <p className="mb-1 font-sans text-xs uppercase tracking-widest text-muted-foreground/60">
                  {t("locationLabel")}
                </p>
                <p className="font-serif italic text-lg text-foreground">
                  {t("location")}
                </p>
              </div>
            </div>
          </div>

          {/* ── Right column — form ──────────────────────────── */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-8"
            noValidate
          >
            <div data-reveal className="grid gap-8 md:grid-cols-2">
              {/* Name */}
              <div>
                <label htmlFor="name" className={labelClass}>
                  {t("nameLabel")} <span className="text-primary">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder={t("namePlaceholder")}
                  value={fields.name.value}
                  onChange={(e) => updateField("name", e.target.value)}
                  onBlur={() => updateField("name", fields.name.value)}
                  className={cn(inputBase, getFieldClasses("name"))}
                  required
                />
                {fields.name.touched && !fields.name.valid && (
                  <p className="mt-2 text-xs text-destructive">{t("nameError")}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className={labelClass}>
                  {t("emailFieldLabel")} <span className="text-primary">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  value={fields.email.value}
                  onChange={(e) => updateField("email", e.target.value)}
                  onBlur={() => updateField("email", fields.email.value)}
                  className={cn(inputBase, getFieldClasses("email"))}
                  required
                />
                {fields.email.touched && !fields.email.valid && (
                  <p className="mt-2 text-xs text-destructive">{t("emailError")}</p>
                )}
              </div>
            </div>

            {/* Subject */}
            <div data-reveal>
              <label htmlFor="subject" className={labelClass}>
                {t("subjectLabel")} <span className="text-primary">*</span>
              </label>
              <select
                id="subject"
                value={fields.subject.value}
                onChange={(e) => updateField("subject", e.target.value)}
                onBlur={() => updateField("subject", fields.subject.value)}
                className={cn(
                  inputBase,
                  "cursor-pointer appearance-none",
                  getFieldClasses("subject"),
                  !fields.subject.value && "text-muted-foreground/40"
                )}
                required
              >
                <option value="" disabled>{t("subjectPlaceholder")}</option>
                <option value="acquisition">{t("subjectAcquisition")}</option>
                <option value="commission">{t("subjectCommission")}</option>
                <option value="exhibition">{t("subjectExhibition")}</option>
                <option value="press">{t("subjectPress")}</option>
                <option value="other">{t("subjectOther")}</option>
              </select>
              {fields.subject.touched && !fields.subject.valid && (
                <p className="mt-2 text-xs text-destructive">{t("subjectError")}</p>
              )}
            </div>

            {/* Message */}
            <div data-reveal>
              <label htmlFor="message" className={labelClass}>
                {t("messageLabel")} <span className="text-primary">*</span>
              </label>
              <textarea
                id="message"
                rows={4}
                placeholder={t("messagePlaceholder")}
                value={fields.message.value}
                onChange={(e) => updateField("message", e.target.value)}
                onBlur={() => updateField("message", fields.message.value)}
                className={cn(inputBase, "resize-none border-b", getFieldClasses("message"))}
                required
              />
              {fields.message.touched && !fields.message.valid && (
                <p className="mt-2 text-xs text-destructive">
                  {t("messageError")}
                </p>
              )}
            </div>

            <div data-reveal className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center border border-primary bg-primary px-10 py-4 text-xs font-medium uppercase tracking-widest text-white transition-all duration-300 hover:bg-transparent hover:text-primary active:scale-[0.98]"
              >
                {t("submit")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
